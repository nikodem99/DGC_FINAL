// Teksty, ktore biuro moze zmieniac z panelu, a ktore nie sa ani lista
// pakietow, ani pytaniem FAQ, ani danymi kontaktowymi — czyli zwykla proza
// na stronie glownej i na /o-nas/.
//
// Dlaczego osobny plik, a nie dopisanie pol do cennika albo konsultacji:
// tamte zestawy maja ustalony ksztalt (tablica pakietow, obiekt z cena),
// ktory sprawdza i odswiez() w tresciStron.js, i formularz panelu. Doklejenie
// do nich prozy zepsuloby oba.
//
// To jest wersja WYJSCIOWA, wkompilowana w paczke. Prawda jest plik
// /dane/tresc/strony.json na serwerze, zapisywany przez panel. Zasada
// jak przy cenniku — opisana w tresciStron.js.

export const HERO = {
    nad: 'Biuro rachunkowe · Łódź · online',
    tytul: 'Twoja księgowość w dobrych rękach',
    akapit: 'Obsługujemy jednoosobowe działalności, spółki i organizacje z całej Polski. '
        + 'W pełni online, bez dojazdów do biura, z ubezpieczeniem OC. '
        + 'Prowadzimy księgi nieprzerwanie od 2011 roku.',
    przycisk: 'Umów konsultację',
};

export const O_NAS = {
    naglowek: 'O nas',
    podtytul: 'Partnerem w biznesie, nie tylko biurem',
    akapity: [
        'Od 2011 roku prowadzimy księgowość firm o zróżnicowanym profilu działania '
        + 'i różnej wielkości. Wsłuchujemy się w potrzeby klienta i dobieramy rozwiązania '
        + 'do jego sytuacji. Chcemy być partnerem w biznesie, a nie tylko biurem, '
        + 'które księguje dokumenty.',
        'Obsługa odbywa się online, więc dokumenty dostarczasz wtedy, kiedy Ci wygodnie, '
        + 'bez dojazdów do biura. Prowadzimy pełną księgowość, rozliczenia podatkowe '
        + 'oraz sprawy kadrowo-płacowe, a firmom szukającym adresu oferujemy biuro wirtualne.',
    ],
};

export default { hero: HERO, onas: O_NAS };
