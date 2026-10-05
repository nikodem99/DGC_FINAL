import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo-2.svg'
import { wycofajZgody } from '../../lib/zgody';
import { KONTAKT } from '../../api/kontakt';



const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const Footer = (props) => {
   
    return (
        <footer className={"" +props.hclass}>
            <div className="dgc-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    {/* Pusty alt celowo: to ten sam znak firmowy co
                                        w naglowku, nie jest odnosnikiem i nic nie wnosi
                                        do tresci. Czytnik ma go pominac, a nie czytac
                                        drugi raz. Bylo tu alt="blog" z szablonu. */}
                                    <img src={logo} alt="" />
                                </div>
                                <p>Biuro rachunkowe z Łodzi. Od 2011 roku prowadzimy księgowość, rozliczenia
                                    podatkowe oraz sprawy kadrowo-płacowe firm z całej Polski.</p>
                                <div className="social-widget">
                                    <ul>
                                        <li>
                                            <a href="https://www.facebook.com/dgcbiurorachunkowe" target="_blank" rel="noreferrer" aria-label="Facebook DGC Biuro Rachunkowe">
                                                <i className="flaticon-facebook-app-symbol"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.linkedin.com/company/dgc-biuro-rachunkowe" target="_blank" rel="noreferrer" aria-label="LinkedIn DGC Biuro Rachunkowe">
                                                <i className="flaticon-linkedin"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com/dgc_biuro_rachunkowe" target="_blank" rel="noreferrer" aria-label="Instagram DGC Biuro Rachunkowe">
                                                <i className="flaticon-instagram"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Nawigacja</h3>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/">Strona główna</Link></li>
                                    <li><Link onClick={ClickHandler} to="/o-nas/">O nas</Link></li>
                                    <li><Link onClick={ClickHandler} to="/oferta/">Oferta</Link></li>
                                    <li><Link onClick={ClickHandler} to="/cennik/">Cennik</Link></li>
                                    <li><Link onClick={ClickHandler} to="/porady/">Porady</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget s2">
                                <div className="widget-title">
                                    <h3>Przydatne</h3>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/kontakt/">Kontakt</Link></li>
                                    <li><Link onClick={ClickHandler} to="/faq/">Najczęstsze pytania</Link></li>
                                    <li><Link onClick={ClickHandler} to="/polityka-prywatnosci/">Polityka prywatności</Link></li>
                                    <li>
                                        <button type="button" className="stopka_zgody" onClick={wycofajZgody}>
                                            Ustawienia prywatności
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget contact-widget">
                                <div className="widget-title">
                                    <h3>Kontakt</h3>
                                </div>
                                <ul>
                                    {/* Numer i adres MUSZA byc odnosnikami. Jako zwykly
                                        tekst nie da sie ich kliknac z telefonu, a w GTM
                                        wisza na nich konwersje "kontakt telefoniczny"
                                        i "kontakt mailowy" — bez odnosnika nie maja
                                        z czego odpalic. Dane z api/kontakt.js, zeby nie
                                        rozjechaly sie z reszta serwisu. */}
                                    <li><i className="flaticon-email"></i>
                                        <span><a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a></span>
                                    </li>
                                    <li><i className="flaticon-telephone"></i>
                                        <span><a href={KONTAKT.telefonHref}>+48 {KONTAKT.telefon}</a>
                                        <br />{KONTAKT.godziny}</span></li>
                                    <li><i className="flaticon-location-1"></i><span>ul. Brukowa 8 <br/>
                                        91-341 Łódź</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dgc-lower-footer">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12">
                            <p className="creator-credit">&copy; 2026 <a href="https://chaoticshapes.pl/" target="_blank" rel="noreferrer">Chaotic Shapes</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;




