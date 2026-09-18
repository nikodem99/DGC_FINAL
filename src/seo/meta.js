// Jedno zrodlo prawdy dla tytulow, opisow i adresow kanonicznych.
//
// Czytaja to DWA miejsca i to jest caly sens tego pliku:
//   1. prerender() w src/main.jsx — wynik trafia do statycznego HTML,
//      czyli to widzi Facebook, LinkedIn i roboty AI, ktore nie
//      wykonuja JavaScriptu,
//   2. DocumentTitle w przegladarce — zeby tytul zmienial sie przy
//      nawigacji wewnatrz aplikacji, bez przeladowania.
//
// UWAGA na adresy kanoniczne: konczymy je ukosnikiem, bo tak wygladaja
// adresy obecnej strony biurodgc.pl, ktore maja juz pozycje w Google
// (sprawdzone 18.09.2026: /oferta/biuro-rachunkowe-lodz/ i pozostale
// zwracaja 200 z ukosnikiem). Kanoniczny bez ukosnika kazalby Google
// przeindeksowac komplet adresow bez zadnego zysku.

export const DOMENA = 'https://biurodgc.pl';

export const MARKA = 'DGC Biuro Rachunkowe';

// Adres kanoniczny: zawsze pelny, zawsze z ukosnikiem koncowym.
export const kanoniczny = (sciezka) => {
    if (!sciezka || sciezka === '/') return `${DOMENA}/`;
    const czysta = sciezka.replace(/\/+$/, '');
    return `${DOMENA}${czysta}/`;
};

// Tytul i opis kazdej podstrony. Opisy powstaly z tresci tych podstron
// i przeszly kontrole redakcyjna: 120-158 znakow, tytul do 60 znakow,
// bez myslnika (klient go nie chce), separator to srodkowa kropka.
const STRONY = {
    '/cennik': {
        tytul: 'Cennik usług księgowych · DGC Biuro Rachunkowe',
        opis: 'Pakiety obsługi: ryczałt, KPiR, księgi handlowe i wirtualne biuro. Każdą współpracę wyceniamy indywidualnie po rozmowie o zakresie dokumentów.',
    },
    '/faq': {
        tytul: 'Najczęstsze pytania · DGC Biuro Rachunkowe',
        opis: 'Odpowiedzi na pytania o ceny, zakres obsługi, pracę online, zmianę biura rachunkowego i odpowiedzialność za rozliczenia. Dziesięć najczęstszych pytań.',
    },
    '/': {
        tytul: 'DGC Biuro Rachunkowe · księgowość, kadry i płace',
        opis: 'Prowadzimy księgowość, kadry i płace dla firm z Łodzi i całej Polski. Obsługa w pełni online, bez dojazdów do biura. Księgi prowadzimy od 2011 roku.',
    },
    '/kontakt': {
        tytul: 'Kontakt · DGC Biuro Rachunkowe',
        opis: 'Biuro rachunkowe DGC, ul. Brukowa 8 w Łodzi. Telefon 731 580 184 czynny od poniedziałku do piątku 8:00 do 16:00. Na maile odpowiadamy w dobę roboczą.',
    },
    '/o-nas': {
        tytul: 'O nas i zespół · DGC Biuro Rachunkowe',
        opis: 'Od 2011 roku prowadzimy księgi firm o różnym profilu. Poznaj zespół certyfikowanych specjalistów, branże, które znamy, i sposób pracy z klientem.',
    },
    '/oferta': {
        tytul: 'Oferta usług księgowych · DGC Biuro Rachunkowe',
        opis: 'Pełna księgowość, KPiR i ryczałt, rozliczenia VAT, PIT i CIT oraz obsługa kadrowo-płacowa. Sprawdź zakres usług dla firm z Łodzi i całej Polski.',
    },
    '/polityka-prywatnosci': {
        tytul: 'Polityka prywatności · DGC Biuro Rachunkowe',
        opis: 'Jakie dane zbieramy przez formularze i newsletter, komu je przekazujemy, jak długo je trzymamy i jakie masz prawa. Informacja o cookies i mapie Google.',
    },
    '/porady': {
        tytul: 'Porady księgowe i podatkowe · DGC Biuro Rachunkowe',
        opis: 'Artykuły o rachunkowości, podatkach VAT, PIT i CIT oraz kadrach. Wyjaśniamy przepisy i częste błędy w rozliczeniach firm. Filtruj po kategorii.',
    },
    '/umow-konsultacje': {
        tytul: 'Umów konsultację · DGC Biuro Rachunkowe',
        opis: 'Płatna konsultacja o formie opodatkowania, rozliczeniach, kadrach lub zmianie w firmie. Telefonicznie, online albo w biurze w Łodzi.',
    },
    '/oferta/biuro-ksiegowe-lodz': {
        tytul: 'Biuro księgowe Łódź · pełna księgowość i KPiR · DGC',
        opis: 'Pełna księgowość i KPiR w Łodzi, deklaracje PIT, CIT i VAT oraz bieżące wsparcie. Zakres obsługi dopasowany do profilu Twojej działalności.',
    },
    '/oferta/biuro-rachunkowe-lodz': {
        tytul: 'Biuro rachunkowe Łódź · obsługa firm · DGC',
        opis: 'Obsługa rachunkowa i podatkowa firm w Łodzi: rozliczenia VAT, PIT, CIT, IFT i PCC, księgi rachunkowe oraz kadry i płace. Zakres dobieramy do firmy.',
    },
    '/oferta/prowadzenie-ksiag-rachunkowych': {
        tytul: 'Prowadzenie ksiąg rachunkowych · KPiR i ryczałt · DGC',
        opis: 'Księgi rachunkowe i handlowe, KPiR, ryczałt, dokumentacja VAT, ewidencja środków trwałych oraz IP Box. Biuro w Łodzi, obsługa także zdalna.',
    },
    '/oferta/rozliczenia-kadrowo-placowe-pracownikow': {
        tytul: 'Rozliczenia kadrowo-płacowe pracowników · DGC',
        opis: 'Naliczanie wynagrodzeń, zgłoszenia do ZUS, akta osobowe, deklaracje PFRON i sprawozdania GUS. Pilnujemy terminów badań lekarskich i szkoleń BHP.',
    },
    '/oferta/rozliczenia-podatku': {
        tytul: 'Rozliczenia VAT, PIT, CIT, IFT i PCC · DGC Łódź',
        opis: 'Rozliczamy VAT, PIT, CIT, IFT i PCC dla firm i spółek, prowadzimy rejestry VAT i deklaracje do urzędu skarbowego. Obsługa zdalna w całej Polsce.',
    },
    '/oferta/uslugi-kadrowo-placowe': {
        tytul: 'Usługi kadrowo-płacowe · outsourcing kadr i płac · DGC',
        opis: 'Outsourcing kadr i płac dla firm z Łodzi i całej Polski, także online. ZUS, wynagrodzenia, umowy, PFRON i GUS oraz indywidualna wycena obsługi.',
    },
    '/porady/cit-estonski-efektywna-stopa': {
        tytul: 'CIT estoński: efektywna stopa podatku · DGC',
        opis: 'Skąd biorą się efektywne stawki około 20 i 25 procent, jak działa odliczenie 90 i 70 procent w PIT wspólnika i kiedy realny podatek jest wyższy.',
    },
    '/porady/dokument-sad': {
        tytul: 'Dokument SAD: kto tworzy i kiedy · DGC',
        opis: 'Kto składa zgłoszenie celne, w którym momencie powstaje dokument SAD i dlaczego jest podstawą ujęcia cła w wartości towaru oraz VAT od importu.',
    },
    '/porady/hodowla-pajakow-podatki': {
        tytul: 'Hodowla pająków na sprzedaż: podatki · DGC',
        opis: 'Dział specjalny produkcji rolnej, działalność rolnicza czy zwykła firma. Kwalifikacja decyduje o PIT-6, zasadach VAT i wymogach dokumentacji CITES.',
    },
    '/porady/ksiegowanie-dotacji': {
        tytul: 'Jak księgować dotacje i subwencje · DGC',
        opis: 'Dotacja na środek trwały trafia do rozliczeń międzyokresowych przychodów, a nie od razu w przychód. Sprawdź zasady ujęcia i ewidencję projektów unijnych.',
    },
    '/porady/oplata-paliwowa-opal': {
        tytul: 'Opłata paliwowa i formularz OPAL · DGC',
        opis: 'Opłatę paliwową rozliczają producenci, importerzy i nabywcy wewnątrzwspólnotowi paliw. Formularz OPAL składa się w PUESC, nie w gminie.',
    },
    '/porady/oplata-produktowa': {
        tytul: 'Opłata produktowa: termin i BDO · DGC',
        opis: 'Kiedy powstaje opłata produktowa, dlaczego rozlicza ją marszałek województwa i co zrobić do 15 marca: wpłatę oraz sprawozdanie w systemie BDO.',
    },
    '/porady/oplaty-srodowiskowe-wykaz-progi': {
        tytul: 'Opłaty środowiskowe: wykaz i progi · DGC',
        opis: 'Progi 100 i 800 zł decydują, czy trzeba złożyć wykaz do marszałka i zapłacić. Raport do KOBiZE idzie do końca lutego, wykaz do 31 marca.',
    },
    '/porady/podatek-lesny': {
        tytul: 'Podatek leśny: IL-1, DL-1 i stawki · DGC',
        opis: 'Kto płaci podatek leśny, czym różni się IL-1 od DL-1, jak liczy się stawkę od ceny drewna i w ilu ratach wpłaca się podatek w ciągu roku.',
    },
    '/porady/podatek-od-nieruchomosci': {
        tytul: 'Podatek od nieruchomości: IN-1 i DN-1 · DGC',
        opis: 'Osoba fizyczna składa IN-1 i czeka na decyzję gminy, spółka składa DN-1 i liczy podatek sama. Sprawdź terminy i zasadę dla nowych budynków.',
    },
    '/porady/rezerwy-odpisy': {
        tytul: 'Rezerwy i odpisy aktualizujące w księgach · DGC',
        opis: 'Czym różni się rezerwa od odpisu aktualizującego, kiedy tworzy się je na należności, zapasy i urlopy oraz jakie pominięcia zawyżają wynik finansowy.',
    },
    '/porady/rozliczenia-miedzyokresowe-kosztow': {
        tytul: 'Rozliczenia międzyokresowe kosztów RMK · DGC',
        opis: 'Czynne i bierne RMK: kiedy rozliczyć wydatek w czasie, jak ująć polisę zapłaconą z góry i w jakich przypadkach ustawa dopuszcza uproszczenie.',
    },
    '/porady/skladki-preferencyjne-2026': {
        tytul: 'Składki preferencyjne ZUS 2026 · DGC',
        opis: 'Obniżona podstawa 1 441,80 zł przez 24 miesiące, warunki skorzystania i liczenie okresu po uldze na start. Preferencja obejmuje tylko składki społeczne.',
    },
    '/porady/system-sent': {
        tytul: 'System SENT: kogo obejmuje w 2026 · DGC',
        opis: 'Od 17 marca 2026 SENT obejmuje także odzież i obuwie. Sprawdź obowiązki wysyłającego, przewoźnika i odbierającego oraz rejestrację w PUESC.',
    },
    '/porady/wynajem-mieszkania-firmie-najemca': {
        tytul: 'Wynajem mieszkania na firmę: najemca · DGC',
        opis: 'Kiedy czynsz za mieszkanie jest kosztem firmy, jak wygląda VAT przy lokalu dla pracownika i przy biurze oraz co z fakturą, mediami i kaucją.',
    },
    '/porady/zamkniecie-roku-bledy': {
        tytul: 'Błędy przy zamknięciu roku obrotowego · DGC',
        opis: 'Pięć błędów przy zamknięciu ksiąg: niepełna inwentaryzacja, brak rezerw, brak odpisów na należności, złe RMK i pominięte zdarzenia po dniu bilansowym.',
    },
    // Strona bledu MUSI tu byc, mimo ze nie ma jej w mapie strony.
    // Bez tego wpisu nie trafia do prerenderu, a wszystkie reguly 404
    // w public/_redirects celuja w /404/index.html — czyli w plik, ktory
    // by nie powstal, i uzytkownik dostawalby generyczna strone Netlify
    // zamiast naszej. Z mapy strony wyklucza ja ponizsza stala NOINDEX.
    '/404': {
        tytul: 'Nie znaleziono strony · DGC Biuro Rachunkowe',
        opis: 'Pod tym adresem nic nie ma. Wróć na stronę główną albo skorzystaj z menu, żeby znaleźć ofertę, cennik, porady księgowe lub kontakt.',
    },
};

// Trasy, ktore maja trafic do prerenderu i do mapy strony.
export const WSZYSTKIE_TRASY = Object.keys(STRONY);

// Adresy, ktore istnieja, ale nie maja byc indeksowane.
export const NOINDEX = ['/404'];

const DOMYSLNY = {
    tytul: `${MARKA} · księgowość, kadry i płace dla firm`,
    opis: 'Biuro rachunkowe z Łodzi. Od 2011 roku prowadzimy księgowość, rozliczenia podatkowe i sprawy kadrowo-płacowe firm z całej Polski.',
};

// Zwraca komplet danych SEO dla sciezki. Czysta funkcja, bez zaleznosci
// od przegladarki, zeby dalo sie ja wolac takze w Node przy budowaniu.
export const metaDla = (sciezka) => {
    const czysta = (sciezka || '/').replace(/\/+$/, '') || '/';
    const wpis = STRONY[czysta] || DOMYSLNY;
    return {
        tytul: wpis.tytul,
        opis: wpis.opis,
        kanoniczny: kanoniczny(czysta),
        noindex: NOINDEX.includes(czysta),
        typ: czysta.startsWith('/porady/') ? 'article' : 'website',
    };
};
