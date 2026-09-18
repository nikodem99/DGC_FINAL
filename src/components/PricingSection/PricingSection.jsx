import React from 'react';
import { Link } from 'react-router-dom';
import pakiety from '../../api/pricing';
import SectionTitle from '../SectionTitle/SectionTitle';

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

// Sekcja stoi zaraz po "jak wyglada wspolpraca", a przed opiniami — czyli
// dokladnie tam, gdzie czytelnik pyta o cene. Wirtualne biuro zostaje na
// podstronie /cennik, bo to inny produkt niz sama ksiegowosc.
const PricingSection = (props) => {
    const { hclass } = props;
    const widoczne = pakiety.filter((p) => p.naStronieGlownej);

    return (
        <section className={hclass}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7 col-12">
                        <SectionTitle title={'Cennik'} subtitle={'Ile kosztuje księgowość'} />
                    </div>
                    <div className="col-lg-5 col-12">
                        <div className="pricing_section_btn">
                            <Link onClick={ClickHandler} to="/cennik/" className="theme-btn">
                                Zobacz pełny cennik
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pricing_grid">
                    {widoczne.map((item) => (
                        <article
                            className={`pricing_card${item.featured ? ' is_featured' : ''}`}
                            key={item.title}
                        >
                            {item.featured && (
                                <span className="pricing_badge">Pełna księgowość</span>
                            )}
                            <div className="pricing_card_heading">
                                <h3>{item.title}</h3>
                                <div className="pricing_price">
                                    <strong>{item.price}</strong>
                                    <span>netto / miesiąc</span>
                                </div>
                            </div>
                            <p className="pricing_card_for">{item.dlaKogo}</p>
                            <ul>
                                {item.features.map((feature) => (
                                    <li key={feature}>
                                        <span className="check_mark" aria-hidden="true">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link onClick={ClickHandler} className="pricing_card_link" to="/kontakt/">
                                Zapytaj o wycenę <span aria-hidden="true">→</span>
                            </Link>
                        </article>
                    ))}
                </div>

                <p className="pricing_section_note">
                    Podane stawki są cenami wywoławczymi netto za miesiąc obsługi.
                    Ostateczną cenę ustalamy po rozmowie, bo zależy od liczby dokumentów,
                    formy prawnej i zakresu kadr. Wycena jest bezpłatna i niezobowiązująca.
                </p>
            </div>
        </section>
    );
};

export default PricingSection;
