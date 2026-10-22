
// Pole `simage` zostalo usuniete 22.10.2026: szesc obrazkow kart oferty,
// ktorych NIC nie renderowalo. Przetrwaly wczesniejsze czyszczenie szablonu
// tylko dlatego, ze ten plik je importowal — wiec wygladaly na uzywane.
// Sprawdzone po gotowej paczce: zero wystapien na wszystkich 473 stronach.
import serviceContent from './serviceContent'



// `temat` podpowiada wybor w select-cie formularza na podstronie oferty
// (wartosci musza byc 1:1 z TEMATY w src/lib/tematy.js). Uzupelnione tylko
// tam, gdzie przypisanie jest jednoznaczne. Strony ogolne — "Biuro rachunkowe
// Łódź", "Biuro księgowe Łódź" — i "Prowadzenie ksiąg rachunkowych" zostaja
// bez podpowiedzi: trafiaja na nie zarowno jednoosobowe dzialalnosci, jak
// i spolki, wiec zgadywanie tematu popsuloby opis zgloszenia w skrzynce.
const Services = [
    {
        id: 1,
        icon: 'ti-briefcase',
        title: 'Biuro rachunkowe Łódź',
        description: 'Kompleksowa obsługa rachunkowa i podatkowa dla firm z Łodzi i całej Polski.',
        slug: 'biuro-rachunkowe-lodz',
        content: serviceContent['biuro-rachunkowe-lodz'],
    },
    {
        id: 2,
        icon: 'ti-book',
        title: 'Biuro księgowe Łódź',
        description: 'Pełna księgowość, KPiR, rozliczenia podatkowe i doradztwo dla przedsiębiorców.',
        slug: 'biuro-ksiegowe-lodz',
        content: serviceContent['biuro-ksiegowe-lodz'],
    },
    {
        id: 3,
        icon: 'ti-receipt',
        title: 'Rozliczenia podatku VAT, PIT, CIT, IFT, PCC',
        description: 'Terminowe i zgodne z przepisami rozliczenia najważniejszych zobowiązań podatkowych.',
        slug: 'rozliczenia-podatku',
        temat: 'Podatki (VAT, PIT, CIT)',
        content: serviceContent['rozliczenia-podatku'],
    },
    {
        id: 4,
        icon: 'ti-wallet',
        title: 'Rozliczenia kadrowo-płacowe pracowników',
        description: 'Rzetelna obsługa wynagrodzeń, dokumentacji pracowniczej i obowiązków urzędowych.',
        slug: 'rozliczenia-kadrowo-placowe-pracownikow',
        temat: 'Kadry i płace (ZUS, PFRON)',
        content: serviceContent['rozliczenia-kadrowo-placowe-pracownikow'],
    },
    {
        id: 5,
        icon: 'ti-id-badge',
        title: 'Usługi kadrowo-płacowe',
        description: 'Outsourcing kadr i płac dopasowany do wielkości, branży i sposobu działania firmy.',
        slug: 'uslugi-kadrowo-placowe',
        temat: 'Kadry i płace (ZUS, PFRON)',
        content: serviceContent['uslugi-kadrowo-placowe'],
    },
    {
        id: 6,
        icon: 'ti-agenda',
        title: 'Prowadzenie ksiąg rachunkowych',
        description: 'Księgi rachunkowe, KPiR, ryczałt oraz kompletna ewidencja dokumentacji firmy.',
        slug: 'prowadzenie-ksiag-rachunkowych',
        content: serviceContent['prowadzenie-ksiag-rachunkowych'],
    },





];
export default Services;
