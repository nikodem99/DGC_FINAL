import React from 'react';

// Liczba w sekcji "w liczbach" na / i /o-nas/.
//
// Byl tu react-countup z enableScrollSpy, czyli animacja doliczania od zera,
// uruchamiana dopiero po przewinieciu strony do tego miejsca. Mialo to trzy
// skutki, wszystkie zle:
//
//   - w prerenderowanym HTML-u zostawalo <h2><span></span></h2>, bo przy
//     budowaniu nikt nie przewija strony. Liczb nie widzial ani robot
//     wyszukiwarki, ani czytnik ekranu, ani ktos bez JavaScriptu;
//   - w przegladarce, zanim licznik ruszy, w naglowku stoi "0" — czyli
//     "0 lat na rynku" i "0%". Jesli sekcja jest widoczna od razu albo ktos
//     wejdzie z kotwicy, zostaje przy zerze;
//   - sama liczba to tresc, a nie ozdoba. Nie powinna zalezec od tego, czy
//     uzytkownik przewinal strone.
//
// Dlatego liczba stoi po prostu wpisana. Gdyby animacja mial wrocic,
// wystarczy tu przywrocic <CountUp end={ile} enableScrollSpy /> — reszta
// kodu sie nie zmienia.
const Licznik = ({ ile }) => <>{ile}</>;

export default Licznik;
