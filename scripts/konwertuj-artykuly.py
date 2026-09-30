# -*- coding: utf-8 -*-
"""
Zamienia archiwalny HTML artykulu ze starego WordPressa na format blokow,
w ktorym stoja obecne artykuly (patrz src/api/blogContent.js).

Bloki: h, p, ul, tabela, uwaga, przyklad, zrodlo.
Pogrubienie w tekscie zapisujemy jako **tak**, bo tak czyta je szablon.
"""
import re, html, json, glob, os, sys
from html.parser import HTMLParser

MIESIACE = {'stycznia':1,'lutego':2,'marca':3,'kwietnia':4,'maja':5,'czerwca':6,
            'lipca':7,'sierpnia':8,'wrzesnia':9,'września':9,'pazdziernika':10,
            'października':10,'listopada':11,'grudnia':12}
MIESIAC_NAZWA = ['','Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec',
                 'Sierpień','Wrzesień','Październik','Listopad','Grudzień']

BLOKOWE = {'p','h1','h2','h3','h4','li','td','th','blockquote'}
# Znaczniki, ktore moga zawierac kolejne bloki. <div> bez takiego dziecka
# jest w praktyce akapitem — czesc starych artykulow ma cala tresc
# w golych <div>, po jednym na linie, bo byla wklejana do WordPressa
# bez formatowania.
KONTENERY = {'div','section','article','main','td','th','li','blockquote'}
POMIJANE = {'script','style','nav','form','button','svg','iframe','noscript'}


class Czytnik(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.bloki = []
        self.bufor = []          # skladany tekst biezacego bloku
        self.typ = None          # jaki blok skladamy
        self.stos_pomin = 0
        self.lista = None        # zbierane <li>
        self.tabela = None       # {'h': [...], 'x': [[...]]}
        self.wiersz = None
        self.w_thead = False
        self.pogrubienie = 0
        self.lista_z_divow = None
        self.glebokosc_div = 0

    # --- pomocnicze -----------------------------------------------------
    def dopisz(self, t):
        if self.typ is not None or self.wiersz is not None:
            self.bufor.append(t)

    def zamknij_blok(self):
        tekst = ''.join(self.bufor)
        tekst = re.sub(r'\*\*\s*\*\*', '', tekst)        # puste pogrubienia
        tekst = re.sub(r'[ \t ]+', ' ', tekst)
        tekst = re.sub(r'\s*\n\s*', ' ', tekst).strip()
        tekst = re.sub(r'\s+([,.;:!?])', r'\1', tekst)
        # Emoji i znaki ozdobne. Stare artykuly sa nimi upstrzone, nowe
        # nie maja ani jednego. Zostawienie ich dawaloby serwis pisany
        # dwoma roznymi glosami.
        tekst = re.sub('[\U0001F000-\U0001FAFF\u2190-\u21FF\u2300-\u27BF\u2B00-\u2BFF\uFE0F\u2022]', '', tekst)
        tekst = re.sub(r'[ \t]+', ' ', tekst).strip()
        tekst = re.sub(r'\s+([,.;:!?])', r'\1', tekst)
        self.bufor = []
        t = self.typ
        self.typ = None
        if not tekst:
            return None
        return (t, tekst)

    # --- start ----------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        if self.stos_pomin:
            if tag in POMIJANE: self.stos_pomin += 1
            return
        if tag in POMIJANE:
            self.stos_pomin = 1
            return

        if tag in ('strong', 'b'):
            if self.typ or self.wiersz is not None:
                self.pogrubienie += 1
                self.dopisz('**')
            return
        if tag == 'br':
            self.dopisz(' ')
            return
        if tag in ('ul', 'ol'):
            self.lista = []
            return
        if tag == 'table':
            self.tabela = {'h': [], 'x': []}
            return
        if tag == 'thead':
            self.w_thead = True
            return
        if tag == 'tr':
            self.wiersz = []
            return
        if tag in ('td', 'th'):
            self.bufor = []
            self.typ = 'komorka'
            return
        if tag in BLOKOWE:
            # niedomkniety poprzedni blok po prostu zamykamy
            if self.typ: self._odloz(self.zamknij_blok())
            self.bufor = []
            self.typ = {'h1':'h','h2':'h','h3':'h','h4':'h','p':'p','li':'li',
                        'blockquote':'uwaga'}.get(tag, 'p')
            return

        if tag == 'div':
            # Zagniezdzony div konczy to, co zbieralismy wyzej: tekst
            # nalezal do rodzica, a nie do nowego pudelka.
            if self.typ == 'div': self._odloz(self.zamknij_blok())
            if self.typ is None:
                self.bufor = []
                self.typ = 'div'
            self.glebokosc_div = getattr(self, 'glebokosc_div', 0) + 1
            return

    # --- koniec ---------------------------------------------------------
    def handle_endtag(self, tag):
        if self.stos_pomin:
            if tag in POMIJANE: self.stos_pomin -= 1
            return

        if tag in ('strong', 'b'):
            if self.pogrubienie:
                self.pogrubienie -= 1
                self.dopisz('**')
            return
        if tag in ('td', 'th'):
            w = self.zamknij_blok()
            tekst = w[1] if w else ''
            if self.wiersz is not None:
                self.wiersz.append(tekst)
            return
        if tag == 'tr':
            if self.tabela is not None and self.wiersz:
                if self.w_thead and not self.tabela['h']:
                    self.tabela['h'] = self.wiersz
                else:
                    self.tabela['x'].append(self.wiersz)
            self.wiersz = None
            return
        if tag == 'thead':
            self.w_thead = False
            return
        if tag == 'table':
            if self.tabela and self.tabela['x']:
                # tabela bez naglowka: pierwszy wiersz idzie za naglowek,
                # jesli wszystkie komorki sa krotkie
                if not self.tabela['h'] and len(self.tabela['x']) > 1:
                    p = self.tabela['x'][0]
                    if all(len(c) < 40 for c in p):
                        self.tabela['h'] = p
                        self.tabela['x'] = self.tabela['x'][1:]
                blok = {'t': 'tabela', 'x': self.tabela['x']}
                if self.tabela['h']: blok['h'] = self.tabela['h']
                self.bloki.append(blok)
            self.tabela = None
            return
        if tag in ('ul', 'ol'):
            if self.lista:
                self.bloki.append({'t': 'ul', 'x': self.lista})
            self.lista = None
            return
        if tag == 'div':
            self.glebokosc_div = max(0, getattr(self, 'glebokosc_div', 0) - 1)
            if self.typ == 'div':
                self._odloz(self.zamknij_blok())
            return

        if tag in BLOKOWE:
            self._odloz(self.zamknij_blok())

    def handle_data(self, dane):
        if self.stos_pomin: return
        self.dopisz(dane)

    def _domknij_liste(self):
        if self.lista_z_divow:
            self.bloki.append({'t': 'ul', 'x': self.lista_z_divow})
        self.lista_z_divow = None

    def _odloz(self, w):
        if not w: return
        t, tekst = w
        if t == 'div':
            # Gwiazdka albo mysnik na poczatku linii to pozycja listy.
            m = re.match(r'^[\*\u2022\u2013\u2014-]\s+(.+)$', tekst)
            if m:
                if self.lista_z_divow is None: self.lista_z_divow = []
                self.lista_z_divow.append(m.group(1).strip())
                return
            self._domknij_liste()
            # Krotka linia zakonczona pytajnikiem to w tych artykulach
            # naglowek sekcji, nie akapit.
            t = 'h' if (len(tekst) < 110 and tekst.rstrip().endswith('?')) else 'p'
        else:
            self._domknij_liste()
        if t == 'li':
            if self.lista is not None: self.lista.append(tekst)
            else: self.bloki.append({'t': 'p', 'x': tekst})
        elif t == 'komorka':
            pass
        else:
            self.bloki.append({'t': t, 'x': tekst})


def wytnij_tresc(s):
    i = s.find('<div class="post-content">')
    if i < 0: return ''
    body = s[i + len('<div class="post-content">'):]
    for koniec in ['<div class="single-post-nav', '<nav', '<footer', '</article', '<div class="comments']:
        j = body.find(koniec)
        if j > 0:
            body = body[:j]
            break
    return body


def przerob(sciezka):
    s = open(sciezka, encoding='utf-8', errors='replace').read()
    slug = os.path.basename(sciezka)[:-5]

    t = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    tytul = html.unescape(re.sub(r'<[^>]+>', '', t.group(1))).strip() if t else ''
    tytul = re.sub(r'\s+', ' ', tytul)

    d = re.search(r'<span class="single-post-date">([^<]+)</span>', s)
    data_iso, data_label = '', ''
    if d:
        surowa = d.group(1).strip()
        m = re.match(r'(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(\d{4})', surowa, re.I)
        if m:
            dzien, mies, rok = int(m.group(1)), MIESIACE.get(m.group(2).lower(), 0), int(m.group(3))
            if mies:
                data_iso = f'{rok:04d}-{mies:02d}-{dzien:02d}'
                data_label = surowa
    czytnik = Czytnik()
    czytnik.feed(wytnij_tresc(s))
    czytnik.close()
    if czytnik.typ:
        czytnik._odloz(czytnik.zamknij_blok())
    czytnik._domknij_liste()

    bloki = [b for b in czytnik.bloki if (b['t'] != 'p' or len(b['x']) > 1)]
    return {'slug': slug, 'tytul': tytul, 'data': data_iso, 'dataLabel': data_label, 'bloki': bloki}


if __name__ == '__main__':
    kat = os.path.dirname(os.path.abspath(__file__))
    wynik, problemy = [], []
    for p in sorted(glob.glob(os.path.join(kat, 'archiwum', '*.html'))):
        a = przerob(p)
        def dlugosc_bloku(b):
            x = b['x']
            if isinstance(x, str): return len(x)
            if isinstance(x, list):
                return sum(len(e) if isinstance(e, str) else sum(len(c) for c in e) for e in x)
            return 0
        znakow = sum(dlugosc_bloku(b) for b in a['bloki'])
        a['znakow'] = znakow
        if not a['tytul'] or not a['data'] or znakow < 300:
            problemy.append((a['slug'], a['tytul'][:40], a['data'], znakow))
        wynik.append(a)
    json.dump(wynik, open(os.path.join(kat, 'artykuly.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'przerobionych: {len(wynik)}')
    print(f'do sprawdzenia: {len(problemy)}')
    for p in problemy[:15]:
        print('   ', p)
