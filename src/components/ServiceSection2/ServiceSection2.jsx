import React from "react";
import { Link } from 'react-router-dom'
import SectionTitle from "../SectionTitle/SectionTitle";
import Services from "../../api/Services";



const ServiceSection = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <SectionTitle title={"Departmental Services"} subtitle={"Our Medical Services"} />
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
                                    <h2>{servic.title}</h2>
                                    <p>{servic.description}</p>
                                    <Link onClick={ClickHandler} to={`/service-single/${servic.slug}`}><i className="flaticon-right-arrow"></i></Link>
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




