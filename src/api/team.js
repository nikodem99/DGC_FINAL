// Zdjecia zespolu NIE przechodza przez Vite.
//
// Leza w public/dane/obrazki/zespol/ pod stalymi nazwami i sa tu podane
// jako zwykle adresy. Dzieki temu panel redakcyjny moze podmienic zdjecie,
// nadpisujac plik na serwerze — bez przebudowania strony i bez zmiany
// czegokolwiek w gotowym HTML-u. Gdyby szly przez import, kazdy plik
// dostawalby nazwe z odciskiem, wpieczona w 473 strony.
//
// Koszt: te obrazki nie maja cache-bustingu, wiec /dane/obrazki/ ma
// krotszy cache w .htaccess (patrz scripts/seo.mjs).

// Lista wspolpracujacych specjalistow (radca prawny, doradcy podatkowi,
// biegla rewident) zostala USUNIETA 23.09.2026.
//
// Powod: byla martwa — renderowaly ja tylko /team, /home-2 i /home-3, czyli
// trasy zwracajace 404 na serwerze. Mimo to jechala w publicznej paczce
// JavaScriptu razem z numerami wpisow na listy zawodowe tych osob. Numer
// wpisu to dana zawodowa konkretnego czlowieka i nie ma powodu, zeby lezala
// w kodzie strony, ktora jej nie pokazuje.
//
// Zespol biura widoczny na stronie glownej i /o-nas siedzi w ZESPOL_BIURA
// ponizej i zostaje bez zmian.





// --- Zespol biura -----------------------------------------------------
// Ludzie pracujacy w DGC, do sekcji na /about i /home. Kolejnosc ustalona
// przez klienta: prezes, potem reszta. Swiadomie bez stanowisk — klient
// prosil wylacznie o imie i nazwisko, a dopisanie roli byloby twierdzeniem
// o zakresie obowiazkow, ktorego nie mamy z czego potwierdzic.
//
// Zdjecia sa przyciete do 728x1094, czyli dokladnie 2x placeholder 364x547
// z szablonu. Ta sama proporcja co kafelka, wiec nic sie nie przesuwa.
// Celowo te same nazwy pol co w liscie nadzoru powyzej (title, timg), zeby
// TeamSection nie musiala rozrozniac, ktora liste dostala. Brak pola slug
// wylacza linkowanie do podstrony osoby, a brak subtitle — wiersz z rola.
// Stanowiska podane przez klienta 14.09.2026. Swiadomie bez tytulow
// wymagajacych wpisu na liste zawodowa: "ksiegowa" i "glowna ksiegowa" to
// nazwy stanowisk, a nie zawodu regulowanego (uslugowe prowadzenie ksiag
// zostalo w Polsce zderegulowane w 2014 r.), wiec nie sa twierdzeniem
// o uprawnieniach. "Prezes zarzadu" zgadza sie z wpisem w KRS 0000384095.
// Kolejnosc wg hierarchii stanowisk, ustalona przez klienta 14.09.2026.
// Zastapila wczesniejsza kolejnosc towarzyska (maz prezes na drugim
// miejscu) — odkad stanowiska sa widoczne, karty czyta sie z gory w dol.
export const ZESPOL_BIURA = [
    { id: 'z1', title: 'Danuta Grabińska-Chłopaś', subtitle: 'Prezes zarządu', timg: '/dane/obrazki/zespol/danuta-grabinska-chlopas.jpg' },
    { id: 'z2', title: 'Justyna Olszewska', subtitle: 'Główna księgowa', timg: '/dane/obrazki/zespol/justyna-olszewska.jpg' },
    { id: 'z3', title: 'Emilia Trzmielewska', subtitle: 'Główna księgowa', timg: '/dane/obrazki/zespol/emilia-trzmielewska.jpg' },
    { id: 'z4', title: 'Karolina Bielecka', subtitle: 'Księgowa', timg: '/dane/obrazki/zespol/karolina-bielecka.jpg' },
    { id: 'z5', title: 'Mirosław Chłopaś', subtitle: 'Księgowy', timg: '/dane/obrazki/zespol/miroslaw-chlopas.jpg' },
    { id: 'z6', title: 'Katarzyna Kulpa', subtitle: 'Asystentka prezesa', timg: '/dane/obrazki/zespol/katarzyna-kulpa.jpg' },
];
