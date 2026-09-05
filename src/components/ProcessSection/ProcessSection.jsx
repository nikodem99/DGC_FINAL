import React from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';

/* image */
import Shape from '../../images/work/shape.svg'

const ProcessSection = (props) => {
    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <SectionTitle title={'Jak pracujemy'} subtitle={'Współpraca krok po kroku'}/>
                    </div>
                </div>
                <div className="work_wrapper">
                    <div className="row">
                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="work_card">
                                <div className="image">
                                    <div className="step_icon"><i className="ti-comments"></i></div>
                                        <span className="number">01</span>
                                </div>
                                <div className="text">
                                    <h3>Rozmowa i wycena</h3>
                                    <p>Ustalamy zakres obsługi i cenę na podstawie liczby dokumentów, liczby pracowników i rodzaju działalności.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="work_card">
                                <div className="image">
                                    <div className="step_icon"><i className="ti-write"></i></div>
                                        <span className="number">02</span>
                                </div>
                                <div className="text">
                                    <h3>Start i formalności</h3>
                                    <p>Pomagamy wybrać formę działalności, zarejestrować firmę lub spółkę w KRS oraz zgłosić ją do urzędu skarbowego i ZUS.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="work_card">
                                <div className="image">
                                    <div className="step_icon"><i className="ti-cloud-up"></i></div>
                                        <span className="number">03</span>
                                </div>
                                <div className="text">
                                    <h3>Dokumenty online</h3>
                                    <p>Przesyłasz dokumenty wtedy, kiedy Ci wygodnie, bez dojazdów do biura i bez pilnowania godzin otwarcia.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="work_card">
                                <div className="image">
                                    <div className="step_icon"><i className="ti-time"></i></div>
                                        <span className="number">04</span>
                                </div>
                                <div className="text">
                                    <h3>Księgi i terminy</h3>
                                    <p>Prowadzimy księgi i rozliczenia, pilnujemy terminów, a bieżący podgląd spraw firmy masz w Portalu Klienta.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shape">
                        <img src={Shape} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;