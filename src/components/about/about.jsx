import React from 'react';
import CountUp from 'react-countup';

// image
import Ab1 from '../../images/paniprezes.jpg'

// Tresc oparta na materialach DGC: biurodgc.pl (strona glowna) oraz
// biurodgc.pl/prezes-zarzadu/. Zadnych danych spoza tych zrodel.
const about = (props) => {
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
                                        <h2><CountUp end={15} enableScrollSpy /></h2>
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
                            <h2>O nas</h2>
                            <h3>Partnerem w biznesie, nie tylko biurem</h3>
                            <p>Od 2011 roku prowadzimy księgowość firm o zróżnicowanym profilu działania
                                i różnej wielkości. Wsłuchujemy się w potrzeby klienta i dobieramy rozwiązania
                                do jego sytuacji. Chcemy być partnerem w biznesie, a nie tylko biurem,
                                które księguje dokumenty.</p>
                            <p>Obsługa odbywa się online, więc dokumenty dostarczasz wtedy, kiedy Ci wygodnie,
                                bez dojazdów do biura. Prowadzimy pełną księgowość, rozliczenia podatkowe
                                oraz sprawy kadrowo-płacowe, a firmom szukającym adresu oferujemy biuro wirtualne.</p>
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
