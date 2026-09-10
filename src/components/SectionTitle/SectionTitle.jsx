import React from 'react';

const SectionTitle = ({ title, subtitle, subtitleId }) => {
    return (
        <div className="section_title">
            {/* Pastylka to etykieta, nie naglowek — jako <h2> psula
                hierarchie dokumentu. Tytul sekcji jest teraz <h2>,
                bo <h1> nalezy do naglowka strony. */}
            <span className="section_nad">{title}</span>
            <h2 id={subtitleId}>{subtitle}</h2>
        </div>
    );
};

export default SectionTitle;
