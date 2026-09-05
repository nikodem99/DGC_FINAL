import React from 'react';
import orlyRachunkowosci from '../../images/partners/orly-rachunkowosci.png';
import stowarzyszenieKsiegowych from '../../images/partners/stowarzyszenie-ksiegowych.png';
import swbr from '../../images/partners/swbr.png';
import centrumInformacjiKsiegowej from '../../images/partners/centrum-informacji-ksiegowej.png';
import kibr from '../../images/partners/kibr.png';
import sprawdzonePrzezKlientow from '../../images/partners/sprawdzone-przez-klientow.png';
import SectionTitle from '../SectionTitle/SectionTitle';
import './style.scss';

const partners = [
    {
        name: 'Orły Rachunkowości',
        logo: orlyRachunkowosci,
    },
    {
        name: 'Stowarzyszenie Księgowych w Polsce',
        logo: stowarzyszenieKsiegowych,
    },
    {
        name: 'Stowarzyszenie Współpracujących Biur Rachunkowych',
        logo: swbr,
    },
    {
        name: 'Centrum Informacji Księgowej',
        logo: centrumInformacjiKsiegowej,
    },
    {
        name: 'Krajowa Izba Biur Rachunkowych',
        logo: kibr,
    },
    {
        name: 'Sprawdzone przez Klientów',
        logo: sprawdzonePrzezKlientow,
    },
];

const PartnersCarousel = () => {
    return (
        <section className="partners_carousel_section" aria-labelledby="partners-carousel-title">
            <div className="container">
                <div className="partners_carousel_heading">
                    <SectionTitle
                        title="Partnerzy i wyróżnienia"
                        subtitle="Współpracujemy z"
                        subtitleId="partners-carousel-title"
                    />
                </div>
            </div>

            <div className="partners_carousel_viewport">
                <div className="partners_carousel_track">
                    {[false, true].map((isDuplicate) => (
                        <div
                            className="partners_carousel_group"
                            aria-hidden={isDuplicate || undefined}
                            key={isDuplicate ? 'duplicate' : 'original'}
                        >
                            {partners.map((partner) => (
                                <div className="partners_carousel_card" key={partner.name}>
                                    <img
                                        src={partner.logo}
                                        alt={isDuplicate ? '' : partner.name}
                                        loading="lazy"
                                        draggable="false"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <p className="partners_carousel_description">
                    Stawiamy na sprawdzone standardy, wiedzę i stały rozwój.
                    Współpraca z organizacjami branżowymi oraz zdobyte wyróżnienia
                    potwierdzają jakość i rzetelność naszej pracy.
                </p>
            </div>
        </section>
    );
};

export default PartnersCarousel;
