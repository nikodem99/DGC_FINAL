// Tresc polityki prywatnosci.
//
// ZASADA: nic tu nie jest wymyslone. Kazda liczba i nazwa pochodzi albo
// z rejestrow, albo z kodu tej strony, albo z materialow DGC. Rzeczy,
// ktorych nie znamy, siedza w DO_UZUPELNIENIA i renderuja sie jako
// widoczne wtracenie — zeby nikt nie wypuscil dokumentu z dziura.
//
// Struktura wzorowana na tym, czego wymaga art. 13 i 14 RODO. Nie jest to
// kopia cudzej polityki: cudzy dokument opisuje cudze przetwarzanie,
// a przepisanie go bylo by i naruszeniem praw autorskich, i podaniem
// nieprawdziwych informacji o DGC.

export const DO_UZUPELNIENIA = '[DO UZUPEŁNIENIA PRZEZ DGC]';

export const ADMINISTRATOR = {
    nazwa: 'DGC Biuro Rachunkowe Sp. z o.o.',
    adres: 'ul. Brukowa 8, 91-341 Łódź',
    krs: '0000384095',
    nip: DO_UZUPELNIENIA,
    regon: DO_UZUPELNIENIA,
    telefon: '731 580 184',
    email: 'kontakt@biurodgc.pl',
    emailRodo: DO_UZUPELNIENIA,
};

export const DATA_WERSJI = DO_UZUPELNIENIA;

export const SEKCJE = [
    {
        id: 'w-skrocie',
        tytul: 'W skrócie',
        akapity: [
            'Ta strona nie zbiera statystyk odwiedzin, nie wyświetla reklam i nie śledzi zachowania odwiedzających. Czcionki, z których korzysta, są na naszym serwerze, więc samo jej otwarcie nie wysyła żadnych danych do firm trzecich.',
            'Dane osobowe zbieramy tylko wtedy, gdy sam nam je podasz: przez formularz kontaktowy, pasek wyceny albo zapis na newsletter. Służą do udzielenia odpowiedzi, przygotowania oferty lub wysłania newslettera.',
            'Na stronie kontaktu osadzona jest mapa Google. Wczytuje się razem ze stroną, więc Google poznaje wtedy Twój adres IP i dane przeglądarki.',
            `W sprawach dotyczących danych osobowych napisz na ${ADMINISTRATOR.emailRodo}.`,
        ],
    },
    {
        id: 'administrator',
        tytul: 'Kto odpowiada za Twoje dane',
        akapity: [
            `Administratorem danych jest ${ADMINISTRATOR.nazwa} z siedzibą przy ${ADMINISTRATOR.adres}, wpisana do Krajowego Rejestru Sądowego pod numerem ${ADMINISTRATOR.krs}, NIP ${ADMINISTRATOR.nip}, REGON ${ADMINISTRATOR.regon}.`,
            `Kontakt w sprawach danych osobowych: ${ADMINISTRATOR.emailRodo}. Kontakt ogólny: ${ADMINISTRATOR.email}, tel. ${ADMINISTRATOR.telefon}.`,
            `Inspektor Ochrony Danych: ${DO_UZUPELNIENIA}. Jeśli nie został powołany, w tym miejscu wskazujemy punkt kontaktowy do spraw ochrony danych.`,
        ],
    },
    {
        id: 'dwie-role',
        tytul: 'Dwie role biura rachunkowego',
        akapity: [
            'Ta polityka opisuje dane, których jesteśmy administratorem: zgłoszenia z formularzy, zapisy na newsletter oraz dane osób kontaktowych naszych klientów i kontrahentów.',
            'Osobną sprawą są dane, które klienci powierzają nam do obsługi księgowej i kadrowej — dane ich pracowników, zleceniobiorców i kontrahentów. Tam administratorem jest klient, a my działamy na jego polecenie na podstawie umowy powierzenia. Jeśli jesteś pracownikiem firmy obsługiwanej przez nas, żądania dotyczące swoich danych kieruj do swojego pracodawcy, bo to on decyduje o celach i sposobach ich przetwarzania.',
        ],
    },
    {
        id: 'cele',
        tytul: 'Po co przetwarzamy dane i na jakiej podstawie',
        lista: [
            'Odpowiedź na zapytanie z formularza kontaktowego lub paska wyceny — art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz lit. f (nasz uzasadniony interes w prowadzeniu korespondencji).',
            'Wysyłka newslettera — art. 6 ust. 1 lit. a RODO (Twoja zgoda) w związku z przepisami o komunikacji elektronicznej dotyczącymi informacji handlowej.',
            'Prowadzenie ksiąg, rozliczeń i dokumentacji kadrowej klientów — art. 6 ust. 1 lit. b (umowa) i lit. c (obowiązki wynikające z ustawy o rachunkowości i Ordynacji podatkowej).',
            'Obowiązki instytucji obowiązanej w zakresie przeciwdziałania praniu pieniędzy — art. 6 ust. 1 lit. c RODO.',
            'Dochodzenie i obrona roszczeń oraz archiwizacja dokumentów — art. 6 ust. 1 lit. f RODO. Nasz interes polega tu na możliwości wykazania przebiegu współpracy, gdyby stała się przedmiotem sporu.',
        ],
    },
    {
        id: 'jakie-dane',
        tytul: 'Jakie dane zbieramy przez tę stronę',
        akapity: [
            'Formularz kontaktowy: imię i nazwisko, adres e-mail, numer telefonu, temat zapytania i treść wiadomości.',
            'Pasek wyceny: forma prawna działalności, orientacyjna liczba dokumentów w miesiącu i adres e-mail.',
            'Newsletter: wyłącznie adres e-mail oraz zapis Twojej zgody wraz z datą jej udzielenia.',
            'Podanie danych jest dobrowolne, ale bez adresu e-mail nie jesteśmy w stanie odpowiedzieć na zapytanie ani wysłać wyceny.',
        ],
    },
    {
        id: 'odbiorcy',
        tytul: 'Komu przekazujemy dane',
        lista: [
            'Forminit (UXPLUS LTD, Londyn, Wielka Brytania) — dostawca obsługi formularzy. Zgłoszenia przechowywane są na serwerach Amazon Web Services w Irlandii.',
            `Dostawca hostingu strony internetowej: ${DO_UZUPELNIENIA}.`,
            `Dostawca poczty elektronicznej: ${DO_UZUPELNIENIA}.`,
            `Dostawca oprogramowania księgowego: ${DO_UZUPELNIENIA}.`,
            `Agencja obsługująca stronę internetową: ${DO_UZUPELNIENIA}.`,
            'Doradcy prawni i podatkowi, biegli rewidenci oraz podmioty świadczące usługi archiwizacji — w zakresie niezbędnym do wykonania konkretnej usługi.',
            'Organy publiczne, jeżeli wymagają tego przepisy prawa.',
        ],
    },
    {
        id: 'poza-eog',
        tytul: 'Przekazywanie danych poza Europejski Obszar Gospodarczy',
        akapity: [
            'Zgłoszenia z formularzy przechowywane są na serwerach w Irlandii, czyli na terenie Europejskiego Obszaru Gospodarczego. Administratorem usługi jest jednak spółka brytyjska, a Wielka Brytania leży poza EOG. Podstawą przekazania jest decyzja Komisji Europejskiej stwierdzająca odpowiedni stopień ochrony danych w Wielkiej Brytanii.',
            'Jeżeli włączysz mapę Google, Twoje dane trafią do Google. Podstawą przekazania jest decyzja Komisji Europejskiej dotycząca ram ochrony danych w relacjach z USA. Gdyby ta podstawa przestała obowiązywać, poinformujemy o zmianie i wskażemy nową.',
            'Kopię dokumentów dotyczących zabezpieczeń przy przekazywaniu danych udostępnimy na żądanie skierowane na nasz adres do spraw ochrony danych.',
        ],
    },
    {
        id: 'jak-dlugo',
        tytul: 'Jak długo przechowujemy dane',
        lista: [
            `Korespondencja z formularza: ${DO_UZUPELNIENIA} od zakończenia sprawy.`,
            `Adres zapisany na newsletter: do wycofania zgody, a następnie ${DO_UZUPELNIENIA} na potrzeby wykazania, że zgoda istniała.`,
            `Dokumentacja księgowa i podatkowa: ${DO_UZUPELNIENIA} (przepisy wskazują co do zasady 5 lat licząc od końca roku, w którym upłynął termin płatności podatku).`,
            `Dokumentacja z zakresu przeciwdziałania praniu pieniędzy: ${DO_UZUPELNIENIA} (przepisy wskazują co do zasady 5 lat od zakończenia współpracy).`,
            `Dokumentacja pracownicza obsługiwana na zlecenie klientów: ${DO_UZUPELNIENIA} (przepisy wskazują co do zasady 10 lat).`,
        ],
    },
    {
        id: 'prawa',
        tytul: 'Twoje prawa',
        akapity: [
            'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przeniesienia do innego administratora.',
            'Przysługuje Ci również prawo sprzeciwu wobec przetwarzania opartego na naszym uzasadnionym interesie. Jeśli je zgłosisz, przestaniemy przetwarzać Twoje dane w tym celu, chyba że wykażemy istnienie ważnych, prawnie uzasadnionych podstaw nadrzędnych wobec Twoich interesów.',
            'Prawa do usunięcia danych nie zrealizujemy tam, gdzie przepisy nakazują nam je przechowywać — dotyczy to zwłaszcza dokumentacji księgowej, podatkowej i dokumentacji wymaganej przepisami o przeciwdziałaniu praniu pieniędzy.',
        ],
    },
    {
        id: 'wycofanie-zgody',
        tytul: 'Wycofanie zgody',
        akapity: [
            'Zgodę na otrzymywanie newslettera możesz wycofać w każdej chwili, korzystając z odnośnika w każdej wysłanej wiadomości albo pisząc na nasz adres do spraw ochrony danych. Wycofanie jest tak samo proste jak udzielenie zgody.',
            'Wycofanie zgody nie wpływa na zgodność z prawem tego, co robiliśmy z danymi wcześniej.',
            'Zgodę na pliki cookies służące statystykom i marketingowi zmienisz odnośnikiem „Ustawienia prywatności” w stopce strony.',
        ],
    },
    {
        id: 'skarga',
        tytul: 'Skarga do organu nadzorczego',
        akapity: [
            'Jeżeli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem, możesz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.',
        ],
    },
    {
        id: 'profilowanie',
        tytul: 'Profilowanie i decyzje automatyczne',
        akapity: [
            'Nie profilujemy odwiedzających i nie podejmujemy wobec nikogo decyzji wyłącznie na podstawie automatycznego przetwarzania danych.',
        ],
    },
    {
        id: 'skad-dane',
        tytul: 'Skąd mamy dane, których nie otrzymaliśmy od Ciebie',
        akapity: [
            'Część danych otrzymujemy od naszych klientów — dotyczy to danych ich pracowników, zleceniobiorców i kontrahentów, przekazywanych nam do obsługi księgowej i kadrowej. Zakres obejmuje dane niezbędne do rozliczeń i prowadzenia dokumentacji.',
            'Korzystamy też z publicznie dostępnych rejestrów: Krajowego Rejestru Sądowego, CEIDG oraz wykazu podatników VAT prowadzonego przez Szefa Krajowej Administracji Skarbowej.',
        ],
    },
    {
        id: 'cookies',
        tytul: 'Pliki cookies',
        akapity: [
            'Pliki cookies to niewielkie informacje zapisywane w Twojej przeglądarce. Dzielimy je na trzy grupy.',
        ],
        lista: [
            'Niezbędne — potrzebne do działania strony. Zapamiętują Twoją decyzję dotyczącą plików cookies oraz to, że okienko z zapisem na newsletter już się wyświetliło. Nie można ich wyłączyć, bo bez nich strona nie zadziała poprawnie.',
            'Statystyki — pozwalają liczyć odwiedziny i sprawdzać, które treści są przydatne. Włączają się tylko za Twoją zgodą.',
            'Marketing — umożliwiają mierzenie skuteczności reklam i dopasowanie ich do Twoich zainteresowań. Włączają się tylko za Twoją zgodą.',
        ],
        akapityPo: [
            'Przy pierwszej wizycie pokazujemy komunikat, w którym możesz przyjąć wszystkie pliki, odrzucić wszystkie nieobowiązkowe albo wybrać poszczególne kategorie. Decyzję zmienisz w każdej chwili odnośnikiem „Ustawienia prywatności” w stopce strony.',
            'Statystyki i marketing nie uruchamiają się, dopóki nie wyrazisz zgody. Odrzucenie jest tak samo proste jak akceptacja i nie ogranicza dostępu do żadnej części strony.',
            'Osobną sprawą jest mapa Google osadzona na stronie kontaktu. Wczytuje się ona razem ze stroną. Google otrzymuje wtedy Twój adres IP oraz informacje o przeglądarce i może odczytać własne pliki cookies, jeżeli znajdują się już w Twoim urządzeniu. Adres biura podajemy również w formie tekstowej na tej samej stronie oraz w stopce.',
            'Czcionki, ikony i pliki graficzne serwujemy z własnego serwera, więc poza wspomnianą mapą otwarcie strony nie powoduje połączeń z serwerami innych firm.',
            'Podstawą prawną jest ustawa Prawo komunikacji elektronicznej, która wymaga zgody nie tylko na zapisanie informacji w Twoim urządzeniu, ale również na dostęp do informacji już w nim obecnych.',
        ],
    },
    {
        id: 'bezpieczenstwo',
        tytul: 'Bezpieczeństwo i tajemnica zawodowa',
        akapity: [
            'Jako biuro rachunkowe jesteśmy związani tajemnicą zawodową obejmującą wszystkie informacje uzyskane w związku z obsługą klientów. Posiadamy ubezpieczenie odpowiedzialności cywilnej wymagane od biur rachunkowych.',
            'Stosujemy środki techniczne i organizacyjne odpowiednie do ryzyka: kontrolę dostępu do dokumentacji, szyfrowanie połączeń i ograniczenie kręgu osób mających dostęp do danych do tych, którym jest to niezbędne.',
        ],
    },
    {
        id: 'zmiany',
        tytul: 'Wersja dokumentu',
        akapity: [
            `Ta wersja polityki obowiązuje od ${DATA_WERSJI}.`,
            'O istotnych zmianach poinformujemy na stronie. Poprzednie wersje udostępniamy na żądanie.',
        ],
    },
];
