// Tresc stron stalych, ktora biuro moze zmieniac z panelu.
//
// Ten plik jest odpowiednikiem src/api/indeks.js, tyle ze dla cennika,
// FAQ i zespolu zamiast artykulow. Zasada jest ta sama i z tego samego
// powodu:
//
//   - wersja wkompilowana w paczke (pricing.js, faq.js, team.js) jest
//     punktem wyjscia i dziala, gdy nie da sie pobrac niczego z serwera,
//   - plik /dane/tresc/<co>.json na serwerze jest PRAWDA, bo to on jest
//     zapisywany przez panel,
//   - doczytujemy go PO pierwszym wyswietleniu, wiec nic nie blokuje.
//
// Bez tego biuro zmienialoby cene w panelu, panel przepisywalby gotowy
// HTML, a React po zamontowaniu wracalby do ceny z paczki — czyli zmiana
// znikalaby na oczach odwiedzajacego.

import { useSyncExternalStore, useEffect } from 'react';
import pakietyZPaczki from './pricing.js';
import { FAQ_OGOLNE as faqZPaczki } from './faq.js';
import { ZESPOL_BIURA as zespolZPaczki } from './team.js';

const DOMYSLNE = {
    cennik: pakietyZPaczki,
    faq: faqZPaczki,
    zespol: zespolZPaczki,
};

const biezace = { ...DOMYSLNE };
let wersja = 0;
const pobierania = {};
const sluchacze = new Set();

const powiadom = () => { for (const f of sluchacze) f(); };

/**
 * Doczytuje jeden zestaw z serwera. Powtorne wywolania trafiaja w to samo
 * zapytanie, wiec mozna wolac z kazdego komponentu bez obaw.
 */
export function odswiez(co) {
    if (typeof fetch === 'undefined') return Promise.resolve(biezace[co]);
    if (pobierania[co]) return pobierania[co];

    pobierania[co] = fetch(`/dane/tresc/${co}.json`, { cache: 'no-cache' })
        .then((odp) => (odp.ok ? odp.json() : null))
        .then((dane) => {
            // Pusta albo uszkodzona odpowiedz NIE moze wyczyscic strony —
            // zostaje wtedy wersja z paczki.
            if (!Array.isArray(dane) || !dane.length) return biezace[co];
            if (JSON.stringify(dane) === JSON.stringify(biezace[co])) return biezace[co];

            biezace[co] = dane;
            wersja += 1;
            powiadom();
            return biezace[co];
        })
        .catch(() => biezace[co]);

    return pobierania[co];
}

function subskrybuj(f) {
    sluchacze.add(f);
    return () => sluchacze.delete(f);
}

const migawka = () => wersja;
const migawkaSerwera = () => 0;

/**
 * Hak dla komponentow. `co` to 'cennik', 'faq' albo 'zespol'.
 *
 * Przy prerenderowaniu w Node nie ma fetch ani przegladarki, wiec zwraca
 * wersje z paczki — dokladnie ta, ktora trafia do gotowego HTML-a.
 */
export function uzyjTresci(co) {
    useSyncExternalStore(subskrybuj, migawka, migawkaSerwera);

    // Doczytujemy dopiero po wyswietleniu, nie w trakcie rysowania —
    // tak samo jak uzyjWpisow() dla artykulow.
    useEffect(() => { odswiez(co); }, [co]);

    return biezace[co];
}

export default uzyjTresci;
