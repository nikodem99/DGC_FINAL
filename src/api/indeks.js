// Indeks artykulow widziany przez aplikacje w przegladarce.
//
// Problem, ktory ten plik rozwiazuje
// ----------------------------------
// Lista artykulow jest wkompilowana w paczke JavaScriptu przy budowaniu.
// Panel redakcyjny stoi na hostingu klienta i dodaje artykuly PO tym
// budowaniu — pisze gotowa strone HTML i odswieza pliki danych, ale nie
// ma jak zmienic paczki JS.
//
// Bez tego modulu dzialo by sie tak: ktos wchodzi na nowy artykul, widzi
// poprawna tresc z gotowego HTML-a, po czym React sie montuje, nie znajduje
// tego sluga na swojej liscie i podmienia wszystko na "nie znalezlismy
// takiego wpisu". Na liscie porad nowy wpis znikalby w ten sam sposob.
//
// Rozwiazanie: lista z paczki jest punktem wyjscia, a /dane/wpisy.json
// jest prawda. Doczytujemy go PO pierwszym wyswietleniu (wiec nic nie
// blokuje) i tylko wtedy, gdy strona faktycznie pokazuje artykuly.
// Gdy plik jest nieosiagalny albo uszkodzony, zostaje lista z paczki
// i serwis dziala jak dotad.

import wkompilowane from './blogs.js';

let biezace = wkompilowane;
let wersja = 0;
let pobieranie = null;
const sluchacze = new Set();

const powiadom = () => { for (const f of sluchacze) f(); };

/** Aktualna lista wpisow. Ta sama referencja, dopoki nic sie nie zmienilo. */
export const wpisy = () => biezace;

/**
 * Doczytuje liste z serwera. Wola sie samo z komponentow listy i artykulu.
 * Powtorne wywolania trafiaja w to samo zapytanie, wiec mozna wolac bez obaw.
 */
export function odswiez() {
    if (typeof fetch === 'undefined') return Promise.resolve(biezace);
    if (pobieranie) return pobieranie;

    pobieranie = fetch('/dane/wpisy.json', { cache: 'no-cache' })
        .then((odp) => (odp.ok ? odp.json() : null))
        .then((dane) => {
            const lista = dane && Array.isArray(dane.wpisy) ? dane.wpisy : null;
            if (!lista || !lista.length) return biezace;

            // Obrazki: w paczce sa importowane przez Vite i maja gotowe
            // adresy, a w pliku danych stoja jako zwykly tekst. Skladamy
            // jedno z drugim, zeby karta nie zostala bez zdjecia.
            const zPaczki = new Map(wkompilowane.map((w) => [w.slug, w]));
            const polaczone = lista.map((w) => {
                const stary = zPaczki.get(w.slug);
                return {
                    ...stary,
                    ...w,
                    screens: w.obrazek || stary?.screens,
                    blogSingleImg: w.obrazek || stary?.blogSingleImg,
                    title2: w.title2 ?? w.title,
                };
            });

            // Nie ruszamy nic, gdy plik niesie dokladnie to samo — inaczej
            // kazde wejscie na liste przerysowywaloby ja bez powodu.
            const bezZmian =
                polaczone.length === biezace.length &&
                polaczone.every((w, i) => w.slug === biezace[i].slug && w.title === biezace[i].title);
            if (bezZmian) return biezace;

            biezace = polaczone;
            wersja += 1;
            powiadom();
            return biezace;
        })
        .catch(() => biezace);

    return pobieranie;
}

// --- podpiecie pod Reacta ----------------------------------------------

export function subskrybuj(f) {
    sluchacze.add(f);
    return () => sluchacze.delete(f);
}

export const migawka = () => wersja;

// Przy prerenderowaniu w Node nie ma fetch ani przegladarki, a lista
// z paczki jest wtedy jedyna i wystarczajaca.
export const migawkaSerwera = () => 0;
