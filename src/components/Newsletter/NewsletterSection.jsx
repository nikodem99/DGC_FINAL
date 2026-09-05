import React from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import NewsletterForm from './NewsletterForm';

// Sekcja newslettera na podstronie z poradami. Ten sam formularz co w pasku
// bocznym oferty — rozni je tylko oprawa.
const NewsletterSection = ({ zrodlo = 'newsletter-porady' }) => {
    return (
        <section className="newsletter_section">
            <div className="container">
                <div className="newsletter_box">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            <SectionTitle
                                title={'Newsletter'}
                                subtitle={'Przepisy zmieniają się bez uprzedzenia'}
                            />
                            <p className="newsletter_lead">
                                Zostaw adres, a napiszemy, gdy zmieni się coś, co dotyczy
                                rozliczeń Twojej firmy. Krótko i konkretnie, bez reklam.
                                Wypisujesz się jednym kliknięciem.
                            </p>
                            <NewsletterForm zrodlo={zrodlo} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
