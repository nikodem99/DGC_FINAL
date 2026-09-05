import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionTitle from '../SectionTitle/SectionTitle';
import OpinieCta from '../OpinieCta/OpinieCta';

// PRAWDZIWE opinie z wizytowki Google DGC, przepisane bez zmian w tresci.
// Nic tu nie moze byc wymyslone ani "wygladzone" — cytat cudzej wypowiedzi
// albo jest doslowny, albo przestaje byc cytatem.
//
// Wyswietlamy same imiona: na Google widnieja pelne nazwiska, ale do
// wiarygodnosci wystarcza imie, a mniej danych osobowych na stronie
// to mniej do obrony.
//
// Daty przeliczone z wzglednych opisow Google ("6 months ago") na miesiac
// i rok, bo strona jest statyczna — "6 miesiecy temu" zostaloby na niej
// na zawsze. Przelicznik wzgledem wrzesnia 2026; Google i tak zaokragla,
// wiec to przyblizenie co do kilku tygodni.
// Wielokropek w nawiasie — […] — oznacza, ze cytat jest fragmentem. Czesc
// opinii Google sam przycina ("… More") i pelnej tresci po prostu nie mamy;
// pozostale skracamy do dwoch zdan, zeby karty mialy podobna objetosc.
// Literowki i brakujace ogonki sa przepisane tak, jak napisali je autorzy —
// poprawianie cudzej wypowiedzi to juz nie cytat.
const testimonials = [
    {
        id: '01',
        Des: "Biuro DGC skutecznie uporządkowało moje księgi po wczesniejszej, długoletniej współpracy z poprzednim biurem. Obsluga klienta na najwyzszym poziomie. […]",
        title: 'J.W.',
        sub: "kwiecień 2026",
    },
    {
        id: '02',
        Des: "Przy zakładaniu działalności zależało mi na sprawnym przejściu przez formalności i właśnie takie wsparcie tutaj otrzymałam. […]",
        title: 'Sandra',
        sub: "lipiec 2026",
    },
    {
        id: '03',
        Des: "Biuro Rachunkowe DGC, to najwyższa jakość usług!!! Panie które tam pracują są bardzo miłe, cierpliwe, wszystko wytłumaczą krok po kroku. […]",
        title: 'Magdalena',
        sub: "kwiecień 2026",
    },
    {
        id: '04',
        Des: "Profesjonalne biuro godne polecenia. Działają szybko, sprawnie i zawsze odpowiadają na pytania bez zbędnej zwłoki. Jestem bardzo zadowolony ze współpracy.",
        title: 'Rafal',
        sub: "kwiecień 2026",
    },
    {
        id: '05',
        Des: "To partner, którego naprawdę warto mieć w swoim narożniku. Biuro działa profesjonalnie, rzetelnie i zawsze można liczyć na pomoc oraz fachowe doradztwo. […]",
        title: 'Kamil',
        sub: "kwiecień 2026",
    },
    {
        id: '06',
        Des: "Pani Danusia to rzeczowa, konkretna osoba. Najbardziej opornym jest w stanie wszystko wytłumaczyć. […]",
        title: 'Katarzyna',
        sub: "czerwiec 2026",
    },
    {
        id: '07',
        Des: "Współpracuję z biurem od 2023 roku i jestem bardzo zadowolony. Pełen profesjonalizm, rzetelność i świetny kontakt. […]",
        title: 'Karol',
        sub: "maj 2026",
    },
    {
        id: '08',
        Des: "Serdecznie polecam współpracę z biurem DGC! Kompleksowe wsparcie podczas procesu zakładania działalności jak i w trakcie jej prowadzenia. […]",
        title: 'Pakersi Łódź Aleksandrowska',
        sub: "sierpień 2026",
    },
    {
        id: '09',
        Des: "Bardzo rzetelna obsługa księgowa i zawsze wszystko przygotowane na czas. Kontakt szybki i konkretny, co bardzo ułatwia prowadzenie firmy.",
        title: 'Madzia',
        sub: "lipiec 2026",
    },
    {
        id: '10',
        Des: "Profesjonalna obsługa księgowa i bardzo dobry kontakt z klientem. Wszystkie sprawy są załatwiane terminowo i bez zbędnych komplikacji.",
        title: 'Adam',
        sub: "lipiec 2026",
    },
    {
        id: '11',
        Des: "Bardzo polecam! Miła obsługa, dobry kontakt i pełen profesjonalizm. Współpraca bez żadnych problemów :)",
        title: 'Dawid',
        sub: "sierpień 2026",
    },
    {
        id: '12',
        Des: "Pracujemy razem od ponad 4 lat i wszystko uklada sie bardzo dobrze. Polecam",
        title: 'Michał',
        sub: "czerwiec 2026",
    },
]

const Testimonial = (props) => {

    const settings = {
        dots: false,
        autoplay: true,
        infinite: true,
        arrows: false,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    };

    return (
        <>
        <section className={"" + props.tClass}>
            <div className="container">
                <div className="row justify-content-left">
                    <div className="col-12">
                        <SectionTitle title='Opinie' subtitle="Co mówią o nas klienci" />
                    </div>
                </div>
                <div className="row testimonial_slider">
                    <Slider {...settings}>
                        {testimonials.map((testitem, titem) => (
                            <div className="testimonial_card" key={titem}>
                                <div className="icon">
                                    <i className="flaticon-quote"></i>
                                </div>
                                <ul>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                </ul>
                                <p>{testitem.Des}</p>
                                <div className="ath">
                                    <div className="text">
                                        <h3>{testitem.title}</h3>
                                        <span>{testitem.sub}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

            </div>
        </section>

        <OpinieCta />
        </>
    );
}

export default Testimonial;
