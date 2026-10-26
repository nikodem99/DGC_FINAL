// Dane podstrony /umow-konsultacje.
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │ Cena i czas trwania POTWIERDZONE przez biuro 22.10.2026:             │
// │ 250 zl netto za 30 minut (wczesniej bylo robocze 200 zl za godzine). │
// │ Cena wystepuje w calym projekcie TYLKO w stalej CENA ponizej.        │
// └──────────────────────────────────────────────────────────────────────┘

// Formularz nie pobiera platnosci — kwote potwierdza pracownik telefonicznie,
// dlatego "od". Gdy ceny beda zroznicowane wedlug tematu, tu dochodzi
// rozbicie, a nie kolejne miejsce z liczba w komponencie.
//
// UWAGA: blok ponizej jest odtwarzany przez pobierz-z-serwera.mjs, wiec
// komentarze musza stac nad nim, nie w srodku.
export const CENA = {
    kwota: 'od 250 zł netto',
    jednostka: 'za 30 minut konsultacji',
    uwaga: 'Ostateczną cenę potwierdzamy telefonicznie, zanim poprosimy o płatność.',
};

export const CZAS_TRWANIA = '30 minut';

// Tematy konsultacji. Spojne z lista TEMATY uzywana w pozostalych
// formularzach, ale zawezone do spraw, ktore realnie nadaja sie na
// platna rozmowe, a nie na zwykle zapytanie ofertowe.
export const TEMATY_KONSULTACJI = [
    'Wybór formy opodatkowania',
    'Start działalności i wybór formy',
    'Przekształcenie działalności w spółkę',
    'Rozliczenia VAT, PIT, CIT',
    'Kadry, płace i ZUS',
    'Księgi rachunkowe i zamknięcie roku',
    'Zmiana biura rachunkowego',
    'Inny temat',
];

// Forma spotkania. Biuro obsluguje klientow online z calej Polski,
// wiec telefon i wideo sa na rowni z wizyta w Lodzi.
export const FORMY_KONSULTACJI = [
    'Rozmowa telefoniczna',
    'Spotkanie online (wideo)',
    'Spotkanie w biurze w Łodzi',
];

// Przedzialy godzinowe wynikaja z godzin pracy biura (pon.–pt. 8:00–16:00
// w src/api/kontakt.js). Gdy godziny sie zmienia, trzeba poprawic oba pliki.
export const PRZEDZIALY = [
    '8:00 – 10:00',
    '10:00 – 12:00',
    '12:00 – 14:00',
    '14:00 – 16:00',
];

export const FORMY_DZIALALNOSCI = [
    'Jednoosobowa działalność',
    'Spółka z o.o.',
    'Spółka cywilna',
    'Spółka jawna, komandytowa lub inna',
    'Fundacja lub stowarzyszenie',
    'Jeszcze nie mam firmy',
];

// Cztery kroki procesu. To najwazniejszy tekst na tej podstronie: konsultacja
// jest platna, a formularz niczego nie rezerwuje ani nie pobiera pieniedzy.
// Napisane wprost, zeby nikt nie mial poczucia, ze zostal zaskoczony
// prosba o przelew.
export const KROKI = [
    {
        tytul: 'Wypełniasz formularz',
        opis: 'Podajesz temat, preferowany dzień i porę. Im więcej napiszesz o swojej sytuacji, tym lepiej przygotujemy się do rozmowy.',
    },
    {
        tytul: 'Potwierdzamy zgłoszenie',
        opis: 'Dostajesz od nas wiadomość, że zgłoszenie do nas dotarło. To jeszcze nie jest rezerwacja terminu.',
    },
    {
        tytul: 'Dzwonimy do Ciebie',
        opis: 'Ustalamy dokładny termin, zakres rozmowy i cenę. Wtedy też mówimy, czy Twoja sprawa w ogóle wymaga płatnej konsultacji.',
    },
    {
        tytul: 'Opłacasz i rozmawiamy',
        opis: 'Po ustaleniach wysyłamy dane do przelewu. Termin rezerwujemy po zaksięgowaniu wpłaty.',
    },
];

// Czego mozna sie spodziewac. Bez obietnic, ktorych biuro nie potwierdzilo.
export const CO_ZYSKUJESZ = [
    'Rozmowę z osobą, która na co dzień prowadzi księgi, a nie z konsultantem sprzedażowym.',
    'Konkretną odpowiedź na Twoją sytuację, a nie ogólny wykład o przepisach.',
    'Wskazanie, co zrobić dalej i jakie dokumenty przygotować.',
];

export const JAK_SIE_PRZYGOTOWAC = [
    'Opisz sprawę w formularzu, choćby w kilku zdaniach.',
    'Przygotuj dokumenty, których dotyczy pytanie: umowy, faktury, decyzje, pisma z urzędu.',
    'Zapisz pytania, na które chcesz uzyskać odpowiedź, żeby nie zgubić ich w rozmowie.',
];
