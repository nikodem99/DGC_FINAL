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
    akapit: 'Obsługujemy jednoosobowe działalności, spółki i organizacje z całej Polski. W pełni online, bez dojazdów do biura, z ubezpieczeniem OC. Prowadzimy księgi nieprzerwanie od 2011 roku.',
    przycisk: 'Umów konsultację',
};

export const O_NAS = {
    naglowek: 'O nas',
    podtytul: 'Partnerem w biznesie, nie tylko biurem',
    akapity: [
        'Od 2011 roku prowadzimy księgowość firm o zróżnicowanym profilu działania i różnej wielkości. Wsłuchujemy się w potrzeby klienta i dobieramy rozwiązania do jego sytuacji. Chcemy być partnerem w biznesie, a nie tylko biurem, które księguje dokumenty.',
        'Obsługa odbywa się online, więc dokumenty dostarczasz wtedy, kiedy Ci wygodnie, bez dojazdów do biura. Prowadzimy pełną księgowość, rozliczenia podatkowe oraz sprawy kadrowo-płacowe, a firmom szukającym adresu oferujemy biuro wirtualne.',
    ],
};

export const CENNIK_TEKSTY = {
    nad: 'Pakiety usług',
    tytul: 'Ile kosztuje księgowość',
    wstep: 'Każdą współpracę wyceniamy indywidualnie. Pakiety pokazują '
        + 'podstawowy zakres obsługi i ułatwiają wybór właściwego rozwiązania.',
    uwaga: 'Obsługujemy przedsiębiorców z całej Polski — w pełni online, '
        + 'bez dojazdów do biura. Przed rozpoczęciem współpracy omawiamy '
        + 'potrzeby firmy oraz dokładny zakres czynności.',
    nad2: 'Indywidualna oferta',
    tytul2: 'Twoje rachunki w najlepszych rękach',
    wstep2: 'Potrzebujesz wsparcia księgowego lub kadrowego? Skontaktuj się '
        + 'z nami. Przygotujemy ofertę dopasowaną do Twojej firmy.',
    formularz: 'Zostaw kontakt i napisz, czego potrzebujesz. Odpowiemy z wyceną '
        + 'w ciągu 24 godzin roboczych.',
};

// Proza z /umow-konsultacje/. Cena, czas, "Co z tego masz" i "Jak sie
// przygotowac" NIE sa tutaj — te biuro edytuje osobno, zakladka Konsultacja.
export const KONSULTACJA_TEKSTY = {
    tytul: 'Godzina rozmowy zamiast domysłów',
    wstep: 'Konsultacja to indywidualna rozmowa o Twojej sytuacji: formie '
        + 'opodatkowania, rozliczeniach, kadrach albo planowanej zmianie '
        + 'w firmie. Odpowiadamy na konkretne pytania i mówimy, co zrobić '
        + 'dalej. Nie musisz być naszym klientem, żeby z niej skorzystać.',
    krokiTytul: 'Jak to działa',
    kroki: [
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
    ],
    formularzTytul: 'Zgłoś się na konsultację',
    formularzOpis: 'Wypełnij formularz, a oddzwonimy w ciągu 24 godzin roboczych, '
        + 'żeby potwierdzić termin i cenę.',
};

// Opisy szesciu kafelkow oferty na stronie glownej i na /oferta/.
// Sam TYTUL karty zostaje poza panelem: jest jednoczesnie nazwa w menu
// i podstawa adresu podstrony, wiec jego zmiana przebudowalaby nawigacje.
export const OFERTA_KARTY = {
    'biuro-rachunkowe-lodz': 'Kompleksowa obsługa rachunkowa i podatkowa dla firm z Łodzi i całej Polski.',
    'biuro-ksiegowe-lodz': 'Pełna księgowość, KPiR, rozliczenia podatkowe i doradztwo dla przedsiębiorców.',
    'rozliczenia-podatku': 'Terminowe i zgodne z przepisami rozliczenia najważniejszych zobowiązań podatkowych.',
    'rozliczenia-kadrowo-placowe-pracownikow': 'Rzetelna obsługa wynagrodzeń, dokumentacji pracowniczej i obowiązków urzędowych.',
    'uslugi-kadrowo-placowe': 'Outsourcing kadr i płac dopasowany do wielkości, branży i sposobu działania firmy.',
    'prowadzenie-ksiag-rachunkowych': 'Księgi rachunkowe, KPiR, ryczałt oraz kompletna ewidencja dokumentacji firmy.',
};

export default {
    hero: HERO,
    onas: O_NAS,
    cennik: CENNIK_TEKSTY,
    konsultacja: KONSULTACJA_TEKSTY,
    ofertaKarty: OFERTA_KARTY,
};
