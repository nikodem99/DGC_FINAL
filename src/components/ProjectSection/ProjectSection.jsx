import React from "react";
import { Link } from "react-router-dom";
import Projects from "../../api/projects";
import SectionTitle from "../SectionTitle/SectionTitle";



const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const ProjectSection = (props) => {
    const { hclass, ShowSectionTitle = true, sliceStart = 0, sliceEnd = 3, } = props;
    return (
        <section className={hclass}>
            <div className="container">
                {ShowSectionTitle && (
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
                )}
                <div className="project_wrapper">
                    <div className="row">
                        {Projects.slice(sliceStart, sliceEnd,).map((project, pitem) => (
                            <div className="col-lg-4 col-md-6 col-12" key={pitem}>
                                <div className="project_card">
                                    <img src={project.pimg1} alt="" />
                                    <div className="text">
                                        <h2><Link onClick={ClickHandler} to={`/project-single/${project.slug}`}>{project.title}</Link></h2>
                                        <span>{project.subtitle}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ProjectSection;





