import React from 'react';
import CtaForm from './CtaForm';

const CtafromSection = (props) => {
    return (
        <section className={"" +props.hclass}>
            <div className="container">
                <div className="cta_wrap">
                    <div className="content">
                        <h2>Get A Free Consultation</h2>
                        <p>Drop us a line! We are here to answer your questions 24/7</p>
                    </div>
                    <CtaForm/>
                </div>
            </div>
        </section>
    );
};

export default CtafromSection;