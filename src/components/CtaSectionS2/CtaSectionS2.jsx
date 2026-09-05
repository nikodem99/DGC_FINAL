import React from 'react';
import PaniPrezes from '../../images/paniprezes.jpg'
import { KONTAKT } from '../../api/kontakt';

// Ten sam uklad co pas na stronie glownej — rozni sie tylko zdjeciem.
// Szablon mial tu ikone "24/7" w tle mimo godzin pracy 8:00-16:00.
const CtaSectionS2 = () => {
    return (
        <section className="cta_section_s2">
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
                        <img src={PaniPrezes} alt="Danuta Grabińska-Chłopaś, prezes zarządu DGC" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSectionS2;
