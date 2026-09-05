import React from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import ContactForm from '../ContactFrom/ContactForm';

// Sekcja z formularzem uzywana na /cennik, /contact i docelowo na podstronach
// oferty. Jeden komponent zamiast kopii: typografia i odstepy sa wtedy wszedzie
// takie same, a pole `zrodlo` mowi w skrzynce, z ktorej podstrony przyszlo
// zgloszenie.
const FormSection = ({
    title = 'Zapytanie',
    subtitle = 'Napisz do nas',
    lead = 'Zostaw kontakt i napisz, czego potrzebujesz. Odpowiemy w ciągu 24 godzin roboczych.',
    zrodlo = 'strona-kontaktu',
    hclass = 'form_section',
}) => {
    return (
        <section className={`wpo-contact-pg-section ${hclass}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-12">
                        <SectionTitle title={title} subtitle={subtitle} />
                        <p className="form_section_lead">{lead}</p>
                        <div className="wpo-contact-form-area">
                            <ContactForm zrodlo={zrodlo} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormSection;
