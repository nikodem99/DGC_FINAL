import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { metaDla, DOMENA, MARKA } from '../../seo/meta';

// Aktualizuje tytul i metatagi przy nawigacji WEWNATRZ aplikacji.
//
// Podzial obowiazkow z prerenderem (src/main.jsx):
//   - prerender wpisuje komplet meta do statycznego HTML przy budowaniu
//     i to widza roboty, ktore nie wykonuja JavaScriptu,
//   - ten komponent podmienia je, gdy uzytkownik klika po serwisie bez
//     przeladowania strony. Roboty tego nie potrzebuja, ale ludzie tak:
//     inaczej po kliknieciu w menu w karcie przegladarki zostawalby tytul
//     poprzedniej podstrony, a udostepnienie z poziomu przegladarki
//     bralo by zly opis.
//
// Zrodlo jest jedno: src/seo/meta.js. Tutaj nie ma zadnych tekstow.
const ustawMeta = (selektor, atrybut, wartosc) => {
    let el = document.head.querySelector(selektor);
    if (!el) {
        el = document.createElement(selektor.startsWith('link') ? 'link' : 'meta');
        const [, nazwa, klucz] = selektor.match(/\[(.+?)="(.+?)"\]/) || [];
        if (nazwa) el.setAttribute(nazwa, klucz);
        document.head.appendChild(el);
    }
    el.setAttribute(atrybut, wartosc);
};

const DocumentTitle = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const m = metaDla(pathname);

        document.title = m.tytul;
        ustawMeta('meta[name="description"]', 'content', m.opis);
        ustawMeta('link[rel="canonical"]', 'href', m.kanoniczny);

        ustawMeta('meta[property="og:title"]', 'content', m.tytul);
        ustawMeta('meta[property="og:description"]', 'content', m.opis);
        ustawMeta('meta[property="og:url"]', 'content', m.kanoniczny);
        ustawMeta('meta[property="og:type"]', 'content', m.typ);
        ustawMeta('meta[property="og:site_name"]', 'content', MARKA);
        ustawMeta('meta[property="og:image"]', 'content', `${DOMENA}/og-dgc.jpg`);

        ustawMeta('meta[name="twitter:title"]', 'content', m.tytul);
        ustawMeta('meta[name="twitter:description"]', 'content', m.opis);
    }, [pathname]);

    return null;
};

export default DocumentTitle;
