import React from 'react';
import Ctaimg from '../../images/logo.jpg'
import { KONTAKT } from '../../api/kontakt';

// Szablon mial tu "Available 24/7" i amerykanski numer z puli zastrzezonej
// dla fikcji filmowej (555). DGC pracuje pon.-pt. 8:00-16:00 — obietnica
// calodobowej dostepnosci na stronie biura rachunkowego to zapowiedz,
// ktorej nikt nie dotrzyma.
// Ten sam pas stoi na stronie glownej (ze znakiem DGC) i na /about
// (ze zdjeciem prezes) — rozni je wylacznie obrazek.
const CtaSection = ({ image = Ctaimg, imageAlt = 'DGC Biuro Rachunkowe', ...props }) => {
    return (
        <section className={"" + props.tClass}>
            <div className="container">
                <div className="cta_wrapper">
                    <div className="content">
                        <div className="icon">
                            <i className="flaticon-phone-call"></i>
                        </div>
                        <div className="text">
                            <h2>Zadzwoń do nas</h2>
                            {/* numer jako link — na telefonie jedno tkniecie dzwoni */}
                            <h3><a href={KONTAKT.telefonHref}>{KONTAKT.telefon}</a></h3>
                            <p className="cta_godziny">{KONTAKT.godziny}</p>
                        </div>
                    </div>
                    <div className="shape-icon">
                        <i className="flaticon-deadline"></i>
                    </div>
                    <div className="image">
                        <img src={image} alt={imageAlt} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
