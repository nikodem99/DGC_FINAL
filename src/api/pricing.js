// Jedno zrodlo cen dla podstrony /cennik i sekcji na stronie glownej.
// Stawki pochodza z materialow DGC. Sa wywolawcze ("od") i nie maja daty
// aktualizacji w zrodle — przed publikacja wymagaja potwierdzenia u klienta.
const pakiety = [
    {
        title: 'Ryczałt od przychodów ewidencjonowanych',
        krotki: 'Ryczałt',
        price: 'od 200 zł',
        naStronieGlownej: true,
        dlaKogo: 'Dla jednoosobowych działalności rozliczających się ryczałtem.',
        features: [
            'Ewidencja przychodów do 20 dokumentów miesięcznie',
            'Obliczenie zaliczki na podatek dochodowy PIT',
            'Do dwóch godzin konsultacji w miesiącu',
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
            'Do dwóch godzin konsultacji w miesiącu',
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
            'Do dwóch godzin konsultacji w miesiącu',
        ],
    },
    {
        title: 'Wirtualne biuro',
        krotki: 'Wirtualne biuro',
        price: '100 zł',
        dlaKogo: 'Adres do rejestracji firmy wraz z obsługą korespondencji.',
        features: [
            'Odbieranie korespondencji firmowej',
            'Powiadomienie o odebranej przesyłce',
            'Bezpieczne przechowywanie korespondencji',
        ],
    },
];

export default pakiety;
