import { StrictMode } from "react";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";

// Start w przegladarce. Import jest dynamiczny i warunkowy, bo ten sam plik
// wykonuje sie takze w Node przy budowaniu (patrz prerender ponizej), a tam
// nie ma ani document, ani createRoot.
if (typeof document !== 'undefined') {
    // UWAGA: to MUSI byc funkcja asynchroniczna wywolana od razu, a NIE
    // `await` na najwyzszym poziomie modulu. Roznica jest niewidoczna
    // lokalnie i katastrofalna po zbudowaniu.
    //
    // Rollup wydziela PersistGate do osobnego kawalka, a ten kawalek
    // importuje z powrotem z main (bo potrzebuje Reacta, ktory tu siedzi).
    // Przy `await` na najwyzszym poziomie modul main zatrzymuje sie w
    // polowie wykonywania i czeka na ten kawalek, a kawalek czeka, az main
    // skonczy sie wykonywac. Oba stoja w miejscu.
    //
    // Cisza absolutna: zero bledow w konsoli, wszystkie pliki pobrane z
    // kodem 200. Strona wyglada poprawnie, bo widac prerenderowany HTML,
    // ale React nigdy sie nie montuje i nic interaktywnego nie dziala.
    //
    // Funkcja asynchroniczna konczy wykonywanie modulu natychmiast, wiec
    // kawalek dostaje to, po co przyszedl, i petla sie rozplata.
    (async () => {
        const [{ createRoot }, { PersistGate }, { persistor }] = await Promise.all([
            import("react-dom/client"),
            import("redux-persist/integration/react"),
            import("./store"),
        ]);

        createRoot(document.getElementById("root")).render(
            <StrictMode>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <App />
                    </PersistGate>
                </Provider>
            </StrictMode>
        );
    })();
}

// --- Prerenderowanie przy budowaniu ------------------------------------
//
// Generuje osobny plik HTML dla kazdej trasy, z wlasnym tytulem, opisem
// i Open Graph. To jedyna wersja strony, jaka widza roboty Facebooka,
// LinkedIna oraz narzedzia AI, bo zadne z nich nie wykonuje JavaScriptu.
//
// TRZY RZECZY, KTORYCH NIE WOLNO TU RUSZYC:
//
// 1. "react-dom/server.edge", nie "react-dom/server". Wariant node trzyma
//    uchwyty w petli zdarzen i build nigdy sie nie konczy — wypisuje
//    "built in Xs" i wisi do konca swiata. To zgloszenie #3 w repozytorium
//    wtyczki, zamkniete dopiero w lipcu 2026.
//
// 2. Brak PersistGate. redux-persist rehydruje sie asynchronicznie, a
//    renderToString jest synchroniczne, wiec PersistGate zdazylby zwrocic
//    tylko swoje "loading", czyli null. Efekt: komplet plikow HTML z pustym
//    <div id="root"> i build, ktory "przeszedl". W przegladarce PersistGate
//    zostaje, bo tam dziala poprawnie.
//
// 3. Tytul i meta ida przez zwracany obiekt head, a NIE przez znaczniki
//    w drzewie Reacta. React 19 renderuje <title> i <meta> na poczatku
//    zwracanego stringa, a ten string wtyczka wkleja do <div id="root">,
//    czyli do <body>. Opis meta w <body> Google ignoruje.
export async function prerender(data) {
    const { renderToString } = await import('react-dom/server.edge');
    const { metaDla, DOMENA, MARKA } = await import('./seo/meta.js');

    const sciezka = new URL(data.url, DOMENA).pathname;
    const m = metaDla(sciezka);
    const obrazek = `${DOMENA}/og-dgc.jpg`;

    const html = renderToString(
        <Provider store={store}>
            <App sciezka={sciezka} />
        </Provider>
    );

    const elements = new Set([
        { type: 'meta', props: { name: 'description', content: m.opis } },
        { type: 'link', props: { rel: 'canonical', href: m.kanoniczny } },

        { type: 'meta', props: { property: 'og:type', content: m.typ } },
        { type: 'meta', props: { property: 'og:title', content: m.tytul } },
        { type: 'meta', props: { property: 'og:description', content: m.opis } },
        { type: 'meta', props: { property: 'og:url', content: m.kanoniczny } },
        { type: 'meta', props: { property: 'og:site_name', content: MARKA } },
        { type: 'meta', props: { property: 'og:locale', content: 'pl_PL' } },
        { type: 'meta', props: { property: 'og:image', content: obrazek } },

        { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { name: 'twitter:title', content: m.tytul } },
        { type: 'meta', props: { name: 'twitter:description', content: m.opis } },
        { type: 'meta', props: { name: 'twitter:image', content: obrazek } },
    ]);

    if (m.noindex) {
        elements.add({ type: 'meta', props: { name: 'robots', content: 'noindex, follow' } });
    }

    // Dane strukturalne tylko na stronie glownej i na kontakcie — powtarzanie
    // ich na kazdej podstronie niczego nie dodaje, a zwieksza ryzyko rozjazdu.
    if (sciezka === '/' || sciezka === '/kontakt') {
        const { DANE_FIRMY } = await import('./seo/firma.js');
        elements.add({
            type: 'script',
            props: { type: 'application/ld+json' },
            children: JSON.stringify(DANE_FIRMY),
        });
    }

    return { html, head: { lang: 'pl', title: m.tytul, elements } };
}
