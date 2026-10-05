// Wyciaga z gotowej strony artykulu SZABLON dla panelu redakcyjnego.
//
// Po co to istnieje
// -----------------
// Panel w PHP stoi na hostingu klienta, gdzie nie ma Node'a, wiec nie moze
// przebudowac aplikacji Reacta. Musi skladac strone artykulu sam. Gdyby
// szablon byl pisany recznie, mielibysmy dwa opisy tego samego wygladu:
// jeden w komponentach Reacta, drugi w PHP. Rozjechalyby sie przy pierwszej
// zmianie stylu i nikt by tego nie zauwazyl, bo obie wersje wygladalyby
// poprawnie osobno.
//
// Dlatego szablon nie jest pisany, tylko WYPADA z budowania: bierzemy
// prawdziwy, prerenderowany artykul i zastepujemy w nim pola znacznikami
// @@...@@. Dzieki temu ma zawsze aktualna nawigacje, stopke, aktualne nazwy
// plikow /assets/main-<odcisk>.js i te same znaczniki meta co reszta serwisu.
//
// Zasada nadrzedna: KAZDE podstawienie musi trafic dokladnie raz. Jesli
// ktorekolwiek nie trafi, skrypt przerywa budowanie. Cichy szablon z
// niepodmienionym tytulem byłby najgorszym z mozliwych wynikow, bo panel
// produkowalby setki stron z cudzym tytulem.

import fs from 'node:fs';
import path from 'node:path';

const KORZEN = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(KORZEN, 'dist');

// Artykul wzorcowy. Dowolny istniejacy, byle mial komplet elementow:
// obrazek, metryczke, tresc i sasiadow.
const WZORZEC = process.env.DGC_WZORZEC || 'akcyza-na-papierosy';

const zrodlo = path.join(DIST, 'porady', WZORZEC, 'index.html');
if (!fs.existsSync(zrodlo)) {
    console.error(`[szablon] brak artykulu wzorcowego: ${zrodlo}`);
    process.exit(1);
}

let html = fs.readFileSync(zrodlo, 'utf8');
const bledy = [];

/**
 * Podmiana z kontrola. `ile` mowi, ile trafien jest oczekiwanych — jesli
 * wyjdzie inaczej, odnotowujemy blad zamiast po cichu isc dalej.
 */
function podmien(opis, wzor, czym, ile = 1) {
    const trafienia = html.match(wzor);
    const liczba = trafienia ? (wzor.global ? trafienia.length : 1) : 0;
    if (liczba !== ile) {
        bledy.push(`${opis}: oczekiwano ${ile} trafien, jest ${liczba}`);
        return;
    }
    html = html.replace(wzor, czym);
}

// --- glowa dokumentu ---------------------------------------------------

podmien('tytul strony', /<title>[\s\S]*?<\/title>/, '<title>@@TYTUL_STRONY@@</title>');
podmien('opis', /<meta name="description" content="[^"]*">/, '<meta name="description" content="@@OPIS@@">');
podmien('kanoniczny', /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="@@KANONICZNY@@">');

podmien('og:title', /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="@@TYTUL_STRONY@@">');
podmien('og:description', /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="@@OPIS@@">');
podmien('og:url', /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="@@KANONICZNY@@">');
podmien('twitter:title', /<meta name="twitter:title" content="[^"]*">/, '<meta name="twitter:title" content="@@TYTUL_STRONY@@">');
podmien('twitter:description', /<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="@@OPIS@@">');

// --- ziarno tresci dla przegladarki ------------------------------------
// Bez niego React przy pierwszym rysowaniu nie mialby tresci i zglosilby
// rozjazd wzgledem HTML-a przyslanego przez serwer.
podmien(
    'ziarno tresci',
    /<script type="application\/json" id="dgc-tresc" data-slug="[^"]*">[\s\S]*?<\/script>/,
    '<script type="application/json" id="dgc-tresc" data-slug="@@SLUG@@">@@ZIARNO@@</script>'
);

// --- dane strukturalne -------------------------------------------------
// Na stronie artykulu stoja dwa bloki JSON-LD: Article i BreadcrumbList.
// Oba niosa tytul, date i adres, wiec panel musi je skladac sam.
podmien(
    'dane strukturalne',
    /(<script type="application\/ld\+json">[\s\S]*?<\/script>\s*){1,3}/,
    '@@SCHEMAT@@'
);

// --- naglowek podstrony ------------------------------------------------

podmien('tytul w okruszkach', /<h1>[\s\S]*?<\/h1>/, '<h1>@@TYTUL@@</h1>');

// --- artykul -----------------------------------------------------------

// Obrazek razem z wymiarami. Wymiary sa znacznikami, bo zdjecie wgrane
// z panelu ma inne proporcje niz okladka firmowa, a zle wymiary oznaczaja
// przeskok ukladu dokladnie tam, gdzie mialy mu zapobiec.
podmien(
    'obrazek',
    /<div class="entry-media"><img[^>]*><\/div>/,
    '<div class="entry-media"><img width="@@OBRAZEK_W@@" height="@@OBRAZEK_H@@"'
    + ' decoding="async" src="@@OBRAZEK@@" alt=""></div>'
);

podmien(
    'metryczka',
    /<div class="entry-meta"><ul>[\s\S]*?<\/ul><\/div>/,
    '<div class="entry-meta"><ul>'
    + '<li><i class="fi flaticon-user"></i> <!-- -->@@AUTOR@@</li>'
    + '<li><i class="fi flaticon-calendar"></i> <!-- -->@@DATA@@</li>'
    + '<li><i class="fi flaticon-tag"></i> <!-- -->@@TAG@@</li>'
    + '</ul></div>'
);

// Tytul artykulu i cala tresc az do konca <article>.
podmien('tytul i tresc', /<h2>[\s\S]*?<\/article>/, '<h2>@@TYTUL@@</h2>@@TRESC@@</article>');

// Podobne wpisy w pasku bocznym. Dobierane z tej samej kategorii, wiec
// kazdy artykul ma tam inna trojke — panel musi je skladac sam, inaczej
// kazdy wpis dodany z panelu dostalby trojke artykulu wzorcowego.
podmien(
    'podobne wpisy',
    /<div class="widget recent-post-widget">[\s\S]*?(?=<div class="widget month-widget">)/,
    '<div class="widget recent-post-widget"><h3>Podobne wpisy</h3>'
    + '<div class="posts">@@PODOBNE@@</div></div>'
);

// Sasiedzi. Panel zna kolejnosc wpisow, wiec zbuduje ten blok sam.
podmien('sasiedzi', /<div class="more-posts">[\s\S]*?<\/div><\/div><\/div>/, '@@SASIEDZI@@');

// --- kontrola koncowa --------------------------------------------------

const ZNACZNIKI = [
    '@@TYTUL_STRONY@@', '@@OPIS@@', '@@KANONICZNY@@', '@@SLUG@@', '@@ZIARNO@@',
    '@@TYTUL@@', '@@OBRAZEK@@', '@@OBRAZEK_W@@', '@@OBRAZEK_H@@', '@@AUTOR@@', '@@DATA@@', '@@TAG@@', '@@TRESC@@', '@@SASIEDZI@@', '@@PODOBNE@@',
    '@@SCHEMAT@@',
];
for (const z of ZNACZNIKI) {
    if (!html.includes(z)) bledy.push(`brak znacznika ${z} w gotowym szablonie`);
}

// Zadna wartosc z artykulu wzorcowego nie ma prawa zostac w szablonie.
// To jest kontrola, ktora lapie sytuacje, gdy szablon HTML sie zmieni,
// a nasze wyrazenia beda dalej pasowac do czegos innego.
if (html.includes(WZORZEC)) {
    bledy.push(`slug artykulu wzorcowego (${WZORZEC}) zostal w szablonie`);
}

if (bledy.length) {
    console.error('[szablon] NIE zapisuje szablonu, bo budowa strony artykulu sie zmienila:');
    for (const b of bledy) console.error(`  - ${b}`);
    console.error('  Popraw wyrazenia w scripts/szablon.mjs i zbuduj ponownie.');
    process.exit(1);
}

const katalog = path.join(DIST, 'dane', 'szablon');
fs.mkdirSync(katalog, { recursive: true });
fs.writeFileSync(path.join(katalog, 'artykul.html'), html);

console.log(`Szablon artykulu: dane/szablon/artykul.html (${Math.round(html.length / 1024)} kB, wzorzec: ${WZORZEC})`);

// --- indeks wpisow jako dane -------------------------------------------
//
// Panel musi znac liste artykulow, a aplikacja Reacta musi sie dowiedziec
// o wpisach dodanych PO zbudowaniu strony. Jedno i drugie czyta ten plik.
//
// Pola tekstowe bierzemy z src/api/blogs.js (regexem, bo tego pliku nie da
// sie zaimportowac w czystym Node — importuje obrazki), a adres obrazka
// z gotowej strony artykulu, bo tam stoi juz nazwa z odciskiem.

const blogsJs = fs.readFileSync(path.join(KORZEN, 'src/api/blogs.js'), 'utf8');

const pole = (blok, nazwa) => {
    const m = blok.match(new RegExp(`${nazwa}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : '';
};

const wpisy = [];
for (const m of blogsJs.matchAll(/\{\s*id:[\s\S]*?\n {4}\},/g)) {
    const blok = m[0];
    const slug = pole(blok, 'slug');
    if (!slug) continue;

    // Adres obrazka z gotowej strony — tam jest juz nazwa z odciskiem.
    let obrazek = '';
    const strona = path.join(DIST, 'porady', slug, 'index.html');
    if (fs.existsSync(strona)) {
        const t = fs.readFileSync(strona, 'utf8');
        // Znacznik ma teraz tez wymiary i decoding, wiec nie szukamy src
        // tuz po <img, tylko gdziekolwiek w srodku znacznika.
        const o = t.match(/<div class="entry-media"><img[^>]*\ssrc="([^"]*)"/);
        if (o) obrazek = o[1];
    }

    wpisy.push({
        slug,
        title: pole(blok, 'title'),
        tag: pole(blok, 'tag'),
        description: pole(blok, 'description'),
        author: pole(blok, 'author') || 'DGC Biuro Rachunkowe',
        create_at: pole(blok, 'create_at'),
        archiveMonth: pole(blok, 'archiveMonth'),
        archiveLabel: pole(blok, 'archiveLabel'),
        obrazek,
    });
}

if (!wpisy.length) {
    console.error('[szablon] nie odczytalem ani jednego wpisu z blogs.js — przerywam');
    process.exit(1);
}

const bezObrazka = wpisy.filter((w) => !w.obrazek).length;
if (bezObrazka) console.warn(`[szablon] uwaga: ${bezObrazka} wpisow bez adresu obrazka`);

fs.mkdirSync(path.join(DIST, 'dane'), { recursive: true });
fs.writeFileSync(
    path.join(DIST, 'dane', 'wpisy.json'),
    JSON.stringify({ wersja: wpisy.length, wpisy }, null, 0)
);

// Tresci artykulow w postaci, ktora czyta panel. Te same pliki, co
// src/tresci/, tylko wystawione pod adresem publicznym.
const zrodloTresci = path.join(KORZEN, 'src', 'tresci');
const celTresci = path.join(DIST, 'dane', 'tresci');
fs.mkdirSync(celTresci, { recursive: true });
let skopiowane = 0;
for (const plik of fs.readdirSync(zrodloTresci)) {
    if (!plik.endsWith('.json')) continue;
    fs.copyFileSync(path.join(zrodloTresci, plik), path.join(celTresci, plik));
    skopiowane++;
}

console.log(`Dane dla panelu: ${wpisy.length} wpisow w dane/wpisy.json, ${skopiowane} plikow tresci`);

// --- szablon listy porad i pojedynczej karty ----------------------------
//
// Panel po dodaniu wpisu musi odswiezyc strony listy, inaczej nowy artykul
// nie mialby ani jednego odnosnika z HTML-a i powtorzylby sie problem,
// ktory wlasnie rozwiazalismy stronicowaniem.
//
// Karte wycinamy z gotowej listy i zamieniamy w niej wartosci PIERWSZEGO
// wpisu na znaczniki. Wartosci bierzemy z wpisy.json, wiec wiemy dokladnie,
// czego szukac — nie zgadujemy po ksztalcie HTML-a.

const listaHtmlSciezka = path.join(DIST, 'porady', 'index.html');
if (fs.existsSync(listaHtmlSciezka) && wpisy.length) {
    let lista = fs.readFileSync(listaHtmlSciezka, 'utf8');
    const bledyListy = [];

    const podmienWLiscie = (opis, wzor, czym) => {
        if (!wzor.test(lista)) { bledyListy.push(opis); return; }
        lista = lista.replace(wzor, czym);
    };

    podmienWLiscie('tytul', /<title>[\s\S]*?<\/title>/, '<title>@@TYTUL_STRONY@@</title>');
    podmienWLiscie('opis', /<meta name="description" content="[^"]*">/, '<meta name="description" content="@@OPIS@@">');
    podmienWLiscie('kanoniczny', /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="@@KANONICZNY@@">');
    podmienWLiscie('og:title', /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="@@TYTUL_STRONY@@">');
    podmienWLiscie('og:description', /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="@@OPIS@@">');
    podmienWLiscie('og:url', /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="@@KANONICZNY@@">');

    // Karty: wszystko od pierwszej karty do stronicowania.
    const poczatekKart = lista.indexOf('<div class="dgc-blog-content">') + '<div class="dgc-blog-content">'.length;
    const poczatekStron = lista.indexOf('<div class="pagination-wrapper');
    if (poczatekKart > 0 && poczatekStron > poczatekKart) {
        const kartyHtml = lista.slice(poczatekKart, poczatekStron);

        // Pojedyncza karta = pierwsza z nich.
        const drugaKarta = kartyHtml.indexOf('<div class="post ', 10);
        let karta = drugaKarta > 0 ? kartyHtml.slice(0, drugaKarta) : kartyHtml;

        const w = wpisy[0];
        const zamien = (co, na) => {
            if (!co) return;
            karta = karta.split(co).join(na);
        };
        zamien(w.obrazek, '@@OBRAZEK@@');
        zamien(`/porady/${w.slug}/`, '@@ADRES@@');
        zamien(w.title, '@@TYTUL@@');
        zamien(w.description, '@@OPIS@@');
        zamien(w.create_at, '@@DATA@@');
        zamien(w.tag, '@@TAG@@');
        zamien(w.author, '@@AUTOR@@');

        for (const z of ['@@OBRAZEK@@', '@@ADRES@@', '@@TYTUL@@', '@@OPIS@@', '@@DATA@@', '@@TAG@@']) {
            if (!karta.includes(z)) bledyListy.push(`karta bez znacznika ${z}`);
        }

        lista = lista.slice(0, poczatekKart) + '@@KARTY@@' + lista.slice(poczatekStron);
        podmienWLiscie(
            'stronicowanie',
            /<div class="pagination-wrapper[\s\S]*?<\/nav><\/div>/,
            '@@STRONICOWANIE@@'
        );

        if (bledyListy.length) {
            console.error('[szablon] lista porad: budowa strony sie zmienila:');
            for (const b of bledyListy) console.error(`  - ${b}`);
            process.exit(1);
        }

        fs.writeFileSync(path.join(DIST, 'dane', 'szablon', 'lista.html'), lista);
        fs.writeFileSync(path.join(DIST, 'dane', 'szablon', 'karta.html'), karta);
        console.log(`Szablon listy: dane/szablon/lista.html (${Math.round(lista.length / 1024)} kB) i karta.html (${karta.length} B)`);
    } else {
        console.error('[szablon] nie znalazlem obszaru kart na liscie porad');
        process.exit(1);
    }
}

// --- czy panel zna wszystkie pola szablonu -----------------------------
//
// Szablony sa wyciagane tutaj, a wypelnia je PHP w panelu. Dolozenie pola
// po tej stronie i zapomnienie o drugiej dawaloby na zywej stronie goly
// napis @@PODOBNE@@. Panel ma na to wlasnego straznika (zostalZnacznik),
// ale on tylko odmawia zapisu — a to widac dopiero, gdy biuro probuje
// dodac artykul. Tutaj to samo widac od razu, przy budowaniu.

const GENERATOR = path.join(KORZEN, 'public', 'panel-dgc', 'generator.php');
if (fs.existsSync(GENERATOR)) {
    const php = fs.readFileSync(GENERATOR, 'utf8');
    const nieznane = [];

    for (const plik of ['artykul.html', 'lista.html', 'karta.html']) {
        const tresc = fs.readFileSync(path.join(DIST, 'dane', 'szablon', plik), 'utf8');
        for (const znacznik of new Set(tresc.match(/@@[A-Z_]+@@/g) ?? [])) {
            const nazwa = znacznik.slice(2, -2);
            if (!new RegExp(`'${nazwa}'\\s*=>`).test(php)) nieznane.push(`${plik}: ${znacznik}`);
        }
    }

    if (nieznane.length) {
        console.error('[szablon] panel nie umie wypelnic tych pol:');
        for (const n of nieznane) console.error(`  - ${n}`);
        console.error('  Dopisz je w public/panel-dgc/generator.php (tablica w podstaw()).');
        process.exit(1);
    }
    console.log('Panel zna wszystkie pola szablonow.');
}
