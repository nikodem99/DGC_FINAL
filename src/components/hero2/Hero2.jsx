import React from 'react';
import { Link } from 'react-router-dom';
import HeroIm1 from '../../images/slider/2.png';

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Hero2 = () => {
    return (
        <section className="hero_section_s2">
            <div className="container">
                <div className="wrapper">
                    <div className="content">
                        <h2>Caring For Your Healthy Life</h2>
                        <Link onClick={ClickHandler} to="/about" className="theme-btn-s2">Make Appointment <i
                            className="flaticon-right-arrow"></i></Link>
                    </div>
                    <div className="image">
                        <img src={HeroIm1} alt="" />
                        <div className="shape">
                            <svg viewBox="0 0 686 686" fill="none">
                                <circle cx="343" cy="343" r="226.5" stroke="#A1BCC0" />
                                <circle cx="343" cy="343" r="278.5" stroke="#A1BCC0" />
                                <circle cx="343" cy="343" r="342.5" stroke="#A1BCC0" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="important">
                <div className="row g-0">
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <div className="icon">
                                <i className="flaticon-doctor"></i>
                            </div>
                            <h3>Our Qualified Doctor</h3>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <div className="icon">
                                <i className="flaticon-deadline"></i>
                            </div>
                            <h3>Make Appointment</h3>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <div className="icon">
                                <i className="flaticon-location"></i>
                            </div>
                            <h3>Find Our Location</h3>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <div className="icon">
                                <i className="flaticon-mortar"></i>
                            </div>
                            <h3>Get Treatment</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero2;



