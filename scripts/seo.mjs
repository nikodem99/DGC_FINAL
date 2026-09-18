// Generuje sitemap.xml, robots.txt i llms.txt do katalogu dist po zbudowaniu.
//
// Dlaczego generowane, a nie pisane recznie: lista adresow pochodzi z tego
// samego src/seo/meta.js, z ktorego biora sie tytuly i opisy. Dodanie
// podstrony aktualizuje wszystko naraz i nie da sie o niczym zapomniec.

import fs from 'node:fs';
import path from 'node:path';
import { WSZYSTKIE_TRASY, NOINDEX, DOMENA, MARKA, metaDla } from '../src/seo/meta.js';
import { ARTYKULY, PROSTE, GALEZIE, DO_KOSZA } from '../src/seo/przekierowania.js';

const DIST = 'dist';
const dzis = new Date().toISOString().slice(0, 10);

const doMapy = WSZYSTKIE_TRASY.filter((t) => !NOINDEX.includes(t));

// --- sitemap.xml -------------------------------------------------------
// Priorytety celowo skromne i zroznicowane tylko tam, gdzie to cos znaczy.
// Google traktuje priority jako podpowiedz, wiec rozdmuchiwanie jej nie ma
// sensu, ale plaska mapa bez hierarchii tez nic nie mowi.
const priorytet = (t) => {
    if (t === '/') return '1.0';
    if (t.startsWith('/oferta')) return '0.9';
    if (t === '/cennik' || t === '/kontakt') return '0.8';
    if (t.startsWith('/porady/')) return '0.6';
    return '0.7';
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${doMapy
    .map((t) => {
        const m = metaDla(t);
        return `  <url>\n    <loc>${m.kanoniczny}</loc>\n    <lastmod>${dzis}</lastmod>\n    <priority>${priorytet(t)}</priority>\n  </url>`;
    })
    .join('\n')}
</urlset>
`;

// --- robots.txt --------------------------------------------------------
// Roboty AI wpuszczamy swiadomie. Sa trzy rodzaje: trenujace (GPTBot,
// ClaudeBot, Google-Extended), odpowiadajace na pytania uzytkownikow
// (OAI-SearchBot, Claude-SearchBot, PerplexityBot) i wywolywane recznie,
// gdy ktos wklei link (ChatGPT-User, Claude-User, Perplexity-User).
// Decyzja klienta z 17.09.2026: wpuszczamy wszystkie, bo bycie cytowanym
// w odpowiedziach AI to dzis realny kanal dotarcia, a tresc serwisu
// i tak jest publiczna.
const robots = `# robots.txt dla ${DOMENA}

User-agent: *
Allow: /

# Pozostalosci po kupionym szablonie. Nie sa prerenderowane i zwracaja 404,
# ale wpisujemy je wprost, zeby zaden robot nie tracil na nie czasu.
Disallow: /shop
Disallow: /cart
Disallow: /checkout
Disallow: /order_received
Disallow: /project
Disallow: /team
Disallow: /home-2
Disallow: /home-3
Disallow: /blog-left-sidebar
Disallow: /blog-fullwidth
Disallow: /services
Disallow: /wp-admin

# --- Narzedzia AI: wpuszczone swiadomie -------------------------------
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${DOMENA}/sitemap.xml
`;

// --- llms.txt ----------------------------------------------------------
// Konwencja swieza i nie wszyscy ja czytaja, wiec traktujemy ja jako tani
// dodatek, a nie filar. Filarem jest prerender: bez niego zaden z tych
// robotow nie zobaczylby tresci, bo nie wykonuja JavaScriptu.
const grupa = (prefiks) =>
    doMapy
        .filter((t) => t.startsWith(prefiks) && t !== prefiks)
        .map((t) => {
            const m = metaDla(t);
            return `- [${m.tytul.split(' · ')[0]}](${m.kanoniczny}): ${m.opis}`;
        })
        .join('\n');

const llms = `# ${MARKA}

> Biuro rachunkowe z Łodzi, działające od 2011 roku. Prowadzi księgowość,
> rozliczenia podatkowe oraz sprawy kadrowo-płacowe firm z całej Polski,
> także w pełni zdalnie. Adres: ul. Brukowa 8, 91-341 Łódź.
> Telefon: 731 580 184. E-mail: kontakt@biurodgc.pl.

## Podstrony

${doMapy
    .filter((t) => !t.startsWith('/porady/') && !t.startsWith('/oferta/'))
    .map((t) => {
        const m = metaDla(t);
        return `- [${m.tytul.split(' · ')[0]}](${m.kanoniczny}): ${m.opis}`;
    })
    .join('\n')}

## Oferta

${grupa('/oferta')}

## Porady ksiegowe i podatkowe

${grupa('/porady')}
`;

// --- .htaccess dla LiteSpeed/Apache (cyber_Folks) ----------------------
// To jest plik, ktory REALNIE dziala na docelowym hostingu. Netlify go nie
// czyta, LiteSpeed nie czyta _redirects — dlatego generujemy oba.
const htaccess = `# Wygenerowane przez scripts/seo.mjs. Nie edytuj recznie —
# zrodlem jest src/seo/przekierowania.js. Reczna zmiana zniknie
# przy nastepnym budowaniu.
#
# Serwer docelowy: LiteSpeed (cyber_Folks), zgodny z Apache.

Options -MultiViews
RewriteEngine On

# --- HTTPS ------------------------------------------------------------
# Na obecnym hostingu juz dziala, ale trzymamy to tutaj, bo stary
# .htaccess WordPressa zostanie nadpisany razem z wgraniem nowej strony.
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# --- www na wersje bez www --------------------------------------------
# UWAGA: to tez dziala juz dzis i tez siedzi poza kodem. Jesli zniknie,
# www.biurodgc.pl przestanie dzialac z dnia na dzien. Adresy kanoniczne
# w serwisie wskazuja wersje BEZ www, wiec ta regula musi zostac.
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# --- Artykuly: z katalogu glownego starej strony do /porady/ -----------
${ARTYKULY.map((s) => `RewriteRule ^${s}/?$ /porady/${s}/ [R=301,L]`).join('\n')}

# --- Pojedyncze podstrony ---------------------------------------------
${PROSTE.map(([stary, nowy, opis]) => `# ${opis}\nRewriteRule ^${stary.slice(1)}/?$ ${nowy} [R=301,L]`).join('\n')}

# Artykul pod starym, szablonowym adresem — z zachowaniem nazwy.
RewriteRule ^blog-single/([^/]+)/?$ /porady/$1/ [R=301,L]

# --- Cale galezie starego WordPressa ----------------------------------
${GALEZIE.map(([stary, nowy, opis]) => `# ${opis}\nRewriteRule ^${stary.slice(1)}(/.*)?$ ${nowy} [R=301,L]`).join('\n')}

# --- Adresy, ktore maja zniknac ---------------------------------------
# Pozostalosci po kupionym szablonie i panel starego WordPressa.
# Swiadomie 404, a nie przekierowanie na strone glowna: przekierowanie
# nieistniejacej tresci na cokolwiek innego to miekki blad 404, ktory
# Google traktuje gorzej niz uczciwe 404.
${DO_KOSZA.map((s) => `RewriteRule ^${s.slice(1)}(/.*)?$ - [R=404,L]`).join('\n')}

# --- Pliki starego WordPressa -----------------------------------------
# /wp-content/* zostaje bez reguly i konczy na 404. To obrazki i PDF-y,
# ktorych po przelaczeniu po prostu nie ma. Jesli ktorys jest podlinkowany
# z zewnatrz i ma ruch, przenies go do public/ i dopisz regule punktowa.

# --- Strona bledu -----------------------------------------------------
ErrorDocument 404 /404/index.html

# --- Pamiec podreczna -------------------------------------------------
# Pliki z odciskiem w nazwie (assets) moga lezec w cache dlugo, HTML nie,
# bo inaczej po wgraniu poprawki uzytkownicy widza stara wersje.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/png "access plus 6 months"
  ExpiresByType image/svg+xml "access plus 6 months"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
`;

fs.writeFileSync(path.join(DIST, '.htaccess'), htaccess);

// --- _redirects dla Netlify -------------------------------------------
// Serwis idzie na cyber_Folks, wiec ten plik jest tam martwy. Generujemy
// go, bo na Netlify stoi podglad pokazywany klientowi — i zeby przy
// ewentualnej przeprowadzce nie trzeba bylo pisac listy po raz drugi.
const redirects = `# Wygenerowane przez scripts/seo.mjs ze src/seo/przekierowania.js.
# Format Netlify. Docelowy hosting to cyber_Folks (LiteSpeed), ktory czyta
# .htaccess, NIE ten plik. Tutaj sluzy podgladowi na Netlify.
# Kolejnosc ma znaczenie: pierwsze trafienie wygrywa.

${ARTYKULY.map((s) => `/${s}/*  /porady/${s}/  301!\n/${s}  /porady/${s}/  301!`).join('\n')}

${PROSTE.map(([stary, nowy, opis]) => `# ${opis}\n${stary}/*  ${nowy}  301!\n${stary}  ${nowy}  301!`).join('\n')}
/blog-single/:slug  /porady/:slug/  301!

${GALEZIE.map(([stary, nowy, opis]) => `# ${opis}\n${stary}/*  ${nowy}  301!\n${stary}  ${nowy}  301!`).join('\n')}

${DO_KOSZA.map((s) => `${s}/*  /404/index.html  404\n${s}  /404/index.html  404`).join('\n')}

# Regula awaryjna. MUSI byc ostatnia.
/*  /404/index.html  404
`;

fs.writeFileSync(path.join(DIST, '_redirects'), redirects);

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);

console.log(`SEO: sitemap.xml (${doMapy.length} adresow), robots.txt, llms.txt, .htaccess`);
