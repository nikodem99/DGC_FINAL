// Hak, przez ktory komponenty czytaja liste artykulow.
//
// Zamiast importowac blogs.js wprost, komponenty biora liste stad. Dzieki
// temu, gdy panel doda artykul i lista doczyta sie z serwera, widok sam
// sie przerysuje. Szczegoly w api/indeks.js.

import { useSyncExternalStore, useEffect } from 'react';
import { wpisy, odswiez, subskrybuj, migawka, migawkaSerwera } from './indeks.js';

export function uzyjWpisow() {
    useSyncExternalStore(subskrybuj, migawka, migawkaSerwera);

    // Doczytujemy dopiero po wyswietleniu, zeby nic nie opoznialo pierwszego
    // rysowania. Powtorne wywolania trafiaja w to samo zapytanie.
    useEffect(() => { odswiez(); }, []);

    return wpisy();
}

export default uzyjWpisow;
