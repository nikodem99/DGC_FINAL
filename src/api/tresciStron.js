// Tresc stron stalych, ktora biuro moze zmieniac z panelu: cennik i FAQ.
//
// Zespol celowo NIE jest tu obslugiwany. Suwak zespolu prerenderuje sie
// z klonami slajdow i szerokosciami liczonymi z szerokosci okna, wiec
// odtworzenie go w PHP byloby kruche. Przy zmianie skladu biuro dzwoni
// do opiekuna strony — tak ustalone z klientem 22.10.2026.
//
// Ten plik jest odpowiednikiem src/api/indeks.js, tyle ze dla cennika
// i pytan FAQ zamiast artykulow. Zasada jest ta sama i z tego samego
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

import { useState, useEffect } from 'react';
import pakietyZPaczki from './pricing.js';
import { FAQ_OGOLNE as faqZPaczki } from './faq.js';
import { CENA, CZAS_TRWANIA, CO_ZYSKUJESZ, JAK_SIE_PRZYGOTOWAC } from './konsultacje.js';
import { KONTAKT } from './kontakt.js';
import trescOfertyZPaczki from './serviceContent.js';
import tekstyStronZPaczki from './tekstyStron.js';

const DOMYSLNE = {
    cennik: pakietyZPaczki,
    faq: faqZPaczki,
    // Konsultacja nie jest lista, tylko kilkoma polami — stad inny ksztalt.
    konsultacje: {
        kwota: CENA.kwota,
        jednostka: CENA.jednostka,
        uwaga: CENA.uwaga,
        czas: CZAS_TRWANIA,
        zyskujesz: CO_ZYSKUJESZ,
        przygotowanie: JAK_SIE_PRZYGOTOWAC,
    },
    kontakt: KONTAKT,
    // Mapa slug -> tresc podstrony, a nie lista.
    oferta: trescOfertyZPaczki,
    // Proza ze strony glownej i /o-nas/: hero i sekcja "O nas".
    strony: tekstyStronZPaczki,
};

const biezace = { ...DOMYSLNE };
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
            // Listy musza byc niepuste, obiekt konsultacji musi miec cene.
            const puste = Array.isArray(dane)
                ? !dane.length
                : !(dane && (dane.kwota || dane.telefon || Object.keys(dane).length));
            if (puste) return biezace[co];
            if (JSON.stringify(dane) === JSON.stringify(biezace[co])) return biezace[co];

            biezace[co] = dane;
            powiadom();
            return biezace[co];
        })
        .catch(() => biezace[co]);

    return pobierania[co];
}

/**
 * Hak dla komponentow: 'cennik', 'faq', 'konsultacje', 'kontakt', 'oferta', 'strony'.
 *
 * Przy prerenderowaniu w Node nie ma fetch ani przegladarki, wiec zwraca
 * wersje z paczki — dokladnie ta, ktora trafia do gotowego HTML-a.
 *
 * NAZWA MUSI ZACZYNAC SIE OD "use" — to nie jest kosmetyka
 * -------------------------------------------------------
 * Hak nazywal sie uzyjTresci i to BYLO zrodlem bledu, ktory gasil strony.
 *
 * W vite.config.js wlaczony jest babel-plugin-react-compiler. Kompilator
 * rozpoznaje haki PO NAZWIE: funkcja jest hakiem, gdy nazywa sie use + duza
 * litera. "uzyjTresci" wygladalo dla niego jak zwykla funkcja, wiec wolno mu
 * bylo wstawic jej wywolanie do warunku memoizacji. W zbudowanej paczce
 * FaqSection wygladala tak:
 *
 *     if ($[1] !== ile || $[2] !== items) {
 *         const zPanelu = uzyjTresci("faq");   // hak w srodku IF-a
 *     } else { t3 = $[3]; }                    // przerysowanie: hak pominiety
 *
 * Czyli przy kazdym przerysowaniu z niezmienionymi props hak NIE byl wolany,
 * a kolejnosc hakow sie rozjezdzala. React przerywal renderowanie i zwijal
 * cale drzewo. Skutek dla klienta: zmiana czegokolwiek w panelu — choćby
 * godzin pracy w kontakcie — pokazywala PUSTA STRONE na /faq/ i /o-nas/.
 * Sprawdzone pomiarem na zbudowanej paczce, takze na wersji sprzed tych
 * zmian, wiec blad byl starszy.
 *
 * Ten sam blad mial uzyjWpisow (teraz useWpisy).
 *
 * PRZY OKAZJI: dlaczego nie useSyncExternalStore
 * ----------------------------------------------
 * To juz osobna sprawa, nie przyczyna tamtego bledu. Stalo tu
 * useSyncExternalStore(subskrybuj, () => wersja, () => 0): migawka byla
 * JEDNYM globalnym licznikiem dla wszystkich zestawow, a dane czytalo sie
 * obok magazynu, przez biezace[co]. Zmiana godzin w kontakcie przerysowywala
 * wiec takze cennik, pytania i teksty stron, ktorych nikt nie ruszal.
 * Zwykly stan z subskrypcja w efekcie robi to samo prosciej i tylko tam,
 * gdzie trzeba. Rozjazd miedzy watkami nam tu nie grozi, bo tresc dociaga
 * sie raz, po pierwszym wyswietleniu.
 */
export function useTresci(co) {
    const [dane, ustawDane] = useState(() => biezace[co]);

    useEffect(() => {
        let zywy = true;
        // Czytamy biezace[co] w momencie powiadomienia, a nie z domkniecia,
        // zeby nie zapamietac nieaktualnej referencji.
        const naZmiane = () => { if (zywy) ustawDane(biezace[co]); };

        sluchacze.add(naZmiane);
        // Stan mogl sie zmienic miedzy pierwszym rysowaniem a tym efektem.
        naZmiane();
        odswiez(co).then(naZmiane);

        return () => { zywy = false; sluchacze.delete(naZmiane); };
    }, [co]);

    return dane;
}

export default useTresci;
