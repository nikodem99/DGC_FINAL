import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import blogs from '../../api/blogs';
import Services from '../../api/Services';

const BRAND = 'DGC Biuro Rachunkowe';
const HOME_TITLE = `${BRAND} · księgowość, kadry i płace dla firm`;

// Tytuly stalych sciezek. Klucz bez ukosnika koncowego.
const TITLES = {
    '': HOME_TITLE,
    '/home': HOME_TITLE,
    '/home-2': HOME_TITLE,
    '/home-3': HOME_TITLE,
    '/about': 'O nas',
    '/oferta': 'Oferta',
    '/services': 'Oferta',
    '/cennik': 'Cennik usług księgowych i kadrowo-płacowych',
    '/blog': 'Porady',
    '/blog-left-sidebar': 'Porady',
    '/blog-fullwidth': 'Porady',
    '/contact': 'Kontakt',
    '/faq': 'Najczęstsze pytania',
    '/team': 'Zespół',
    '/project': 'Realizacje',
    '/shop': 'Sklep',
    '/cart': 'Koszyk',
    '/checkout': 'Zamówienie',
    '/order_received': 'Dziękujemy za zamówienie',
    '/umow-konsultacje': 'Umów konsultację',
    '/polityka-prywatnosci': 'Polityka prywatności',
    '/404': 'Nie znaleziono strony',
};

// Sekcja nadrzedna dla sciezek ze slugiem — slug staje sie tytulem.
const SECTIONS = {
    'oferta': 'Oferta',
    'service-single': 'Oferta',
    'blog-single': 'Porady',
    'blog-single-left-sidebar': 'Porady',
    'blog-single-fullwidth': 'Porady',
    'team-single': 'Zespół',
    'project-single': 'Realizacje',
    'shop-single': 'Sklep',
};

// Slugi maja teraz odpowiedniki w danych, wiec w karcie przegladarki moze
// stac prawdziwy tytul zamiast sklejki ze sluga ("Cit estonski efektywna
// stopa", "Biuro rachunkowe lodz"). Upiekszanie sluga zostaje jako awaryjne,
// gdyby ktos wszedl na adres spoza danych.
const ZE_SLUGA = [...blogs, ...Services].reduce((mapa, poz) => {
    if (poz.slug) mapa[poz.slug] = poz.title;
    return mapa;
}, {});

const prettify = (slug) => {
    const czysty = decodeURIComponent(slug);
    if (ZE_SLUGA[czysty]) return ZE_SLUGA[czysty];
    const words = czysty.replace(/[-_]+/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
};

export const titleFor = (pathname) => {
    const path = pathname.replace(/\/+$/, '');
    if (TITLES[path]) return TITLES[path] === HOME_TITLE ? HOME_TITLE : `${TITLES[path]} · ${BRAND}`;

    const [, section, slug] = path.split('/');
    if (slug && SECTIONS[section]) return `${prettify(slug)} · ${SECTIONS[section]} · ${BRAND}`;
    if (SECTIONS[section]) return `${SECTIONS[section]} · ${BRAND}`;

    return HOME_TITLE;
};

// Ustawia tytul karty przegladarki przy kazdej zmianie trasy.
const DocumentTitle = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = titleFor(pathname);
    }, [pathname]);

    return null;
};

export default DocumentTitle;
