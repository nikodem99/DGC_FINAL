
/* Single image */
import simg1 from '../images/service-single/1.jpg'
import simg2 from '../images/service-single/2.jpg'
import simg3 from '../images/service-single/3.jpg'
import simg4 from '../images/service-single/4.jpg'
import simg5 from '../images/service-single/5.jpg'
import simg6 from '../images/service-single/6.jpg'
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
        simage: simg1,
        title: 'Biuro rachunkowe Łódź',
        description: 'Kompleksowa obsługa rachunkowa i podatkowa dla firm z Łodzi i całej Polski.',
        slug: 'biuro-rachunkowe-lodz',
        content: serviceContent['biuro-rachunkowe-lodz'],
    },
    {
        id: 2,
        icon: 'ti-book',
        simage: simg2,
        title: 'Biuro księgowe Łódź',
        description: 'Pełna księgowość, KPiR, rozliczenia podatkowe i doradztwo dla przedsiębiorców.',
        slug: 'biuro-ksiegowe-lodz',
        content: serviceContent['biuro-ksiegowe-lodz'],
    },
    {
        id: 3,
        icon: 'ti-receipt',
        simage: simg3,
        title: 'Rozliczenia podatku VAT, PIT, CIT, IFT, PCC',
        description: 'Terminowe i zgodne z przepisami rozliczenia najważniejszych zobowiązań podatkowych.',
        slug: 'rozliczenia-podatku',
        temat: 'Podatki (VAT, PIT, CIT)',
        content: serviceContent['rozliczenia-podatku'],
    },
    {
        id: 4,
        icon: 'ti-wallet',
        simage: simg4,
        title: 'Rozliczenia kadrowo-płacowe pracowników',
        description: 'Rzetelna obsługa wynagrodzeń, dokumentacji pracowniczej i obowiązków urzędowych.',
        slug: 'rozliczenia-kadrowo-placowe-pracownikow',
        temat: 'Kadry i płace (ZUS, PFRON)',
        content: serviceContent['rozliczenia-kadrowo-placowe-pracownikow'],
    },
    {
        id: 5,
        icon: 'ti-id-badge',
        simage: simg5,
        title: 'Usługi kadrowo-płacowe',
        description: 'Outsourcing kadr i płac dopasowany do wielkości, branży i sposobu działania firmy.',
        slug: 'uslugi-kadrowo-placowe',
        temat: 'Kadry i płace (ZUS, PFRON)',
        content: serviceContent['uslugi-kadrowo-placowe'],
    },
    {
        id: 6,
        icon: 'ti-agenda',
        simage: simg6,
        title: 'Prowadzenie ksiąg rachunkowych',
        description: 'Księgi rachunkowe, KPiR, ryczałt oraz kompletna ewidencja dokumentacji firmy.',
        slug: 'prowadzenie-ksiag-rachunkowych',
        content: serviceContent['prowadzenie-ksiag-rachunkowych'],
    },





];
export default Services;
