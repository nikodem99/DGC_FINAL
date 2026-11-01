// Jedno zrodlo cen dla podstrony /cennik i sekcji na stronie glownej.
// Stawki pochodza z materialow DGC. Sa wywolawcze ("od") i nie maja daty
// aktualizacji w zrodle — przed publikacja wymagaja potwierdzenia u klienta.
//
// Zakres pakietow poprawiony 01.11.2026 na podstawie uwag biura naniesionych
// na wydruk cennika (mail Kamila). Z kazdego pakietu wypadly konsultacje,
// w ich miejsce weszly czynnosci, ktore biuro faktycznie wykonuje.
//
// UWAGA do potwierdzenia u klienta: ryczalt zszedl z 20 do 5 dokumentow
// miesiecznie, a KPiR zostal przy 20 — przy tej samej cenie wywolawczej
// "od 200 zl". Tak bylo napisane na wydruku, ale wychodzi na to, ze
// prostsza ksiegowosc jest drozsza w przeliczeniu na dokument.
const pakiety = [
    {
        title: 'Ryczałt od przychodów ewidencjonowanych',
        krotki: 'Ryczałt',
        price: 'od 200 zł',
        naStronieGlownej: true,
        dlaKogo: 'Dla jednoosobowych działalności rozliczających się ryczałtem.',
        features: [
            'Ewidencja przychodów do 5 dokumentów miesięcznie',
            'Obliczenie zaliczki na podatek dochodowy PIT',
            'Raport elektroniczny plików JPK',
        ],
    },
    {
        title: 'Książka przychodów i rozchodów',
        krotki: 'KPiR',
        price: 'od 200 zł',
        naStronieGlownej: true,
        dlaKogo: 'Dla działalności i spółek cywilnych na zasadach ogólnych.',
        features: [
            'Prowadzenie KPiR do 20 dokumentów miesięcznie',
            'Obliczenie zaliczki na podatek dochodowy PIT',
            'Ewidencja środków trwałych oraz wartości niematerialnych i prawnych',
        ],
    },
    {
        title: 'Księgi handlowe',
        krotki: 'Pełna księgowość',
        price: 'od 550 zł',
        featured: true,
        naStronieGlownej: true,
        dlaKogo: 'Dla spółek z o.o., komandytowych i akcyjnych.',
        features: [
            'Prowadzenie ksiąg handlowych do 20 dokumentów miesięcznie',
            'Obliczenie zaliczki na podatek dochodowy CIT',
            'Generowanie i wysyłka JPK_CIT',
        ],
    },
    {
        title: 'Wirtualne biuro',
        krotki: 'Wirtualne biuro',
        price: '150 zł',
        dlaKogo: 'Adres siedziby firmy wraz z obsługą korespondencji.',
        features: [
            'Odbieranie korespondencji firmowej',
            'Powiadomienie o odebranej przesyłce',
            'Bezpieczne przechowywanie korespondencji',
        ],
    },
];

export default pakiety;
