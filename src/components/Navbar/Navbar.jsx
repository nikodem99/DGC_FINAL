import React from "react";
import Header from '../header/Header';

// Opakowanie naglowka.
//
// Stal tu nasluch przewijania: useState trzymal pozycje strony, useEffect
// podpinal handler do okna, a klasa zmieniala sie na "fixed-navbar active"
// powyzej 80px. Wszystko to bylo martwe.
//
// Dlaczego martwe: ciag "fixed-navbar" wystepuje w calym repozytorium
// DOKLADNIE RAZ — w linii, ktora go ustawiala. Zadna regula w src/sass go
// nie lapie, nic go nie odpytuje w JavaScripcie. Klasa "active" nie wlaczala
// wiec niczego, a naglowek nigdy sie nie przyklejal (sprawdzone pomiarem
// w przegladarce: po przewinieciu element ma position: static i zjezdza
// z ekranu razem z trescia).
//
// Kosztowalo to realnie: setScroll zapisywalo pozycje przy KAZDYM zdarzeniu
// przewijania, a kazdy zapis przerysowywal caly poddrzewo Navbara — czyli
// komplet naglowka z rozwijanym menu oferty — na wszystkich 488 stronach.
//
// Sama klasa zostaje w znacznikach na stale. Nie usuwamy jej, bo z tego
// HTML-a scripts/szablon.mjs wycina szablony dla panelu redakcyjnego:
// zmiana struktury wymusilaby przeliczenie wzorcow, a nic by nie dala.
// Jesli ktos bedzie kiedys robil przyklejany naglowek, to jest gotowy
// uchwyt — ale dzis jest to sama nazwa, nie mechanizm.
export default function Navbar(props) {
  return (
    <div className="fixed-navbar">
      <Header hclass={props.hclass} Logo={props.Logo} topbarClass={props.topbarClass} />
    </div>
  );
}
