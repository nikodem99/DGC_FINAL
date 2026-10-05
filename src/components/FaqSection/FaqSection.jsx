import React, { useState } from 'react';
import { FAQ_OGOLNE } from '../../api/faq';


// Sekcja przyjmuje wlasny zestaw pytan i naglowek, zeby ta sama karuzela
// pytan mogla stanac na /faq, na /about i pozniej na podstronach oferty.
const FaqSection = ({
    items = FAQ_OGOLNE,
    title = 'Najczęstsze pytania',
    hclass = 'dgc-faq-section section-padding',
}) => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Na stronie /o-nas/ ta sama sekcja stoi drugi raz, wiec identyfikatory
    // musza sie roznic — inaczej aria-controls wskazuje cudza odpowiedz.
    const idBazowe = React.useId();

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    return (
        <section className={hclass}>
            <div className="container">
                <div className="row align-items-center">
                    {/* Naglowek dostaje pelna szerokosc kontenera. W kolumnie 8/12
                        dluzszy tytul ("Pytania, ktore slyszymy najczesciej")
                        potrzebowal 897px przy dostepnych 880 i lamal sie na dwie
                        linie. Sam akordeon zostaje wezszy — tam wazniejsza jest
                        dlugosc wiersza do czytania. */}
                    <div className="col-12">
                        <div className="section_title">
                            <h3>{title}</h3>
                        </div>
                    </div>
                    <div className="col-lg-8 offset-lg-2">
                        <div className="dgc-faq-wrap">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className="dgc-benefits-item">
                                        {items.map((accordion, index) => (
                                            <div
                                                className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                                                key={index}
                                            >
                                                <h3 className="accordion-header">
                                                    <button
                                                        type="button"
                                                        id={`${idBazowe}-przycisk-${index}`}
                                                        aria-controls={`${idBazowe}-odpowiedz-${index}`}
                                                        onClick={() => handleToggle(index)}
                                                        aria-expanded={activeIndex === index}
                                                    >
                                                        {accordion.title}
                                                    </button>
                                                </h3>
                                                {/* Odpowiedz jest w dokumencie ZAWSZE, schowana atrybutem
                                                    hidden. Wczesniej powstawala dopiero po kliknieciu, wiec
                                                    w gotowym HTML-u nie bylo ani slowa odpowiedzi — ani dla
                                                    czytnika ekranu, ani dla wyszukiwarki, ani dla kogos bez
                                                    JavaScriptu. Na /faq/ to 320 slow tresci, do ktorych
                                                    odwoluja sie jeszcze dane strukturalne FAQPage. */}
                                                <div
                                                    className="accordion-body"
                                                    id={`${idBazowe}-odpowiedz-${index}`}
                                                    role="region"
                                                    aria-labelledby={`${idBazowe}-przycisk-${index}`}
                                                    hidden={activeIndex !== index}
                                                >
                                                    <p>{accordion.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
