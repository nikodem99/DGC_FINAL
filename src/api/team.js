


import zespolDanuta from '../images/zespol/danuta-grabinska-chlopas.jpg'
import zespolMiroslaw from '../images/zespol/miroslaw-chlopas.jpg'
import zespolKatarzyna from '../images/zespol/katarzyna-kulpa.jpg'
import zespolEmilia from '../images/zespol/emilia-trzmielewska.jpg'
import zespolJustyna from '../images/zespol/justyna-olszewska.jpg'
import zespolKarolina from '../images/zespol/karolina-bielecka.jpg'




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
    { id: 'z1', title: 'Danuta Grabińska-Chłopaś', subtitle: 'Prezes zarządu', timg: zespolDanuta },
    { id: 'z2', title: 'Justyna Olszewska', subtitle: 'Główna księgowa', timg: zespolJustyna },
    { id: 'z3', title: 'Emilia Trzmielewska', subtitle: 'Główna księgowa', timg: zespolEmilia },
    { id: 'z4', title: 'Karolina Bielecka', subtitle: 'Księgowa', timg: zespolKarolina },
    { id: 'z5', title: 'Mirosław Chłopaś', subtitle: 'Księgowy', timg: zespolMiroslaw },
    { id: 'z6', title: 'Katarzyna Kulpa', subtitle: 'Asystentka prezesa', timg: zespolKatarzyna },
];
