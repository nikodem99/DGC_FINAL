// Dane strukturalne schema.org dla DGC. Czyta je Google (wizytowka w
// wynikach) oraz narzedzia AI, ktore z takiego bloku wyciagaja fakty
// o firmie wprost, bez zgadywania z tresci strony.
//
// ZASADA: kazde pole ma pokrycie w rejestrze albo w tresci serwisu.
//
// CELOWO NIE MA TU aggregateRating. Na stronie sa prawdziwe opinie
// z wizytowki Google, ale BEZ ocen liczbowych — gwiazdki przy cytatach
// to dekoracja szablonu, nie dane. Wystawienie sredniej oceny bez
// pokrycia to podanie Google nieprawdziwych danych, za co leca kary
// reczne. Jesli klient poda liczbe opinii i srednia z wizytowki,
// mozna to dopisac.
//
// CELOWO NIE MA TU geo ani priceRange: wspolrzednych nie ma w kodzie
// (mapa osadzona jest przez zapytanie adresowe), a cennik ma stawki
// wywolawcze roznego rodzaju i komentarz w pricing.js mowi, ze
// wymagaja potwierdzenia u klienta.

import { KONTAKT } from '../api/kontakt.js';

export const DANE_FIRMY = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': 'https://biurodgc.pl/#organizacja',
    name: 'DGC Biuro Rachunkowe Sp. z o.o.',
    alternateName: 'DGC Biuro Rachunkowe',
    url: 'https://biurodgc.pl/',
    description:
        'Biuro rachunkowe z Łodzi. Od 2011 roku prowadzi księgowość, rozliczenia '
        + 'podatkowe oraz sprawy kadrowo-płacowe firm z całej Polski.',
    telephone: '+48731580184',
    email: KONTAKT.email,
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Brukowa 8',
        postalCode: '91-341',
        addressLocality: 'Łódź',
        addressRegion: 'łódzkie',
        addressCountry: 'PL',
    },
    // Numery z Krajowego Rejestru Sadowego, odpis aktualny dla KRS 0000384095.
    vatID: 'PL9471976277',
    taxID: '9471976277',
    identifier: [
        { '@type': 'PropertyValue', propertyID: 'KRS', value: '0000384095' },
        { '@type': 'PropertyValue', propertyID: 'REGON', value: '101073765' },
    ],
    foundingDate: '2011',
    // Godziny z src/api/kontakt.js. To dostepnosc telefoniczna, ktora dla
    // schema.org jest wlasciwym znaczeniem openingHours przy uslugach zdalnych.
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '16:00',
        },
    ],
    areaServed: { '@type': 'Country', name: 'Polska' },
    availableLanguage: { '@type': 'Language', name: 'Polish' },
    sameAs: [
        'https://www.facebook.com/dgcbiurorachunkowe',
        'https://www.instagram.com/dgc_biuro_rachunkowe',
        'https://www.linkedin.com/company/dgc-biuro-rachunkowe',
    ],
    knowsAbout: [
        'księgowość',
        'pełna księgowość',
        'podatkowa księga przychodów i rozchodów',
        'rozliczenia VAT, PIT i CIT',
        'kadry i płace',
        'rozliczenia ZUS',
    ],
};
