import timg1 from '../images/team/1.png'
import timg2 from '../images/team/2.png'
import timg3 from '../images/team/3.png'
import timg4 from '../images/team/4.png'
import timg5 from '../images/team/5.png'
import timg6 from '../images/team/6.png'



import zespolDanuta from '../images/zespol/danuta-grabinska-chlopas.jpg'
import zespolMiroslaw from '../images/zespol/miroslaw-chlopas.jpg'
import zespolKatarzyna from '../images/zespol/katarzyna-kulpa.jpg'
import zespolEmilia from '../images/zespol/emilia-trzmielewska.jpg'
import zespolJustyna from '../images/zespol/justyna-olszewska.jpg'
import zespolKarolina from '../images/zespol/karolina-bielecka.jpg'

import Stime1 from '../images/team-single/1.jpg'
import Stime2 from '../images/team-single/2.jpg'
import Stime3 from '../images/team-single/3.jpg'
import Stime4 from '../images/team-single/4.jpg'
import Stime5 from '../images/team-single/5.jpg'
import Stime6 from '../images/team-single/6.jpg'



const Teams = [
    {
        id: '1',
        title: 'Igor Pasternak',
        subtitle: 'Radca prawny · nr wpisu ŁD-M-1501, OIRP w Łodzi',
        slug: 'Igor-Pasternak',
        timg: timg1,
        Sime: Stime1,
    },
    {
        id: '2',
        title: 'Sylwia Izabela Jaroszek',
        subtitle: 'Doradca podatkowy · nr wpisu 14407',
        slug: 'Sylwia-Jaroszek',
        timg: timg2,
        Sime: Stime2,
    },
    {
        id: '3',
        title: 'Maciej Artur Wroński',
        subtitle: 'Doradca podatkowy · nr wpisu 14500',
        slug: 'Maciej-Wronski',
        timg: timg3,
        Sime: Stime3,
    },
    {
        id: '4',
        title: 'Aneta Weryńska',
        subtitle: 'Biegła rewident · nr 14010 w rejestrze biegłych rewidentów',
        slug: 'Aneta-Werynska',
        timg: timg4,
        Sime: Stime4,
    },
]

export default Teams;




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
