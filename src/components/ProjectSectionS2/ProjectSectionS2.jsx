import React from "react";
import { Link } from "react-router-dom";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import Projects from "../../api/projects";
import SectionTitle from "../SectionTitle/SectionTitle";



const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const ProjectSectionS2 = (props) => {
    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        responsive: [
            {
                breakpoint: 1499,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    dots: true,
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    centerMode: false,
                }
            },

        ]
    };

    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-12">
                        <SectionTitle title={'Our Portfolio'} subtitle={'All The Great Work That We Done'} />
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="project_btn">
                            <Link to="/project" className="theme-btn">See All Cases </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="project_wrapper project_section_slider">
                <div className="project_slider">
                    <Slider {...settings}>
                        {Projects.slice(0, 5).map((project, pitem) => (
                            <div className="project_card" key={pitem}>
                                <img src={project.pimg1} alt="" />
                                <div className="text">
                                    <h2><Link onClick={ClickHandler} to={`/project-single/${project.slug}`}>{project.title}</Link></h2>
                                    <span>{project.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    )
}
export default ProjectSectionS2;





