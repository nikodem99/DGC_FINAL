import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo-2.svg'
import { wycofajZgody } from '../../lib/zgody';



const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const Footer = (props) => {
   
    return (
        <footer className={"" +props.hclass}>
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <img src={logo} alt="blog" />
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
                                    <li><i className="flaticon-email"></i><span>kontakt@biurodgc.pl</span>
                                    </li>
                                    <li> <i className="flaticon-telephone"></i><span>+48 731 580 184
                                        <br />pon.–pt. 8:00–16:00</span></li>
                                    <li><i className="flaticon-location-1"></i><span>ul. Brukowa 8 <br/>
                                        91-341 Łódź</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
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




