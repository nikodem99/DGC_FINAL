import React from "react";
import { Link } from 'react-router-dom'
import SectionTitle from "../SectionTitle/SectionTitle";
import Services from "../../api/Services";
import { useTresci } from "../../api/tresciStron.js";



const ServiceSection = (props) => {
    // Opisy kart z panelu; gdy klucza brak, zostaje tekst z paczki.
    const OPISY = useTresci('strony').ofertaKarty;

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <SectionTitle title={"Nasza oferta"} subtitle={"Usługi księgowe dla firm"} />
                    </div>
                </div>
                <div className="row">
                    {Services.slice(0, 6).map((servic, sky) => (
                        <div className="col-lg-4 col-md-6 col-12" key={sky}>
                            <div className="service_card">
                                <div className="icon">
                                    <i className={servic.icon}></i>
                                </div>
                                <div className="content">
                                    <h3>{servic.title}</h3>
                                    <p>{OPISY?.[servic.slug] ?? servic.description}</p>
                                    <Link onClick={ClickHandler} to={`/oferta/${servic.slug}/`} aria-label={`Przejdź do: ${servic.title}`}><i className="flaticon-right-arrow" aria-hidden="true"></i></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServiceSection;




