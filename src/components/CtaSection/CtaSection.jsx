import React from 'react';
import Ctaimg from '../../images/cta.png'

const CtaSection = (props) => {
    return (
        <section className={"" + props.tClass}>
            <div className="container">
                <div className="cta_wrapper">
                    <div className="content">
                        <div className="icon">
                            <i className="flaticon-phone-call"></i>
                        </div>
                        <div className="text">
                            <h2>Available 24/7</h2>
                            <h3>(208) 555-0112</h3>
                        </div>
                    </div>
                    <div className="shape-icon">
                        <i className="flaticon-24-7"></i>
                    </div>
                    <div className="image">
                        <img src={Ctaimg} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;