import React from 'react';
import CtaForm from './CtaForm';

const CtafromSection = (props) => {
    return (
        <section className={"" +props.hclass}>
            <div className="container">
                <div className="cta_wrap">
                    <div className="content">
                        <h2>Sprawdź, ile kosztuje Twoja księgowość</h2>
                        <p>Odpowiedz na dwa pytania, a odeślemy wycenę dopasowaną do Twojej firmy.
                            Bezpłatnie i bez zobowiązań.</p>
                    </div>
                    <CtaForm/>
                </div>
            </div>
        </section>
    );
};

export default CtafromSection;