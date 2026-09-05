// Zgody na pliki cookies i narzedzia zbierajace dane.
//
// Standardowy model: kategoria niezbedna zawsze wlaczona i niewylaczalna,
// statystyki i marketing domyslnie WYLACZONE i wymagajace zgody. Tak dziala
// wiekszosc banerow i tak wymagaja tego przepisy — dla statystyk i reklamy
// opt-out nie wystarczy, zgoda musi byc uprzednia i aktywna.
//
// Mapa Google na /contact laduje sie bezwarunkowo (decyzja klienta) i nie
// jest tu kategoria — opisana jest w polityce prywatnosci.
//
// Swiadomie NIE uzywamy zewnetrznego narzedzia (Cookiebot, CookieYes,
// Osano). Kazde z nich to kolejny podmiot przetwarzajacy i adres IP
// kazdego odwiedzajacego wyciekajacy do ich serwerow.
//
// JAK PODPIAC GA4 / GTM / PIKSEL:
// przed zaladowaniem skryptu sprawdz czyZgoda('statystyki') albo
// czyZgoda('marketing') i nasluchuj zmian przez nasluchujZgod().
// Skrypt nie moze trafic do strony wczesniej.

const KLUCZ = 'dgc-zgody';

export const KATEGORIE = [
    {
        id: 'niezbedne',
        nazwa: 'Niezbędne',
        opis: 'Potrzebne do działania strony. Zapamiętują Twoją decyzję o plikach cookies '
            + 'i to, że okienko zapisu na newsletter już się wyświetliło. Nie można ich wyłączyć.',
        zawsze: true,
    },
    {
        id: 'statystyki',
        nazwa: 'Statystyki',
        opis: 'Pozwalają liczyć odwiedziny i sprawdzać, które treści są przydatne. '
            + 'Dzięki nim wiemy, co poprawić.',
    },
    {
        id: 'marketing',
        nazwa: 'Marketing',
        opis: 'Umożliwiają mierzenie skuteczności reklam i dopasowanie ich do Twoich '
            + 'zainteresowań.',
    },
];

// Kategorie, o ktore realnie pytamy (niezbedne sa wlaczone z definicji).
export const WYBIERALNE = KATEGORIE.filter((k) => !k.zawsze);

const ZDARZENIE = 'dgc-zgody-zmiana';

// localStorage potrafi rzucic wyjatkiem w trybie prywatnym i przy
// zablokowanych danych witryn — kazde siegniecie w try/catch.
const odczyt = () => {
    try { return JSON.parse(localStorage.getItem(KLUCZ)) || null; } catch { return null; }
};

export const stanZgod = () => odczyt()?.zgody ?? null;

export const czyRozstrzygniete = () => stanZgod() !== null;

// Bez decyzji uzytkownika kazda kategoria wybieralna jest wylaczona.
export const czyZgoda = (id) => {
    if (KATEGORIE.find((k) => k.id === id)?.zawsze) return true;
    return stanZgod()?.[id] === true;
};

export const zapiszZgody = (zgody) => {
    try {
        localStorage.setItem(KLUCZ, JSON.stringify({
            zgody,
            // Data przydaje sie dowodowo: trzeba umiec wykazac, kiedy i na co
            // zgoda zostala udzielona.
            data: new Date().toISOString(),
            wersja: 1,
        }));
    } catch { /* brak dostepu do pamieci — zgoda dziala do konca sesji */ }
    window.dispatchEvent(new CustomEvent(ZDARZENIE, { detail: zgody }));
};

export const wszystkie = (wartosc) =>
    Object.fromEntries(WYBIERALNE.map((k) => [k.id, wartosc]));

// Wycofanie zgody musi byc tak samo latwe jak jej udzielenie — stad
// odnosnik w stopce, ktory wola te funkcje i pokazuje baner ponownie.
export const wycofajZgody = () => {
    try { localStorage.removeItem(KLUCZ); } catch { /* trudno */ }
    window.dispatchEvent(new CustomEvent(ZDARZENIE, { detail: null }));
};

export const nasluchujZgod = (fn) => {
    window.addEventListener(ZDARZENIE, fn);
    return () => window.removeEventListener(ZDARZENIE, fn);
};
