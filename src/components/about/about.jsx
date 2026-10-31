import React from 'react';
import Licznik from '../Licznik/Licznik';
import { latNaRynku } from '../../seo/firma.js';
import { useTresci } from '../../api/tresciStron.js';

// image
// Zdjecie prezes poza paczka Vite, zeby panel mogl je podmienic.
// Powod opisany w src/api/team.js.
const Ab1 = '/dane/obrazki/paniprezes.jpg';

// Tresc oparta na materialach DGC: biurodgc.pl (strona glowna) oraz
// biurodgc.pl/prezes-zarzadu/. Zadnych danych spoza tych zrodel.
const about = (props) => {
    const { onas: O } = useTresci('strony');
    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-12">
                        <div className="about_left">
                            <div className="image">
                                <img src={Ab1} alt="Danuta Grabińska-Chłopaś, prezes zarządu DGC biuro rachunkowe" />
                                    <span className="round-on"></span>
                                    <span className="round-two"></span>
                                    <div className="award">
                                        <div className="icon">
                                            <i className="flaticon-cup"></i>
                                        </div>
                                        <div className="text">
                                        <h2><Licznik ile={latNaRynku()} /></h2>
                                            <p>Lat na rynku</p>
                                        </div>
                                    </div>
                                    {/* Pasek z awatarami zespolu i licznikiem klientow zdjety do czasu,
                                        az dostaniemy zdjecia zespolu i potwierdzona liczbe klientow.
                                        Bez tych danych bylby to wymyslony wskaznik. */}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="content">
                            <h2>{O.naglowek}</h2>
                            <h3>{O.podtytul}</h3>
                            {O.akapity.map((a, i) => <p key={i}>{a}</p>)}
                            <div className="ceo">
                                <div>
                                    <h4>Danuta Grabińska-Chłopaś</h4>
                                    <span>Prezes zarządu DGC biuro rachunkowe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default about;
