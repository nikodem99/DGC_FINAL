// Sciaga do repozytorium artykuly dodane przez panel redakcyjny.
//
// PO CO TO ISTNIEJE — przeczytaj, zanim zbudujesz strone
// ------------------------------------------------------
// Od momentu uruchomienia panelu zrodlem prawdy o artykulach przestaje byc
// samo repozytorium. Biuro dodaje wpisy przez panel, ktory zapisuje je na
// serwerze: dane/wpisy.json, dane/tresci/<slug>.json i gotowa strone
// porady/<slug>/index.html.
//
// Gdyby ktos zbudowal strone z samego repozytorium i wgral paczke, te
// artykuly zniknelyby bez sladu — paczka nadpisalaby dane/ i porady/
// wersjami sprzed ich dodania.
//
// Dlatego kolejnosc jest zawsze taka:
//
//     node scripts/pobierz-z-serwera.mjs     <- najpierw to
//     npm run build                          <- potem dopiero budowanie
//
// Skrypt pobiera dane zwyklym zapytaniem HTTP, bo to pliki publiczne.
// Nie potrzebuje ani FTP, ani hasla, ani dostepu do panelu.

import fs from 'node:fs';
import path from 'node:path';

const KORZEN = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOMENA = process.env.DGC_DOMENA || 'https://biurodgc.pl';

const pobierz = async (sciezka) => {
    const odp = await fetch(`${DOMENA}${sciezka}`, { signal: AbortSignal.timeout(30000) });
    if (!odp.ok) throw new Error(`HTTP ${odp.status} przy ${sciezka}`);
    return odp;
};

let zdalne;
try {
    zdalne = await (await pobierz('/dane/wpisy.json')).json();
} catch (e) {
    console.error(`[pobierz] nie udalo sie wczytac listy z serwera: ${e.message}`);
    console.error('[pobierz] jesli panel jeszcze nie stoi na serwerze, to normalne — buduj dalej.');
    process.exit(0);
}

const zdalneWpisy = Array.isArray(zdalne?.wpisy) ? zdalne.wpisy : [];
if (!zdalneWpisy.length) {
    console.error('[pobierz] serwer zwrocil pusta liste wpisow — przerywam, zeby niczego nie skasowac');
    process.exit(1);
}

// --- tresc stron stalych (cennik, pytania) ----------------------------
//
// Od 22.10.2026 biuro edytuje te dwa zestawy w panelu. Zapisuja sie na
// serwerze w dane/tresc/*.json, a w repozytorium zrodlem sa src/api/
// pricing.js i faq.js. Gdyby ktos zbudowal paczke z samego repozytorium,
// nadpisalby klientce jej zmiany — dlatego sciagamy je tutaj i wpisujemy
// z powrotem do zrodel.

const naLiterale = (w) => JSON.stringify(w, null, 4).replace(/"([a-zA-Z]\w*)":/g, '$1:');

const zestawy = [
    {
        co: 'cennik',
        plik: 'src/api/pricing.js',
        wzor: /const pakiety = \[[\s\S]*?\n\];/,
        zloz: (d) => `const pakiety = ${naLiterale(d)};`,
    },
    {
        co: 'faq',
        plik: 'src/api/faq.js',
        wzor: /export const FAQ_OGOLNE = \[[\s\S]*?\n\];/,
        zloz: (d) => `export const FAQ_OGOLNE = ${naLiterale(d)};`,
    },
];

for (const z of zestawy) {
    let zdalny;
    try {
        zdalny = await (await pobierz(`/dane/tresc/${z.co}.json`)).json();
    } catch {
        console.log(`[pobierz] ${z.co}: brak na serwerze, zostaje wersja z repozytorium`);
        continue;
    }
    if (!Array.isArray(zdalny) || !zdalny.length) {
        console.error(`[pobierz] ${z.co}: serwer zwrocil pusty zestaw — pomijam, zeby niczego nie skasowac`);
        continue;
    }

    const sciezka = path.join(KORZEN, z.plik);
    const zrodlo = fs.readFileSync(sciezka, 'utf8');
    if (!z.wzor.test(zrodlo)) {
        console.error(`[pobierz] ${z.co}: nie rozpoznaje struktury ${z.plik} — popraw wzorzec w tym skrypcie`);
        process.exit(1);
    }

    const nowy = zrodlo.replace(z.wzor, z.zloz(zdalny));
    if (nowy === zrodlo) {
        console.log(`[pobierz] ${z.co}: bez zmian (${zdalny.length} pozycji)`);
    } else {
        fs.writeFileSync(sciezka, nowy);
        console.log(`[pobierz] ${z.co}: pobrane z serwera, ${zdalny.length} pozycji -> ${z.plik}`);
    }
}

// Slugi, ktore juz sa w repozytorium.
const blogsJs = fs.readFileSync(path.join(KORZEN, 'src/api/blogs.js'), 'utf8');
const lokalne = new Set([...blogsJs.matchAll(/slug:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]));

const brakujace = zdalneWpisy.filter((w) => !lokalne.has(w.slug));

if (!brakujace.length) {
    console.log(`Repozytorium ma komplet: ${zdalneWpisy.length} wpisow, nic do pobrania.`);
    process.exit(0);
}

console.log(`Na serwerze jest ${brakujace.length} artykulow, ktorych nie ma w repozytorium:`);
for (const w of brakujace) console.log(`  - ${w.slug}`);

// Tresci brakujacych wpisow.
const katTresci = path.join(KORZEN, 'src', 'tresci');
fs.mkdirSync(katTresci, { recursive: true });

for (const w of brakujace) {
    const odp = await pobierz(`/dane/tresci/${encodeURIComponent(w.slug)}.json`);
    const bloki = await odp.json();
    if (!Array.isArray(bloki) || !bloki.length) {
        console.error(`[pobierz] ${w.slug}: pusta tresc, pomijam`);
        continue;
    }
    fs.writeFileSync(path.join(katTresci, `${w.slug}.json`), JSON.stringify(bloki));
}

// Wpisy do indeksu. Obrazek wstawiamy jako okladke firmowa, bo adresy
// z odciskiem zmieniaja sie przy kazdym budowaniu i nie da sie ich
// przepisac wprost.
const apostrof = (t) => String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const nowe = brakujace.map((w, i) => `    {
        id: '${2000 + i}',
        title: '${apostrof(w.title)}',
        tag: '${apostrof(w.tag)}',
        slug: '${apostrof(w.slug)}',
        screens: okladka,
        description: '${apostrof(w.description)}',
        author: 'DGC Biuro Rachunkowe',
        create_at: '${apostrof(w.create_at)}',
        archiveMonth: '${apostrof(w.archiveMonth)}',
        archiveLabel: '${apostrof(w.archiveLabel)}',
        blogSingleImg: okladka,
        blClass: 'format-standard-image',
        animation: '1200',
    },`).join('\n');

const kotwica = 'const blogs = [\n';
if (!blogsJs.includes(kotwica)) {
    console.error('[pobierz] nie znalazlem poczatku tablicy w blogs.js');
    process.exit(1);
}

fs.writeFileSync(
    path.join(KORZEN, 'src/api/blogs.js'),
    blogsJs.replace(kotwica, `${kotwica}\n    // --- Dodane przez panel redakcyjny, sciagniete z serwera ---------\n${nowe}\n`)
);

console.log(`\nDopisane do repozytorium: ${brakujace.length}. Teraz mozna budowac.`);
console.log('Uwaga: artykuly z panelu dostaly okladke firmowa. Jesli ktorys ma miec wlasne zdjecie, podmien je recznie.');
