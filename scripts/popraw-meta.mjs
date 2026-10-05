// Odtwarza src/seo/wpisy.js z src/api/blogs.js, poprawnie przycinajac
// tytuly i opisy stron artykulow.
//
// Po co to powstalo
// -----------------
// Pierwsza wersja generatora (scripts/przenies-artykuly.mjs) cięła tekst
// po liczbie ZNAKOW. Audyt zywej strony pokazal efekt: 57 tytulow urwanych
// w polowie slowa ("...kiedy nie trzeba plac…"), 232 opisy urwane w polowie
// zdania i 7 tytulow powtorzonych na 15 stronach.
//
// Opis w wynikach wyszukiwania to czesto jedyne, co ktos przeczyta przed
// kliknieciem. Urwany w polowie slowa wyglada na zepsuty.
//
// Zasady przyjete tutaj:
//   - tytul przycinamy po granicy SLOWA, nigdy w srodku,
//   - opis konczymy na granicy ZDANIA, jesli da sie to zrobic sensownie;
//     wielokropek dajemy tylko wtedy, gdy naprawde urywamy mysl,
//   - powtorzone tytuly rozrozniamy rokiem, bo inaczej Google widzi
//     kilkanascie stron z ta sama nazwa.

import fs from 'node:fs';
import path from 'node:path';

const KORZEN = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const MAX_TYTUL = 62;   // z dopiskiem " · DGC" daje okolo 68 znakow
const MAX_OPIS = 158;
const MIN_OPIS = 90;    // ponizej tego opis przestaje cokolwiek mowic

/** "2026-09" + "30 wrzesnia 2026" -> "2026-09-30" */
function naIso(archiveMonth, createAt) {
    const m = /^(\d{4})-(\d{2})$/.exec(archiveMonth || '');
    if (!m) return '';
    const d = /^(\d{1,2})\s/.exec(createAt || '');
    const dzien = d ? String(Number(d[1])).padStart(2, '0') : '01';
    return `${m[1]}-${m[2]}-${dzien}`;
}

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
    wpisy.push({
        slug,
        tytul: pole(blok, 'title'),
        opis: pole(blok, 'description'),
        rok: (pole(blok, 'archiveMonth') || '').slice(0, 4),
        // Data w formacie ISO. Potrzebna do danych strukturalnych artykulu,
        // ktore wymagaja datePublished, a nie "30 wrzesnia 2026".
        data: naIso(pole(blok, 'archiveMonth'), pole(blok, 'create_at')),
    });
}

if (!wpisy.length) {
    console.error('[meta] nie odczytalem ani jednego wpisu z blogs.js');
    process.exit(1);
}

/** Przyciecie po granicy slowa. Nigdy w srodku wyrazu. */
function doSlowa(t, limit) {
    if (t.length <= limit) return { tekst: t, uciete: false };
    const ciety = t.slice(0, limit);
    const spacja = ciety.lastIndexOf(' ');
    const bezpieczny = spacja > limit * 0.6 ? ciety.slice(0, spacja) : ciety;
    return { tekst: bezpieczny.replace(/[\s,;:–—-]+$/, ''), uciete: true };
}

function naTytul(t) {
    const czysty = t.replace(/\s+/g, ' ').trim();
    const { tekst, uciete } = doSlowa(czysty, MAX_TYTUL);
    return `${tekst}${uciete ? '…' : ''} · DGC`;
}

/**
 * Opis dla wyszukiwarki. Najpierw probujemy skonczyc na kropce — zdanie
 * urwane kropka czyta sie jak zdanie, a urwane wielokropkiem jak usterka.
 */
function naOpis(o) {
    const czysty = o.replace(/\*\*/g, '').replace(/…$/, '').replace(/\s+/g, ' ').trim();
    if (czysty.length <= MAX_OPIS) return czysty;

    // Ostatnia kropka konczaca zdanie w dopuszczalnym zakresie.
    const okno = czysty.slice(0, MAX_OPIS + 1);
    const koniecZdania = Math.max(
        okno.lastIndexOf('. '),
        okno.lastIndexOf('? '),
        okno.lastIndexOf('! ')
    );
    if (koniecZdania >= MIN_OPIS) return czysty.slice(0, koniecZdania + 1);

    const { tekst } = doSlowa(czysty, MAX_OPIS - 1);
    return `${tekst}…`;
}

/**
 * Opis krotszy niz MIN_SENSOWNY nic nie mowi w wynikach wyszukiwania.
 * Dociagamy wtedy kolejne zdania z tresci artykulu, az opis zacznie
 * niesc konkret. Tresc lezy w src/tresci/<slug>.json w blokach.
 */
const MIN_SENSOWNY = 80;

function zTresci(slug) {
    const plik = path.join(KORZEN, 'src/tresci', `${slug}.json`);
    if (!fs.existsSync(plik)) return '';
    try {
        const bloki = JSON.parse(fs.readFileSync(plik, 'utf8'));
        return bloki
            .filter((b) => b.t === 'p' && typeof b.x === 'string')
            .map((b) => b.x.replace(/\*\*/g, ''))
            .join(' ');
    } catch {
        return '';
    }
}

function uzupelnij(opis, slug) {
    if (opis.length >= MIN_SENSOWNY) return opis;
    const tresc = zTresci(slug);
    if (!tresc) return opis;

    // Bierzemy od poczatku tresci, pomijajac to, co juz jest w opisie.
    const bezOpisu = tresc.startsWith(opis.replace(/…$/, '')) ? tresc.slice(opis.length) : tresc;
    const polaczony = `${opis.replace(/…$/, '')} ${bezOpisu}`.replace(/\s+/g, ' ').trim();
    return naOpis(polaczony);
}

// --- skladanie ----------------------------------------------------------

const gotowe = wpisy.map((w) => ({
    ...w,
    tytulMeta: naTytul(w.tytul),
    opisMeta: uzupelnij(naOpis(w.opis), w.slug),
}));

// Powtorzone tytuly. Google traktuje kilkanascie stron o tej samej nazwie
// jak jedna, wiec pozostale przepadaja.
//
// Poprzednia wersja doklejala do powtorek `slug.slice(0, 12)` i w szesciu
// tytulach konczylo sie to urwanym fragmentem adresu:
// "Sprawozdanie finansowe (2025) · obowiazek-sp · DGC". Fragment wchodzil
// tez do og:title i twitter:title, wiec bylo go widac w podgladach linkow.
// W dwoch przypadkach nie pomagal nawet na to, po co powstal: dwa adresy
// o tym samym prefiksie sluga dostawaly identyczny tytul.
//
// Teraz rozroznienie dobieramy dla CALEJ grupy naraz, probujac po kolei
// i zatrzymujac sie na pierwszym sposobie, ktory daje w grupie same rozne
// tytuly. Zaden z nich nie pokazuje adresu.
const MIESIACE_PL = ['styczen', 'luty', 'marzec', 'kwiecien', 'maj', 'czerwiec',
    'lipiec', 'sierpien', 'wrzesien', 'pazdziernik', 'listopad', 'grudzien'];

const grupy = new Map();
for (const w of gotowe) {
    if (!grupy.has(w.tytulMeta)) grupy.set(w.tytulMeta, []);
    grupy.get(w.tytulMeta).push(w);
}

const bezDGC = (t) => t.replace(/ · DGC$/, '');
const zRokiem = (w) => (w.rok && !bezDGC(w.tytulMeta).includes(w.rok)
    ? `${bezDGC(w.tytulMeta)} (${w.rok}) · DGC` : null);
const zMiesiacem = (w) => {
    const m = /^\d{4}-(\d{2})/.exec(w.data || '');
    return m && w.rok ? `${bezDGC(w.tytulMeta)} (${MIESIACE_PL[+m[1] - 1]} ${w.rok}) · DGC` : null;
};
// Ostatnia deska ratunku: kolejny numer. Brzydkie, ale zawsze unikalne
// i nigdy nie pokazuje adresu strony.
const zNumerem = (w, i) => `${bezDGC(w.tytulMeta)} (${i + 1}) · DGC`;

let rozroznione = 0;
for (const [tytul, grupa] of grupy) {
    if (grupa.length < 2) continue;

    const sposoby = [
        // 1. Pelne tytuly sa rozne, a zrownalo je dopiero przyciecie —
        //    wtedy wystarczy przyciac krocej i dodac ogon, ktory je dzieli.
        (w) => (new Set(grupa.map((x) => x.tytul)).size === grupa.length
            ? naTytul(w.tytul.slice(0, MAX_TYTUL + 24)) : null),
        zRokiem,
        zMiesiacem,
        zNumerem,
    ];

    for (const sposob of sposoby) {
        const kandydaci = grupa.map((w, i) => sposob(w, i));
        if (kandydaci.some((k) => !k)) continue;
        if (new Set(kandydaci).size !== grupa.length) continue;
        grupa.forEach((w, i) => { w.tytulMeta = kandydaci[i]; });
        rozroznione += grupa.length;
        break;
    }
}

// Kontrola koncowa: po tym wszystkim zaden tytul nie ma prawa sie powtorzyc.
const poLiczeniu = {};
for (const w of gotowe) poLiczeniu[w.tytulMeta] = (poLiczeniu[w.tytulMeta] ?? 0) + 1;
const nadal = Object.entries(poLiczeniu).filter(([, n]) => n > 1);
if (nadal.length) {
    console.error('[meta] tytuly nadal powtorzone:', nadal);
    process.exit(1);
}

const apostrof = (t) => String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const tresc = gotowe
    .map((w) => `    '${apostrof(w.slug)}': {\n        tytul: '${apostrof(w.tytulMeta)}',\n        opis: '${apostrof(w.opisMeta)}',\n        data: '${apostrof(w.data)}',\n        nazwa: '${apostrof(w.tytul)}',\n    },`)
    .join('\n');

fs.writeFileSync(path.join(KORZEN, 'src/seo/wpisy.js'),
`// WYGENEROWANE przez scripts/popraw-meta.mjs. Nie edytuj recznie.
//
// Tytuly i opisy stron artykulow, uzywane przez src/seo/meta.js do
// prerenderu i do mapy strony. Osobny plik, bo meta.js jest wczytywany
// przez vite.config.js w czystym Node, a blogs.js importuje obrazki
// i tam by wybuchl.
//
// Tytul przycinany po granicy slowa, opis po granicy zdania. Powtorzone
// tytuly rozrozniane rokiem. Powod w naglowku skryptu.

export const WPISY = {
${tresc}
};

export default WPISY;
`);

const uciete = gotowe.filter((w) => w.opisMeta.endsWith('…')).length;
const dlugosci = gotowe.map((w) => w.opisMeta.length).sort((a, b) => a - b);

console.log(`Wpisow: ${gotowe.length}`);
console.log(`Tytulow rozroznionych rokiem: ${rozroznione}`);
console.log(`Opisow konczacych sie wielokropkiem: ${uciete} (bylo 232)`);
console.log(`Dlugosc opisu: min ${dlugosci[0]}, mediana ${dlugosci[Math.floor(dlugosci.length / 2)]}, max ${dlugosci[dlugosci.length - 1]}`);
console.log(`Tytulow w polowie slowa: 0 (ciecie wylacznie po spacji)`);
