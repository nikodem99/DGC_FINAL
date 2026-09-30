// Przenosi artykuly ze starego WordPressa (odzyskane z archiwum internetu)
// do formatu nowej strony.
//
// Wejscie:  artykuly.json — wynik scripts/konwertuj.py, czyli tytul, data
//           i tresc w blokach dla kazdego sluga.
// Wyjscie:  public/tresci/<slug>.json  — tresc kazdego artykulu osobno,
//           src/api/blogs.js            — indeks wpisow.
//
// Tresci NIE trafiaja do paczki JavaScriptu. Powod policzony w api/tresci.js:
// 373 artykuly to okolo 530 kB po kompresji przy glownym pliku wazacym 263 kB.
//
// Skrypt jest idempotentny: istniejace wpisy w blogs.js zostaja przepisane
// bez zmian, dochodza tylko te, ktorych jeszcze nie ma.

import fs from 'node:fs';
import path from 'node:path';

const KORZEN = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WEJSCIE = process.argv[2];
if (!WEJSCIE) { console.error('Podaj sciezke do artykuly.json'); process.exit(1); }

const MIESIACE = ['', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const MIESIAC_ETYKIETA = ['', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

// Kategorie z listy starego bloga. Kolejnosc ma znaczenie: sprawdzamy od
// najwezszej do najszerszej, bo artykul o stawce VAT jest tez "o podatkach".
const KATEGORIE = [
    ['VAT', /\bvat\b|jpk|ksef|faktur|stawk[ai] (23|8|5|0)|odwrotne obcia/i],
    ['CIT', /\bcit\b|estońsk|osób prawnych|spółk[ai] (z o|akcyj|komandyt)/i],
    ['Płace', /wynagrodz|płac[aeoy]|zasiłek|zasiłk|składk|\bzus\b|emerytur|chorobow|minimalna krajowa/i],
    ['Kadry', /pracownik|pracodawc|umow[aęy] o pracę|urlop|zatrudni|\bbhp\b|badania wstępne|zwolnieni[ae] lekarsk|niani|delegacj/i],
    ['Rachunkowość', /bilans|sprawozdani|inwentaryzacj|amortyzacj|środk(i|ów) trwał|\bmsr\b|rezerw|ewidencj|aktyw|pasyw/i],
    ['Księgowość', /księg|\bkpir\b|dokument|archiwiz|biuro rachunkowe|outsourcing/i],
    ['PIT', /\bpit\b|ulg[aęi]|ryczałt|skala podatkowa|podatek dochodowy|rozliczeni[ae] roczn|darowizn/i],
    ['Podatki', /.*/],
];

const kategoria = (tytul, tekst) => {
    const proba = `${tytul} ${tekst.slice(0, 1200)}`;
    for (const [nazwa, wzor] of KATEGORIE) if (wzor.test(proba)) return nazwa;
    return 'Podatki';
};

const bezPogrubien = (t) => t.replace(/\*\*/g, '');

const zajawka = (bloki) => {
    const p = bloki.find((b) => b.t === 'p' && typeof b.x === 'string' && b.x.length > 60)
        ?? bloki.find((b) => b.t === 'p' && typeof b.x === 'string');
    if (!p) {
        const ul = bloki.find((b) => b.t === 'ul');
        if (ul) return bezPogrubien(ul.x[0]).slice(0, 230);
        return '';
    }
    const t = bezPogrubien(p.x);
    if (t.length <= 255) return t;
    const ciety = t.slice(0, 255);
    const sp = ciety.lastIndexOf(' ');
    return `${ciety.slice(0, sp > 180 ? sp : 255).replace(/[,;:]$/, '')}…`;
};

const apostrof = (t) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

// --- wejscie -----------------------------------------------------------

const surowe = JSON.parse(fs.readFileSync(WEJSCIE, 'utf8'));
const zrodlo = fs.readFileSync(path.join(KORZEN, 'src/api/blogs.js'), 'utf8');

const istniejace = new Set([...zrodlo.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]));

// --- tresci dotychczasowych wpisow do osobnych plikow -------------------

const katTresci = path.join(KORZEN, 'src/tresci');
fs.mkdirSync(katTresci, { recursive: true });

const stareTresci = path.join(KORZEN, 'src/api/blogContent.js');
let przeniesioneStare = 0;
if (fs.existsSync(stareTresci)) {
    const mod = await import(`file://${stareTresci}`);
    for (const [slug, bloki] of Object.entries(mod.default ?? {})) {
        fs.writeFileSync(path.join(katTresci, `${slug}.json`), JSON.stringify(bloki));
        przeniesioneStare++;
    }
}

// --- nowe wpisy --------------------------------------------------------

const nowe = [];
let pominiete = 0;

for (const a of surowe) {
    if (istniejace.has(a.slug)) { pominiete++; continue; }
    if (!a.tytul || !a.data || !a.bloki.length) { pominiete++; continue; }

    fs.writeFileSync(path.join(katTresci, `${a.slug}.json`), JSON.stringify(a.bloki));

    const [rok, mies, dzien] = a.data.split('-').map(Number);
    const plaski = a.bloki
        .map((b) => (typeof b.x === 'string' ? b.x : Array.isArray(b.x) ? b.x.flat().join(' ') : ''))
        .join(' ');

    nowe.push({
        slug: a.slug,
        tytul: a.tytul,
        tag: kategoria(a.tytul, plaski),
        opis: zajawka(a.bloki),
        data: a.data,
        createAt: `${dzien} ${MIESIACE[mies]} ${rok}`,
        archiveMonth: `${rok}-${String(mies).padStart(2, '0')}`,
        archiveLabel: `${MIESIAC_ETYKIETA[mies]} ${rok}`,
    });
}

// --- dopisanie do blogs.js ---------------------------------------------

// Nowe wpisy ida na koniec tablicy, czyli za dotychczasowe. Kolejnosc
// w tablicy steruje lista porad oraz nawigacja "poprzedni / nastepny",
// a dotychczasowe pietnascie ma stac na gorze jako najnowsze.
nowe.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));

// Jedna okladka dla wszystkich przeniesionych artykulow. Rotacja po
// szesciu plikach szablonu nie mialaby sensu, bo to byly zaslepki
// z wypisanym rozmiarem, a nie rozne zdjecia.
const OBRAZKI = ['okladka'];

const wpisy = nowe.map((w, i) => {
    const obr = OBRAZKI[i % OBRAZKI.length];
    return `    {
        id: '${1000 + i}',
        title: '${apostrof(w.tytul)}',
        tag: '${w.tag}',
        slug: '${apostrof(w.slug)}',
        screens: ${obr},
        description: '${apostrof(w.opis)}',
        author: 'DGC Biuro Rachunkowe',
        create_at: '${w.createAt}',
        archiveMonth: '${w.archiveMonth}',
        archiveLabel: '${w.archiveLabel}',
        blogSingleImg: ${obr},
        blClass: 'format-standard-image',
        animation: '1200',
    },`;
}).join('\n');

let wynik = zrodlo;

// brakujace importy obrazkow
if (!wynik.includes('blogImg4')) {
    wynik = wynik.replace(
        'import blogImg3 from "../images/blog/img-3.jpg";',
        'import blogImg3 from "../images/blog/img-3.jpg";\n'
        + 'import blogImg4 from "../images/blog/img-4.jpg";\n'
        + 'import blogImg5 from "../images/blog/img-5.jpg";\n'
        + 'import blogImg6 from "../images/blog/img-6.jpg";'
    );
}

const znacznik = '\n];';
const i = wynik.lastIndexOf(znacznik);
if (i < 0) { console.error('Nie znalazlem konca tablicy w blogs.js'); process.exit(1); }

wynik = `${wynik.slice(0, i)}\n\n    // --- Artykuly przeniesione ze starej strony ---------------------------\n`
    + `    // Odzyskane z archiwum internetu, bo stary WordPress zostal zastapiony\n`
    + `    // razem z baza. Tytuly, daty i tresc pochodza z opublikowanych wersji,\n`
    + `    // nic tu nie jest dopisane. Zdjecia szablonowe, tak jak przy wpisach\n`
    + `    // powyzej. Kategorie przypisane po slowach kluczowych w tresci.\n`
    + `${wpisy}${wynik.slice(i)}`;

fs.writeFileSync(path.join(KORZEN, 'src/api/blogs.js'), wynik);

// --- meta dla prerenderu i mapy strony ---------------------------------
// meta.js NIE moze importowac blogs.js, bo blogs.js importuje pliki .jpg,
// a meta.js jest wczytywany przez vite.config.js w czystym Node, gdzie
// import obrazka wybucha. Dlatego generujemy osobny plik z samymi danymi.

const wszystkieWpisy = [];
for (const m of zrodlo.matchAll(/\{\s*id:[\s\S]*?\n    \},/g)) {
    const blok = m[0];
    const we = (pole) => (blok.match(new RegExp(`${pole}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)) ?? [])[1];
    const slug = we('slug');
    if (slug) wszystkieWpisy.push({ slug, tytul: we('title'), opis: we('description') });
}
for (const w of nowe) {
    if (!wszystkieWpisy.some((x) => x.slug === w.slug)) {
        wszystkieWpisy.push({ slug: w.slug, tytul: w.tytul, opis: w.opis });
    }
}

const naTytul = (t) => {
    const pelny = `${t} · DGC`;
    if (pelny.length <= 65) return pelny;
    return `${t.slice(0, 58).replace(/[\s,;:–-]+$/, '')}… · DGC`;
};
const naOpis = (o) => {
    const czysty = String(o ?? '').replace(/\*\*/g, '').replace(/…$/, '');
    if (czysty.length <= 158) return czysty;
    const ciety = czysty.slice(0, 158);
    const sp = ciety.lastIndexOf(' ');
    return `${ciety.slice(0, sp > 110 ? sp : 158).replace(/[,;:]$/, '')}…`;
};

const wpisyMeta = wszystkieWpisy
    .map((w) => `    '${apostrof(w.slug)}': {\n        tytul: '${apostrof(naTytul(w.tytul))}',\n        opis: '${apostrof(naOpis(w.opis))}',\n    },`)
    .join('\n');

fs.writeFileSync(path.join(KORZEN, 'src/seo/wpisy.js'),
`// WYGENEROWANE przez scripts/przenies-artykuly.mjs. Nie edytuj recznie.
//
// Tytuly i opisy stron artykulow, uzywane przez src/seo/meta.js do
// prerenderu i do mapy strony. Osobny plik, bo meta.js jest wczytywany
// przez vite.config.js w czystym Node, a blogs.js importuje obrazki
// i tam by wybuchl.

export const WPISY = {
${wpisyMeta}
};

export default WPISY;
`);

console.log(`wpisow w src/seo/wpisy.js:                  ${wszystkieWpisy.length}`);
console.log(`tresci dotychczasowych wpisow przeniesione: ${przeniesioneStare}`);
console.log(`nowych artykulow dopisanych:                ${nowe.length}`);
console.log(`pominietych (juz sa albo bez tresci):       ${pominiete}`);
const licznik = {};
for (const w of nowe) licznik[w.tag] = (licznik[w.tag] ?? 0) + 1;
console.log('kategorie:', licznik);
