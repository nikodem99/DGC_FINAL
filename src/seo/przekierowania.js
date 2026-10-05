// Przekierowania ze starej strony na nowa, jako DANE.
//
// Z tej jednej listy generujemy dwa pliki (scripts/seo.mjs):
//   - .htaccess       — dla LiteSpeed/Apache, czyli dla cyber_Folks,
//                       gdzie serwis faktycznie stoi,
//   - _redirects      — format Netlify, uzywany na podgladzie.
//
// Powod: te dwa serwery nie czytaja swoich formatow. Plik _redirects na
// cyber_Folks jest martwy, a .htaccess na Netlify tak samo. Trzymanie
// dwoch recznie pisanych list konczy sie tym, ze jedna zostaje w tyle.
//
// Wszystkie adresy zrodlowe zweryfikowane zapytaniami HTTP do biurodgc.pl
// 18.09.2026 — kazdy zwracal wtedy 200 albo 301, czyli zyje.

// Artykulow NIE ma tutaj na liscie i to jest celowe.
//
// Wczesniej stalo tu recznie przepisane pietnascie slugow. Byly wiec dwa
// miejsca z ta sama wiedza: to i src/api/blogs.js. Dopisanie artykulu
// w jednym, a zapomnienie o drugim, konczy sie martwym przekierowaniem.
//
// Teraz generator (scripts/seo.mjs) czyta slugi prosto z src/api/blogs.js
// i zestawia je z src/seo/stare-artykuly.js, czyli z pelna lista 388
// adresow ze starego WordPressa. Dalej rozdziela je sam:
//   - artykul JEST na nowej stronie  -> 301 na /porady/<slug>/,
//   - artykulu NIE MA jeszcze        -> 301 na /porady/, czyli na liste.
// Dopisanie artykulu do blogs.js wystarczy, reszta dzieje sie sama.

// Pojedyncze adresy: [stary, nowy, opis do komentarza w pliku]
export const PROSTE = [
    ['/naszzespol', '/o-nas/', 'podstrona zespolu ze starej strony'],
    ['/prezes-zarzadu', '/o-nas/', 'podstrona prezes ze starej strony'],
    ['/about', '/o-nas/', 'angielska sciezka z okresu budowy, link poszedl do grafika'],
    ['/contact', '/kontakt/', 'angielska sciezka z okresu budowy'],
    ['/blog', '/porady/', 'angielska sciezka z okresu budowy'],
];

// Cale galezie starej strony na WordPressie. Sprawdzone: wszystkie zwracaja
// 200 albo 301, wiec sa realne i moga byc podlinkowane z zewnatrz.
export const GALEZIE = [
    ['/feed', '/porady/', 'kanal RSS, najblizszym odpowiednikiem jest lista porad'],
    ['/category', '/porady/', 'archiwa kategorii'],
    ['/tag', '/porady/', 'archiwa tagow'],
    ['/author', '/o-nas/', 'archiwum autora'],
];

// Adresy, ktore maja po prostu zniknac (404), a nie prowadzic donikad.
// Pozostalosci po kupionym szablonie oraz panel starego WordPressa.
export const DO_KOSZA = [
    '/shop', '/shop-single', '/cart', '/checkout', '/order_received',
    '/project', '/project-single', '/team', '/team-single',
    '/home-2', '/home-3', '/blog-left-sidebar', '/blog-fullwidth',
    '/blog-single-left-sidebar', '/blog-single-fullwidth',
    '/services', '/service-single',
    '/wp-admin', '/wp-login.php', '/wp-json',
];
