import React from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import offerMenu from '../../api/offerMenu';
import ZnakNegatyw from '../../images/logo-2.svg';


const Header = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    // Wariant s2 lezy NA ciemnozielonym pasku tytulu podstrony: ma przezroczyste
    // tlo i position: absolute, wiec tlem naglowka jest ten pasek. Znak petrolowy
    // z props.Logo ma dokladnie jego kolor (#0d4444) i bylby niewidoczny — trzeba
    // negatywu. Ten sam powod, dla ktorego menu w tym wariancie jest biale
    // (src/sass/layout/_header.scss, blok "dgc-site-header-s2").
    //
    // Wybor stoi tutaj, a nie w jedenastu plikach podstron, bo to naglowek wie,
    // na czym lezy. Gdy decyzja siedziala po stronie wywolan, kazda podstrona
    // musiala o niej pamietac i zadna nie pamietala — wszystkie podawaly znak
    // petrolowy. Strona glowna (wariant bez s2, jasne hero) bierze props.Logo.
    const naCiemnymPasku = String(props.hclass || '').includes('dgc-site-header-s2');
    const znak = naCiemnymPasku ? ZnakNegatyw : props.Logo;

    return (
        <header id="header">
            <div className={"" + props.hclass}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <MobileMenu />
                            </div>
                            {/* Kolumna znaku: od 992px trzy jednostki, nie dwie.
                                Przy dwoch (16,7%) nowy logotyp poziomy nie miescil
                                sie we wlasnej kolumnie — konczyl sie 36px ZA jej
                                krawedzia i wchodzil w pole nawigacji, przez co
                                pierwsza pozycja menu stala tuz przy znaku.
                                Zmierzone przy 1440px: znak 73-281px, kolumna
                                nawigacji od 245px. Trzy jednostki daja znakowi
                                wlasne miejsce i przy okazji przesuwaja menu w prawo. */}
                            <div className="col-lg-3 col-md-6 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/"><img src={znak}
                                        alt="DGC Biuro Rachunkowe – strona główna" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-3 col-3">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li>
                                            <Link onClick={ClickHandler} to="/">Strona główna</Link>
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/o-nas/">O nas</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/oferta/">Oferta</Link>
                                            <ul className="sub-menu">
                                                {offerMenu.map((item) => (
                                                    <li key={item.link}>
                                                        <Link onClick={ClickHandler} to={item.link}>{item.title}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/cennik/">Cennik</Link></li>
                                        <li><Link onClick={ClickHandler} to="/porady/">Porady</Link></li>
                                        <li><Link onClick={ClickHandler} to="/kontakt/">Kontakt</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;
