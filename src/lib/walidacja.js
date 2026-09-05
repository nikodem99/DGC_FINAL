// Wspolne ustawienia SimpleReactValidator dla wszystkich formularzy strony.
//
// Wczesniej te dwie stale siedzialy w ContactForm. Gdy formularz na
// podstronach oferty dostal wlasna kopie, powstalo ryzyko, ze ktos poprawi
// regule telefonu w jednym miejscu, a w drugim zostanie stara. Formularze
// roznia sie markupem (karta oferty ma etykiety i bledy pozycjonowane
// absolutnie, /contact ma same placeholdery), ale zasady walidacji maja byc
// identyczne — i stad ten plik.

// SimpleReactValidator mowi po angielsku — podmieniamy komunikaty tych regul,
// ktorych faktycznie uzywamy.
export const KOMUNIKATY = {
    required: 'To pole jest wymagane',
    email: 'Niepoprawny adres e-mail',
    alpha_space: 'Wpisz imię i nazwisko',
};

// Wbudowana regula `phone` odrzuca zwykly polski numer w rodzaju 601234567.
// Wlasna regula liczy same cyfry, tak samo jak pasek pod nagłówkiem.
// Pustego pola nie przepuszcza — o wymagalnosc dba osobna regula `required`.
export const WALIDATORY = {
    telefon_pl: {
        message: 'Niepoprawny numer telefonu',
        rule: (wartosc) => String(wartosc).replace(/[^\d]/g, '').length >= 9,
    },
};
