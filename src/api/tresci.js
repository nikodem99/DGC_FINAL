// Tresci artykulow NIE sa wkompilowane w paczke JavaScriptu i to jest
// celowe.
//
// Powod jest policzony, nie przeczuty. Przy pietnastu artykulach tresc
// wazyla 21 kB po kompresji i siedziala w glownym pliku JS. Przy 373
// artykulach byloby to okolo 530 kB, przy glownym pliku wazacym 263 kB.
// Czyli kazdy odwiedzajacy, takze ten, ktory nigdy nie otworzy zadnego
// artykulu, pobieralby trzy razy wiecej niz dzis.
//
// Zamiast tego kazdy artykul ma wlasny plik src/tresci/<slug>.json,
// podpiety przez import.meta.glob BEZ eager. Vite robi z kazdego osobny
// kawalek, ladowany dopiero gdy jest potrzebny:
//
//   - przy budowaniu prerender doczytuje kawalek i wkleja tresc do gotowego
//     HTML-a. Google i czytnik bez JavaScriptu widza pelny tekst dokladnie
//     tak jak wczesniej, wiec pod SEO nic sie nie zmienia,
//   - przegladarka przy pierwszym wejsciu bierze tresc z tego samego HTML-a
//     (znacznik <script type="application/json">), wiec nie robi ani jednego
//     dodatkowego zapytania i nie ma rozjazdu przy hydracji,
//   - dopiero przeskok miedzy artykulami wewnatrz serwisu dociaga jeden
//     kawalek, czyli kilka kilobajtow.
//
// Dlaczego nie odczyt z dysku w prerenderze: main.jsx jest wejsciem paczki
// przegladarkowej, a Vite wycina z niej moduly wbudowane Node'a. import
// node:fs konczyl sie tam bledem "readFileSync is not a function". Glob
// dziala po obu stronach, bo Vite rozwiazuje go przy budowaniu.

// Klucze maja postac './../tresci/<slug>.json' — tak Vite normalizuje
// sciezki w globie. Mapujemy je na same slugi, zeby reszta kodu nie
// musiala o tym wiedziec.
const moduly = import.meta.glob('../tresci/*.json');
const poSlugu = new Map(
    Object.entries(moduly).map(([sciezka, zaladuj]) => [
        sciezka.slice(sciezka.lastIndexOf('/') + 1, -'.json'.length),
        zaladuj,
    ])
);

const pamiec = new Map();

/** Wklada tresc do pamieci. Uzywane przez prerender i przez ziarno w HTML. */
export const ustaw = (slug, bloki) => {
    if (slug && Array.isArray(bloki)) pamiec.set(slug, bloki);
};

/** Tresc, jesli juz jest pod reka. Synchronicznie, bez zadnego zapytania. */
export const zPamieci = (slug) => pamiec.get(slug);

/** Dociaga tresc artykulu. Wola sie tylko przy przeskoku miedzy wpisami. */
export async function wczytaj(slug) {
    if (pamiec.has(slug)) return pamiec.get(slug);
    const zaladuj = poSlugu.get(slug);
    if (!zaladuj) throw new Error(`Brak tresci artykulu ${slug}`);
    const modul = await zaladuj();
    const bloki = modul.default ?? modul;
    ustaw(slug, bloki);
    return bloki;
}

// Ziarno wstrzykniete przez prerender do gotowego HTML-a. Czytamy je raz,
// przy starcie aplikacji, zanim React cokolwiek narysuje — dzieki temu
// pierwsze rysowanie po stronie przegladarki ma te same dane co HTML
// z serwera i hydracja nie zglasza rozjazdu.
export function wczytajZiarno() {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('dgc-tresc');
    if (!el) return;
    try {
        ustaw(el.dataset.slug, JSON.parse(el.textContent));
    } catch {
        // Uszkodzone ziarno nie moze zablokowac startu strony. Tresc
        // zostanie po prostu dociagnieta zapytaniem.
    }
}
