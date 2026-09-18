import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Teams from "../../api/team";
import SectionTitle from "../SectionTitle/SectionTitle";
import borderShape from '../../images/team/border-shape.svg'
import './suwak.scss'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

// Ile kart widac naraz. Liczymy to sami, a NIE przez opcje "responsive"
// react-slicka. Powod: przy zwyklym wejsciu na strone jej mechanizm nie
// ustawial breakpointu (state.breakpoint zostawal null), mimo ze zapytanie
// medialne pasowalo i bylo zarejestrowane. Skutek byl taki, ze telefon
// dostawal trzy karty po 123px, ze zdjeciami 111x167 i nachodzacymi
// nazwiskami. Wlasny nasluch jest przewidywalny i da sie go sprawdzic.
const ileKart = () => {
    if (typeof window === 'undefined') return 3;
    const szer = window.innerWidth;
    if (szer <= 575) return 1;
    if (szer <= 991) return 2;
    return 3;
};

// Reszta ustawien jak w suwaku opinii (Testimonial.jsx). Przeciaganie mysza
// i palcem dziala z domyslnych wartosci react-slicka (draggable, swipe,
// touchMove), a autoplay zatrzymuje sie pod kursorem.
const USTAWIENIA_SUWAKA = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    // Wolniej niz w opiniach: tam jest tekst do przeczytania, tu twarze,
    // ktore maja sie przesuwac spokojnie, a nie migac.
    autoplaySpeed: 4500,
    speed: 600,
    slidesToScroll: 1,
    swipeToSlide: true,
};

const TeamSection = (props) => {
    const {
        hclass,
        sliceStart = 0,
        sliceEnd = 3,
        showSectionTitle = true,
        // Domyslnie lista nadzoru merytorycznego — dzieki temu strony,
        // ktore nie podaja wlasnej listy, dzialaja jak wczesniej.
        osoby = Teams,
        title = 'Nadzór merytoryczny',
        subtitle = 'Kto czuwa nad Twoimi sprawami',
        suwak = false,
    } = props;

    const [naRaz, setNaRaz] = useState(ileKart);

    useEffect(() => {
        const przelicz = () => setNaRaz(ileKart());
        przelicz();
        window.addEventListener('resize', przelicz);
        return () => window.removeEventListener('resize', przelicz);
    }, []);

    const widoczne = osoby.slice(sliceStart, sliceEnd);

    // Nazwisko jest odnosnikiem tylko wtedy, gdy osoba ma wlasna podstrone.
    // Zespol biura jej nie ma, a podstrony /team-single to wciaz tresc
    // z szablonu medycznego — linkowanie tam bylo by gorsze niz jego brak.
    const karta = (team, klucz) => (
        <div className="team_card" key={klucz}>
            <div className="image">
                <img src={team.timg} alt={team.title} />
                <div className="border-shape">
                    <img src={borderShape} alt="" />
                </div>
            </div>
            <div className="content">
                <h3>
                    {team.slug
                        ? <Link onClick={ClickHandler} to={`/team-single/${team.slug}`}>{team.title}</Link>
                        : <span className="team_nazwa">{team.title}</span>}
                </h3>
                {team.subtitle && <span>{team.subtitle}</span>}
            </div>
        </div>
    );

    return (
        <section className={hclass}>
            <div className="container">
                {showSectionTitle && (
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-12">
                            <SectionTitle title={title} subtitle={subtitle} />
                        </div>
                    </div>
                )}

                {suwak ? (
                    <div className="row team_suwak">
                        <Slider {...USTAWIENIA_SUWAKA} slidesToShow={naRaz}>
                            {/* Element posredni jest konieczny: react-slick wstrzykuje
                                bezposredniemu dziecku styl inline
                                "width:100%; display:inline-block", ktory bije arkusz
                                i uniemozliwia zrobienie z karty kontenera flex.
                                Stempel dostaje teraz .team_slajd, a karta zostaje wolna. */}
                            {widoczne.map((team, titem) => (
                                <div className="team_slajd" key={titem}>
                                    {karta(team, titem)}
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="row">
                        {widoczne.map((team, titem) => (
                            <div className="col-lg-4 col-md-6 col-12" key={titem}>
                                {karta(team, titem)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
export default TeamSection;
