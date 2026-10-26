// Dane kontaktowe DGC w jednym miejscu. Numer i godziny pojawiaja sie
// w kilku sekcjach — trzymanie ich osobno konczy sie tym, ze przy zmianie
// ktoras zostaje ze starym.
// Numer bez prefiksu +48: przy 100px foncie w pasie kontaktowym dluzszy
// zapis lamal sie na dwie linie. Prefiks zostaje w samym odnosniku tel:.
//
// UWAGA: ten blok jest odtwarzany przez scripts/pobierz-z-serwera.mjs przy
// kazdym pobraniu zmian z panelu, wiec komentarze MUSZA stac nad nim,
// nie w srodku — w srodku zostana skasowane.
export const KONTAKT = {
    telefon: '731 580 184',
    telefonHref: 'tel:+48731580184',
    godziny: 'pon.–pt. 8:00–16:00',
    email: 'kontakt@biurodgc.pl',
};

export default KONTAKT;
