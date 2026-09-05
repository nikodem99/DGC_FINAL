import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo-2.svg';
import packages from '../../api/pricing';
import FormSection from '../../components/FormSection/FormSection.jsx';



const PricingPage = () => {
    const scrollToTop = () => window.scrollTo(10, 0);

    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'Cennik'} pagesub={'Cennik'} />

            <main className="pricing_page">
                <section className="pricing_intro section-padding">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-9 col-12">
                                <SectionTitle
                                    title={'Pakiety usług'}
                                    subtitle={'Obsługa dopasowana do Twojej firmy'}
                                />
                                <p className="pricing_intro_lead">
                                    Każdą współpracę wyceniamy indywidualnie. Pakiety pokazują
                                    podstawowy zakres obsługi i ułatwiają wybór właściwego rozwiązania.
                                </p>
                            </div>
                        </div>

                        <div className="pricing_service_area">
                            <p className="pricing_service_note">
                                Obsługujemy przedsiębiorców z Łodzi, Pabianic, Zgierza,
                                Aleksandrowa Łódzkiego i okolic. Przed rozpoczęciem współpracy
                                omawiamy potrzeby firmy oraz dokładny zakres czynności.
                            </p>

                            <div className="pricing_grid">
                                {packages.map((item) => (
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
                                        <ul>
                                            {item.features.map((feature) => (
                                                <li key={feature}>
                                                    <span className="check_mark" aria-hidden="true">✓</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            onClick={scrollToTop}
                                            className="pricing_card_link"
                                            to="/contact"
                                        >
                                            Zapytaj o pakiet <span aria-hidden="true">→</span>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pricing_support">
                    <div className="container">
                        <div className="pricing_support_wrap">
                            <div className="row justify-content-center">
                                <div className="col-lg-9 col-12">
                                    <SectionTitle
                                        title={'Indywidualna oferta'}
                                        subtitle={'Twoje rachunki w najlepszych rękach'}
                                    />
                                    <p className="pricing_support_lead">
                                        Potrzebujesz wsparcia księgowego lub kadrowego? Skontaktuj się
                                        z nami. Przygotujemy ofertę dopasowaną do Twojej firmy.
                                    </p>
                                </div>
                            </div>

                            <div className="pricing_contact_options">
                                <a href="tel:+48731580184" className="pricing_contact_item">
                                    <span className="pricing_contact_icon" aria-hidden="true">
                                        <i className="fi flaticon-phone-call"></i>
                                    </span>
                                    <span>
                                        <small>Zadzwoń</small>
                                        <strong>+48 731 580 184</strong>
                                    </span>
                                </a>
                                <a href="mailto:kontakt@biurodgc.pl" className="pricing_contact_item">
                                    <span className="pricing_contact_icon" aria-hidden="true">
                                        <i className="fi flaticon-email"></i>
                                    </span>
                                    <span>
                                        <small>Napisz</small>
                                        <strong>kontakt@biurodgc.pl</strong>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <FormSection
                    zrodlo="cennik"
                    lead={'Zostaw kontakt i napisz, czego potrzebujesz. Odpowiemy z wyceną w ciągu 24 godzin roboczych.'}
                />
            </main>

            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    );
};

export default PricingPage;
