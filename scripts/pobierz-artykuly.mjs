// Pobiera archiwalne wersje artykulow ze starej strony i zapisuje surowy HTML.
// Pobieramy RAZ, do pamieci podrecznej. Konwersja czyta juz z dysku, zeby
// mozna ja bylo poprawiac bez ponownego meczenia archiwum.
import fs from 'node:fs';
import path from 'node:path';

const KAT = path.dirname(new URL(import.meta.url).pathname);
const CACHE = path.join(KAT, 'archiwum');
const lista = JSON.parse(fs.readFileSync(path.join(KAT, 'lista.json'), 'utf8'));

const spij = (ms) => new Promise((r) => setTimeout(r, ms));

let pobrane = 0, zCache = 0, bledy = [];

for (let i = 0; i < lista.length; i++) {
    const { slug, ts } = lista[i];
    const plik = path.join(CACHE, `${slug}.html`);
    if (fs.existsSync(plik) && fs.statSync(plik).size > 2000) { zCache++; continue; }

    const url = `https://web.archive.org/web/${ts}id_/https://biurodgc.pl/${slug}/`;
    let udalo = false;
    for (let proba = 1; proba <= 3 && !udalo; proba++) {
        try {
            const odp = await fetch(url, { headers: { 'User-Agent': 'DGC-migracja/1.0' }, signal: AbortSignal.timeout(45000) });
            if (odp.status === 429 || odp.status >= 500) { await spij(4000 * proba); continue; }
            if (!odp.ok) { bledy.push(`${slug} HTTP ${odp.status}`); break; }
            const html = await odp.text();
            if (html.length < 2000) { bledy.push(`${slug} za krotki (${html.length})`); break; }
            fs.writeFileSync(plik, html);
            pobrane++; udalo = true;
        } catch (e) {
            if (proba === 3) bledy.push(`${slug} ${e.message}`);
            else await spij(3000 * proba);
        }
    }
    if ((i + 1) % 25 === 0) console.log(`${i + 1}/${lista.length} | pobrane ${pobrane} | z cache ${zCache} | bledy ${bledy.length}`);
    await spij(700);
}

console.log(`KONIEC: pobrane ${pobrane}, z cache ${zCache}, bledy ${bledy.length}`);
if (bledy.length) fs.writeFileSync(path.join(KAT, 'bledy-pobierania.txt'), bledy.join('\n'));
