// Poprawki wydajnosci nanoszone na GOTOWY katalog dist.
//
// Dlaczego po budowaniu, a nie w komponentach
// -------------------------------------------
// Dwie z trzech rzeczy ponizej dotycza tego, co wtyczka prerenderujaca
// wstawia do HTML-a sama, poza naszym kodem. Trzeciej (wymiary obrazkow)
// nie da sie sensownie wpisac w komponentach, bo rozmiary znaja dopiero
// pliki w dist, po przejsciu przez Vite.
//
// Co robimy i po co
// -----------------
// 1. ZDEJMUJEMY wczytywanie obrazkow z wyprzedzeniem (<link rel="preload">).
//    Pomiar na zywej stronie glownej: 14 takich wpisow, razem 1993 kB, na
//    NAJWYZSZYM priorytecie. Wsrod nich szesc zdjec zespolu, ktore leza
//    daleko ponizej pierwszego ekranu. Te obrazki i tak sie zaladuja, bo
//    sa w tresci — chodzi o to, zeby nie scigaly sie o pasmo ze stylami
//    i pierwszym ekranem.
//
// 2. DOKLADAMY leniwe ladowanie wszystkiemu poza pierwszymi obrazkami na
//    stronie. To jest jedyna z trzech zmian, ktora realnie oszczedza bajty:
//    kto nie przewinie do zespolu, ten go nie pobierze.
//
// 3. DOKLADAMY wymiary (width i height). Bez nich przegladarka nie wie, ile
//    miejsca zarezerwowac, i uklad przeskakuje w trakcie ladowania. Google
//    to mierzy. Rozmiary czytamy wprost z plikow.
//
// Zmiana 3 wymaga `height: auto` w stylach — bez tego obrazek ograniczony
// przez max-width zachowalby wysokosc z atrybutu i zostalby rozciagniety.
// Regula siedzi w src/sass/_dgc-theme.scss.

import fs from 'node:fs';
import path from 'node:path';

const KORZEN = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(KORZEN, 'dist');

/** Ile pierwszych obrazkow na stronie zostaje bez leniwego ladowania. */
const PILNYCH = 2;

// --- odczyt wymiarow ----------------------------------------------------

const wymiaryCache = new Map();

function wymiary(adres) {
    if (wymiaryCache.has(adres)) return wymiaryCache.get(adres);

    const plik = path.join(DIST, adres.replace(/^\//, '').split('?')[0]);
    let wynik = null;
    try {
        const b = fs.readFileSync(plik);
        if (adres.endsWith('.svg')) wynik = zSvg(b.toString('utf8'));
        else if (b[0] === 0x89 && b[1] === 0x50) wynik = zPng(b);
        else if (b[0] === 0xff && b[1] === 0xd8) wynik = zJpeg(b);
    } catch {
        wynik = null;
    }
    wymiaryCache.set(adres, wynik);
    return wynik;
}

function zPng(b) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function zJpeg(b) {
    let i = 2;
    while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const znacznik = b[i + 1];
        // SOF0..SOF15 poza znacznikami, ktore nie niosa rozmiaru
        if (znacznik >= 0xc0 && znacznik <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(znacznik)) {
            return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        }
        i += 2 + b.readUInt16BE(i + 2);
    }
    return null;
}

function zSvg(t) {
    const vb = t.match(/viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"/);
    if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]) };
    const w = t.match(/\swidth="(\d+)/);
    const h = t.match(/\sheight="(\d+)/);
    return w && h ? { w: +w[1], h: +h[1] } : null;
}

// --- przetwarzanie stron ------------------------------------------------

let strony = 0;
let zdjetychPreload = 0;
let leniwych = 0;
let zWymiarami = 0;

function przerobStrone(sciezka) {
    let html = fs.readFileSync(sciezka, 'utf8');

    const przed = html.length;
    html = html.replace(/<link rel="preload" as="image"[^>]*>/g, () => { zdjetychPreload++; return ''; });

    let nr = 0;
    html = html.replace(/<img\s[^>]*>/g, (tag) => {
        nr++;

        if (!/\sloading=/.test(tag) && nr > PILNYCH) {
            tag = tag.replace(/^<img\s/, '<img loading="lazy" decoding="async" ');
            leniwych++;
        }

        if (!/\swidth=/.test(tag) && !/\sheight=/.test(tag)) {
            const src = tag.match(/\ssrc="([^"]+)"/);
            if (src && !src[1].startsWith('data:')) {
                const w = wymiary(src[1]);
                if (w && w.w && w.h) {
                    tag = tag.replace(/^<img\s/, `<img width="${w.w}" height="${w.h}" `);
                    zWymiarami++;
                }
            }
        }
        return tag;
    });

    if (html.length !== przed || leniwych || zWymiarami) {
        fs.writeFileSync(sciezka, html);
    }
    strony++;
}

function obejdz(katalog) {
    for (const poz of fs.readdirSync(katalog, { withFileTypes: true })) {
        const p = path.join(katalog, poz.name);
        if (poz.isDirectory()) {
            if (poz.name === 'assets' || poz.name === 'dane') continue;
            obejdz(p);
        } else if (poz.name.endsWith('.html')) {
            przerobStrone(p);
        }
    }
}

obejdz(DIST);

console.log(
    `Wydajnosc: ${strony} stron | zdjete wczytania z wyprzedzeniem: ${zdjetychPreload} | `
    + `leniwych obrazkow: ${leniwych} | z wymiarami: ${zWymiarami}`
);
