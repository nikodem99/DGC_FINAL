// Tresc polityki prywatnosci.
//
// ZASADA: nic tu nie jest wymyslone. Kazda liczba i nazwa pochodzi albo
// z rejestrow, albo z kodu tej strony, albo z materialow DGC.
//
// 15.09.2026 klient zdecydowal, ze dokument idzie na produkcje przed
// zebraniem danych od biura. Zamiast kasowac te fragmenty (co zrobiloby
// z polityki dokument niepelny wzgledem art. 13 RODO), opisano je
// kryterium zamiast konkretna wartoscia — art. 13 ust. 2 lit. a RODO
// wprost na to pozwala przy okresach przechowywania, a art. 13 ust. 1
// lit. e pozwala podac kategorie odbiorcow zamiast nazw.
//
// DO POTWIERDZENIA PRZEZ DGC, gdy beda dane:
//   - czy powolano Inspektora Ochrony Danych (akapit usuniety, bo IOD
//     trzeba wskazac tylko wtedy, gdy istnieje),
//   - nazwy dostawcow hostingu, poczty i oprogramowania ksiegowego,
//   - faktyczne okresy przechowywania, jesli dluzsze niz ustawowe minima.
//
// Struktura wzorowana na tym, czego wymaga art. 13 i 14 RODO. Nie jest to
// kopia cudzej polityki: cudzy dokument opisuje cudze przetwarzanie,
// a przepisanie go bylo by i naruszeniem praw autorskich, i podaniem
// nieprawdziwych informacji o DGC.

// Tresc o pomiarach wlacza sie sama, gdy w src/lib/analityka.js zostanie
// przestawiony przelacznik WLACZONA. Dzieki temu skrypty i opis w polityce
// nie moga sie rozjechac: albo jest jedno i drugie, albo nic.
import { czyPomiaryDzialaja, AKTYWNE_NARZEDZIA } from '../lib/analityka.js';

export const ADMINISTRATOR = {
    nazwa: 'DGC Biuro Rachunkowe Sp. z o.o.',
    adres: 'ul. Brukowa 8, 91-341 Łódź',
    krs: '0000384095',
    // Z Krajowego Rejestru Sadowego, odpis aktualny dla KRS 0000384095
    // (api-krs.ms.gov.pl). Obie liczby przechodza sume kontrolna.
    nip: '9471976277',
    regon: '101073765',
    telefon: '731 580 184',
    email: 'kontakt@biurodgc.pl',
    // Do czasu wskazania osobnej skrzynki do spraw RODO uzywamy adresu
    // ogolnego — jest publiczny i obslugiwany, wiec droga kontaktu dziala.
    emailRodo: 'kontakt@biurodgc.pl',
};

// Data tej wersji dokumentu, czyli dnia publikacji. Przy kazdej zmianie
// tresci trzeba ja podniesc.
export const DATA_WERSJI = '18 września 2026';

export const SEKCJE = [
    {
        id: 'w-skrocie',
        tytul: 'W skrócie',
        akapity: [
            czyPomiaryDzialaja()
                ? 'Za Twoją zgodą korzystamy z narzędzi mierzących ruch na stronie i skuteczność reklam. Bez zgody nie uruchamiają się wcale. Czcionki i grafiki trzymamy na własnym serwerze.'
                : 'Ta strona nie zbiera statystyk odwiedzin, nie wyświetla reklam i nie śledzi zachowania odwiedzających. Czcionki, z których korzysta, są na naszym serwerze, więc samo jej otwarcie nie wysyła żadnych danych do firm trzecich.',
            'Dane osobowe zbieramy tylko wtedy, gdy sam nam je podasz: przez formularz kontaktowy, pasek wyceny albo zapis na newsletter. Służą do udzielenia odpowiedzi, przygotowania oferty lub wysłania newslettera.',
            'Na stronie kontaktu osadzona jest mapa Google. Wczytuje się razem ze stroną, więc Google poznaje wtedy Twój adres IP i dane przeglądarki.',
            'Na podstronie „O nas” jest nagranie z YouTube. W odróżnieniu od mapy nie wczytuje się samo: dopóki nie klikniesz odtwarzania, nie wysyłamy do YouTube żadnych danych, a widoczna miniatura leży na naszym serwerze.',
            `W sprawach dotyczących danych osobowych napisz na ${ADMINISTRATOR.emailRodo}.`,
        ],
    },
    {
        id: 'administrator',
        tytul: 'Kto odpowiada za Twoje dane',
        akapity: [
            `Administratorem danych jest ${ADMINISTRATOR.nazwa} z siedzibą przy ${ADMINISTRATOR.adres}, wpisana do Krajowego Rejestru Sądowego pod numerem ${ADMINISTRATOR.krs}, NIP ${ADMINISTRATOR.nip}, REGON ${ADMINISTRATOR.regon}.`,
            // Dopoki emailRodo i email to ten sam adres, jedno zdanie zamiast
            // dwoch — inaczej ta sama skrzynka wystepuje dwa razy pod rzad.
            ADMINISTRATOR.emailRodo === ADMINISTRATOR.email
                ? `Kontakt, także w sprawach danych osobowych: ${ADMINISTRATOR.email}, tel. ${ADMINISTRATOR.telefon}.`
                : `Kontakt w sprawach danych osobowych: ${ADMINISTRATOR.emailRodo}. Kontakt ogólny: ${ADMINISTRATOR.email}, tel. ${ADMINISTRATOR.telefon}.`,
        ],
    },
    {
        id: 'dwie-role',
        tytul: 'Dwie role biura rachunkowego',
        akapity: [
            'Ta polityka opisuje dane, których jesteśmy administratorem: zgłoszenia z formularzy, zapisy na newsletter oraz dane osób kontaktowych naszych klientów i kontrahentów.',
            'Osobną sprawą są dane, które klienci powierzają nam do obsługi księgowej i kadrowej, czyli dane ich pracowników, zleceniobiorców i kontrahentów. Tam administratorem jest klient, a my działamy na jego polecenie na podstawie umowy powierzenia. Jeśli jesteś pracownikiem firmy obsługiwanej przez nas, żądania dotyczące swoich danych kieruj do swojego pracodawcy, bo to on decyduje o celach i sposobach ich przetwarzania.',
        ],
    },
    {
        id: 'cele',
        tytul: 'Po co przetwarzamy dane i na jakiej podstawie',
        lista: [
            'Odpowiedź na zapytanie z formularza kontaktowego lub paska wyceny: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz lit. f (nasz uzasadniony interes w prowadzeniu korespondencji).',
            'Wysyłka newslettera: art. 6 ust. 1 lit. a RODO (Twoja zgoda) w związku z przepisami o komunikacji elektronicznej dotyczącymi informacji handlowej.',
            'Prowadzenie ksiąg, rozliczeń i dokumentacji kadrowej klientów: art. 6 ust. 1 lit. b (umowa) i lit. c (obowiązki wynikające z ustawy o rachunkowości i Ordynacji podatkowej).',
            'Obowiązki instytucji obowiązanej w zakresie przeciwdziałania praniu pieniędzy: art. 6 ust. 1 lit. c RODO.',
            'Dochodzenie i obrona roszczeń oraz archiwizacja dokumentów: art. 6 ust. 1 lit. f RODO. Nasz interes polega tu na możliwości wykazania przebiegu współpracy, gdyby stała się przedmiotem sporu.',
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
            'Forminit (UXPLUS LTD, Londyn, Wielka Brytania), dostawca obsługi formularzy. Zgłoszenia przechowywane są na serwerach Amazon Web Services w Irlandii.',
            // Dostawcy wskazani przez DGC 17.09.2026. Nazwy podmiotow i adresy
            // z Krajowego Rejestru Sadowego (api-krs.ms.gov.pl), nie z materialow
            // marketingowych: cyber_Folks KRS 0000685595, Comarch KRS 0000057567.
            'Hosting strony internetowej oraz poczta elektroniczna: cyber_Folks S.A., ul. Wierzbięcice 1B, 61-569 Poznań.',
            'Oprogramowanie księgowe (Comarch ERP Optima): Comarch S.A., al. Jana Pawła II 39A, 31-864 Kraków.',
            // Chaotic Shapes sp. z o.o. — wykonawca i opiekun serwisu.
            // Dane z KRS 0000597522, odpis aktualny z api-krs.ms.gov.pl.
            'Agencja obsługująca stronę internetową: Chaotic Shapes sp. z o.o., ul. Żołnierzy I Armii Wojska Polskiego 10/B6, 81-383 Gdynia, NIP 8381849971.',
            // Ze skanu Oceny Ryzyka AML (17.09.2026) wynika, ze biuro korzysta
            // tez z zewnetrznego systemu weryfikacji podpisow oraz z platformy
            // GoRODO.pl. Klient nie zna ich nazw, a art. 13 ust. 1 lit. e RODO
            // dopuszcza podanie kategorii odbiorcow zamiast nazw. Do zastapienia
            // nazwami, gdy DGC je ustali.
            'Dostawcy pozostałych narzędzi informatycznych używanych w obsłudze klientów, w tym systemu elektronicznej weryfikacji podpisów oraz platformy do prowadzenia dokumentacji wewnętrznej.',
            'Doradcy prawni i podatkowi, biegli rewidenci oraz podmioty świadczące usługi archiwizacji, w zakresie niezbędnym do wykonania konkretnej usługi.',
            // Warunkowy odbiorca: dane ida do Google DOPIERO po klknieciu
            // odtwarzania. Do tego czasu strona nie laczy sie z YouTube,
            // bo miniatura jest hostowana u nas (src/components/WMediach).
            'Google Ireland Limited jako dostawca YouTube, ale wyłącznie wtedy, gdy sam uruchomisz nagranie osadzone na podstronie „O nas”.',
            ...(czyPomiaryDzialaja()
                ? [
                    // Wyliczenie po polsku: przecinki, a przed ostatnim "oraz".
                    // I bez skrotu "za zgoda na statystyki" — Google Ads dziala
                    // na zgodzie marketingowej, wiec jedno zdanie o obu
                    // kategoriach musi to rozrozniac, inaczej podaje
                    // nieprawdziwa podstawe przetwarzania.
                    (() => {
                        const n = AKTYWNE_NARZEDZIA().filter((x) => x.startsWith('Google'));
                        const wyliczenie = n.length > 1
                            ? `${n.slice(0, -1).join(', ')} oraz ${n[n.length - 1]}`
                            : n[0];
                        return `Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlandia, dostawca narzędzi ${wyliczenie}. Narzędzia analityczne uruchamiamy po zgodzie na statystyki, a reklamowe po zgodzie na marketing.`;
                    })(),
                    'Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irlandia, dostawca piksela mierzącego skuteczność reklam, wyłącznie gdy wyrazisz zgodę na marketing.',
                ].filter((t) => !t.includes('narzędzi ,'))
                : []),
            'Organy publiczne, jeżeli wymagają tego przepisy prawa.',
        ],
    },
    {
        id: 'poza-eog',
        tytul: 'Przekazywanie danych poza Europejski Obszar Gospodarczy',
        akapity: [
            'Zgłoszenia z formularzy przechowywane są na serwerach w Irlandii, czyli na terenie Europejskiego Obszaru Gospodarczego. Administratorem usługi jest jednak spółka brytyjska, a Wielka Brytania leży poza EOG. Podstawą przekazania jest decyzja Komisji Europejskiej stwierdzająca odpowiedni stopień ochrony danych w Wielkiej Brytanii.',
            'Jeżeli włączysz mapę Google albo uruchomisz nagranie z YouTube, Twoje dane trafią do Google. Podstawą przekazania jest decyzja Komisji Europejskiej dotycząca ram ochrony danych w relacjach z USA. Gdyby ta podstawa przestała obowiązywać, poinformujemy o zmianie i wskażemy nową.',
            ...(czyPomiaryDzialaja()
                ? ['Narzędzia analityczne i reklamowe, z których korzystamy za Twoją zgodą, również przekazują dane do Stanów Zjednoczonych. Podstawą jest ta sama decyzja Komisji Europejskiej dotycząca ram ochrony danych.']
                : []),
            'Kopię dokumentów dotyczących zabezpieczeń przy przekazywaniu danych udostępnimy na żądanie skierowane na nasz adres do spraw ochrony danych.',
        ],
    },
    {
        id: 'jak-dlugo',
        tytul: 'Jak długo przechowujemy dane',
        lista: [
            'Korespondencja z formularza: przez czas potrzebny do obsługi sprawy, a następnie do upływu terminu przedawnienia ewentualnych roszczeń.',
            'Adres zapisany na newsletter: do wycofania zgody, a następnie do upływu terminu przedawnienia roszczeń związanych z jej udzieleniem.',
            'Dokumentacja księgowa i podatkowa: przez okres wymagany przepisami prawa podatkowego i o rachunkowości, co do zasady 5 lat licząc od końca roku, w którym upłynął termin płatności podatku.',
            'Dokumentacja z zakresu przeciwdziałania praniu pieniędzy: przez okres wymagany ustawą o przeciwdziałaniu praniu pieniędzy oraz finansowaniu terroryzmu, co do zasady 5 lat od zakończenia współpracy.',
            'Dokumentacja pracownicza obsługiwana na zlecenie klientów: przez okres wymagany przepisami prawa pracy, co do zasady 10 lat.',
        ],
    },
    {
        id: 'prawa',
        tytul: 'Twoje prawa',
        akapity: [
            'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przeniesienia do innego administratora.',
            'Przysługuje Ci również prawo sprzeciwu wobec przetwarzania opartego na naszym uzasadnionym interesie. Jeśli je zgłosisz, przestaniemy przetwarzać Twoje dane w tym celu, chyba że wykażemy istnienie ważnych, prawnie uzasadnionych podstaw nadrzędnych wobec Twoich interesów.',
            'Prawa do usunięcia danych nie zrealizujemy tam, gdzie przepisy nakazują nam je przechowywać, dotyczy to zwłaszcza dokumentacji księgowej, podatkowej i dokumentacji wymaganej przepisami o przeciwdziałaniu praniu pieniędzy.',
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
            'Część danych otrzymujemy od naszych klientów, dotyczy to danych ich pracowników, zleceniobiorców i kontrahentów, przekazywanych nam do obsługi księgowej i kadrowej. Zakres obejmuje dane niezbędne do rozliczeń i prowadzenia dokumentacji.',
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
            'Niezbędne: potrzebne do działania strony. Zapamiętują Twoją decyzję dotyczącą plików cookies oraz to, że okienko z zapisem na newsletter już się wyświetliło. Nie można ich wyłączyć, bo bez nich strona nie zadziała poprawnie.',
            'Statystyki: pozwalają liczyć odwiedziny i sprawdzać, które treści są przydatne. Włączają się tylko za Twoją zgodą.',
            'Marketing: umożliwiają mierzenie skuteczności reklam i dopasowanie ich do Twoich zainteresowań. Włączają się tylko za Twoją zgodą.',
        ],
        akapityPo: [
            'Przy pierwszej wizycie pokazujemy komunikat, w którym możesz przyjąć wszystkie pliki, odrzucić wszystkie nieobowiązkowe albo wybrać poszczególne kategorie. Decyzję zmienisz w każdej chwili odnośnikiem „Ustawienia prywatności” w stopce strony.',
            'Statystyki i marketing nie uruchamiają się, dopóki nie wyrazisz zgody. Odrzucenie jest tak samo proste jak akceptacja i nie ogranicza dostępu do żadnej części strony.',
            'Osobną sprawą jest mapa Google osadzona na stronie kontaktu. Wczytuje się ona razem ze stroną. Google otrzymuje wtedy Twój adres IP oraz informacje o przeglądarce i może odczytać własne pliki cookies, jeżeli znajdują się już w Twoim urządzeniu. Adres biura podajemy również w formie tekstowej na tej samej stronie oraz w stopce.',
            czyPomiaryDzialaja()
                ? `Czcionki, ikony i pliki graficzne serwujemy z własnego serwera. Połączenia z serwerami innych firm powodują: wspomniana mapa, nagranie z YouTube po jego uruchomieniu oraz narzędzia pomiarowe (${AKTYWNE_NARZEDZIA().join(', ')}), te ostatnie wyłącznie po wyrażeniu zgody.`
                : 'Czcionki, ikony i pliki graficzne serwujemy z własnego serwera, więc poza wspomnianą mapą otwarcie strony nie powoduje połączeń z serwerami innych firm.',
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
