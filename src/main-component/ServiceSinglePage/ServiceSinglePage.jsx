import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom'
import Services from '../../api/Services';
import ServiceSidebar from './sidebar'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import ContactForm from './ServiceFrom'
import logo from '../../images/logo.svg'

const ServiceSinglePage = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const { slug } = useParams()
    const serviceDetails = Services.find(item => item.slug === slug)
    const relatedServices = Services.filter(item => item.slug !== slug).slice(0, 3)

    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={serviceDetails.title} pagesub={'Oferta'} />
            <section className="service_single section-padding">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-lg-8 col-12 service_content">
                            <article className="service_copy">
                                <h2>{serviceDetails.title}</h2>
                                {serviceDetails.content.intro.map((paragraph, index) => (
                                    <p key={`intro-${index}`}>{paragraph}</p>
                                ))}

                                {serviceDetails.content.sections.map((section) => (
                                    <section className="service_copy_section" key={section.title}>
                                        <h3>{section.title}</h3>

                                        {section.paragraphs?.map((paragraph, index) => (
                                            <p key={`paragraph-${index}`}>{paragraph}</p>
                                        ))}

                                        {section.items?.length > 0 && (
                                            <ul>
                                                {section.items.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.closing?.map((paragraph, index) => (
                                            <p key={`closing-${index}`}>{paragraph}</p>
                                        ))}
                                    </section>
                                ))}
                            </article>
                            <div className="other-service">
                                <h3>Powiązane usługi</h3>
                                <div className="row">
                                    {relatedServices.map((serves, sitem) => (
                                        <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                                            <div className="service_card">
                                                <div className="icon">
                                                    <i className={serves.icon}></i>
                                                </div>
                                                <div className="content">
                                                    <h3>{serves.title}</h3>
                                                    <p>{serves.description}</p>
                                                    <Link onClick={ClickHandler} to={`/oferta/${serves.slug}/`}><i className="flaticon-right-arrow"></i></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cta_form_s2">
                                <div className={"title"}>
                                    <h3>Skontaktuj się z nami</h3>
                                    <p>Porozmawiajmy o zakresie obsługi dopasowanym do potrzeb Twojej
                                        firmy. Odpowiadamy w ciągu 24 godzin roboczych.</p>
                                </div>
                                {/* key={slug} wymusza przemontowanie przy przejsciu miedzy
                                    uslugami. Bez tego React zostawilby ten sam komponent,
                                    a podpowiedziany temat i wpisane dane zostalyby
                                    z poprzedniej podstrony. */}
                                <ContactForm
                                    key={slug}
                                    zrodlo="podstrona-oferty"
                                    temat={serviceDetails.temat ?? ''}
                                />

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



