import React from 'react';
import QrOpinie from '../../images/qr-opinie-google.svg';

// Krotki link z panelu Profilu Firmy w Google ("Poproś o opinie").
// Otwiera od razu okno wystawiania opinii, bez szukania przycisku
// na wizytowce. UWAGA: kod QR w src/images/qr-opinie-google.svg koduje
// dokladnie ten adres — po zmianie linku trzeba go przegenerowac.
export const LINK_OPINIE = 'https://g.page/r/CVWxI1w5-iZOEAE/review';

// Zaproszenie do wystawienia opinii — wzor z manuqa.pl. Kod QR jest lokalnym
// SVG, wiec nie leci ani jedno zapytanie na zewnatrz.
const OpinieCta = ({ hclass = 'opinie_cta_section' }) => {
    return (
        <section className={hclass}>
            <div className="container">
                <div className="opinie_cta">
                    <div className="opinie_cta_tresc">
                        <span className="opinie_cta_nad">Twoja opinia ma znaczenie</span>
                        <h3>Podziel się opinią o DGC</h3>
                        <p>
                            Prowadzimy księgowość Twojej firmy? Napisz kilka słów w Google.
                            Twoja opinia pomaga innym przedsiębiorcom wybrać biuro,
                            któremu mogą powierzyć swoje rozliczenia.
                        </p>
                        <a
                            className="theme-btn"
                            href={LINK_OPINIE}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Zostaw opinię w Google
                        </a>
                    </div>

                    <a
                        className="opinie_cta_qr"
                        href={LINK_OPINIE}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Wystaw opinię o DGC w Google"
                    >
                        <img src={QrOpinie} alt="Kod QR do wystawienia opinii o DGC w Google" />
                        <span>Zeskanuj kod telefonem</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default OpinieCta;
