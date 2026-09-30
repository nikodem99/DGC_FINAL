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

// --- naglowek podstrony ------------------------------------------------

podmien('tytul w okruszkach', /<h1>[\s\S]*?<\/h1>/, '<h1>@@TYTUL@@</h1>');

// --- artykul -----------------------------------------------------------

podmien(
    'obrazek',
    /<div class="entry-media"><img src="[^"]*" alt="[^"]*"><\/div>/,
    '<div class="entry-media"><img src="@@OBRAZEK@@" alt=""></div>'
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

// Sasiedzi. Panel zna kolejnosc wpisow, wiec zbuduje ten blok sam.
podmien('sasiedzi', /<div class="more-posts">[\s\S]*?<\/div><\/div><\/div>/, '@@SASIEDZI@@');

// --- kontrola koncowa --------------------------------------------------

const ZNACZNIKI = [
    '@@TYTUL_STRONY@@', '@@OPIS@@', '@@KANONICZNY@@', '@@SLUG@@', '@@ZIARNO@@',
    '@@TYTUL@@', '@@OBRAZEK@@', '@@AUTOR@@', '@@DATA@@', '@@TAG@@', '@@TRESC@@', '@@SASIEDZI@@',
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
        const o = t.match(/<div class="entry-media"><img src="([^"]*)"/);
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
