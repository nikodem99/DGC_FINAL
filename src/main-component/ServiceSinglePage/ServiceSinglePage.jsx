import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom'
import Services from '../../api/Services';
import ServiceSidebar from './sidebar'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import ContactForm from './ServiceFrom'
import simg1 from '../../images/service-single/img-1.jpg'
import simg2 from '../../images/service-single/img-2.jpg'
import logo from '../../images/logo-2.svg'

const ServiceSinglePage = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const { slug } = useParams()
    const serviceDetails = Services.find(item => item.slug === slug)

    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={serviceDetails.title} pagesub={'Service Single'} />
            <section className="service_single section-padding">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-lg-8 col-12 service_content">
                            <div>
                                <img src={serviceDetails.simage} alt="" />
                                <h2>{serviceDetails.title}</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus dis posuere amet tincidunt
                                    commodo, velit. Ipsum, hac nibh fermentum nisi, platea condimentum cursus velit dui.
                                    Massa
                                    volutpat odio facilisis purus sit elementum. Non, sed velit dictum quam. Id risus
                                    pharetra
                                    est, at rhoncus, nec ullamcorper tincidunt. Id aliquet duis sollicitudin diam, elit sit.
                                    Et
                                    nisi in libero facilisis sed est. Elit curabitur amet risus bibendum. Posuere et eget
                                    orci,
                                    tempor enim.</p>
                                <p>Hac nibh fermentum nisi, platea condimentum cursus velit dui. Massa volutpat odio
                                    facilisis
                                    purus sit elementum. Non, sed velit dictum quam. Id risus pharetra est, at rhoncus, nec
                                    ullamcorper tincidunt. Id aliquet duis sollicitudin diam, elit sit.</p>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-12">
                                    <img src={simg1} alt="" />
                                </div>
                                <div className="col-lg-6 col-12">
                                    <img src={simg2} alt="" />
                                </div>
                            </div>
                            <div>
                                <h3>Our Capabilities</h3>
                                <p>Massa volutpat odio facilisis purus sit elementum. Non, sed velit dictum quam. Id risus
                                    pharetra est, at rhoncus, nec ullamcorper tincidunt. Id aliquet duis sollicitudin diam.
                                </p>
                                <ul>
                                    <li>Non saed velit dictum quam risus pharetra esta.</li>
                                    <li>Id risus pharetra est, at rhoncus, nec ullamcorper tincidunt.</li>
                                    <li>Hac nibh fermentum nisi, platea condimentum cursus.</li>
                                    <li>Massa volutpat odio facilisis purus sit elementum.</li>
                                    <li>Elit curabitur amet risus bibendum.</li>
                                </ul>
                            </div>
                            <div>
                                <h3>Our approach</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat suspendisse aenean
                                    tellus augue morbi risus. Sit morbi vitae morbi sed urna sed purus. Orci facilisi eros
                                    sed pellentesque. Risus id sed tortor sed scelerisque. Vestibulum elit elementum, magna
                                    id viverra non, velit. Pretium, eros, porttitor fusce auctor vitae id. Phasellus
                                    scelerisque nibh eleifend vel enim mauris purus. Rutrum vel sem adipiscing nisi
                                    vulputate molestie scelerisque molestie ultrices. Eu, fusce vulputate diam interdum
                                    morbi ac a.
                                </p>

                            </div>
                            <div className="other-service">
                                <h3>Related Service</h3>
                                <div className="row">
                                    {Services.slice(0, 3).map((serves, sitem) => (
                                        <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                                            <div className="service_card">
                                                <div className="icon">
                                                    <i className={serves.icon}></i>
                                                </div>
                                                <div className="content">
                                                    <h2>{serves.title}</h2>
                                                    <p>{serves.description}</p>
                                                    <Link onClick={ClickHandler} to={`/service-single/${serves.slug}`}><i className="flaticon-right-arrow"></i></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cta_form_s2">
                                <div className={"title"}>
                                    <h3>Make An Appointment</h3>
                                    <p>Get in touch with us to see how we can help you with your Problems.</p>
                                </div>
                                <ContactForm />

                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <ServiceSidebar/>
                        </div>
                    </div>
                </div>
            </section>
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default ServiceSinglePage;



