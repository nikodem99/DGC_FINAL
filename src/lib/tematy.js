// Tematy zapytan. Wyjsciowo 1:1 z formularzem na biurodgc.pl/dgc-lp.html,
// ale dwie pozycje zostaly zmienione pod polityke Google Ads "Dokumenty
// urzedowe": zamiast "Rejestracja firmy lub spolki" jest "Dopiero zakladam
// firme", a "Doradztwo podatkowe" znikneło. Reklamy odsylajace do uslug
// zalatwiania spraw urzedowych i do doradztwa podatkowego wpadaja pod
// ograniczenia tej polityki, wiec sama obecnosc tych hasel w formularzu
// potrafi wywrocic moderacje kampanii.
//
// Stary landing dgc-lp.html ma wlasna, osobna liste tematow i zostaje
// nietkniety, bo prowadza do niego aktywne kampanie. Sprawdzone 23.09.2026:
// jego lista NIE zawiera juz ani "Rejestracja firmy lub spolki", ani
// "Doradztwo podatkowe" — zostaly stamtad wyciete przy odblokowywaniu konta
// reklamowego. Obie listy sa wiec zgodne z polityka, choc brzmia inaczej.
// Wspoldzielone przez pasek pod nagłówkiem i formularz na stronie kontaktu,
// zeby obie listy nie rozjechaly sie przy pierwszej zmianie oferty.
export const TEMATY = [
    'Księgowość JDG / działalność',
    'Księgowość spółki (sp. z o.o., s.c.)',
    'Kadry i płace (ZUS, PFRON)',
    'Podatki (VAT, PIT, CIT)',
    'Dopiero zakładam firmę',
    'Wirtualne biuro',
    'Inne pytanie',
];
