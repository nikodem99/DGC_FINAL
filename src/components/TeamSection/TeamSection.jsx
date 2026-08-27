import React from "react";
import { Link } from "react-router-dom";
import Teams from "../../api/team";
import SectionTitle from "../SectionTitle/SectionTitle";
import borderShape from '../../images/team/border-shape.svg'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const TeamSection = (props) => {
    const { hclass, sliceStart = 0, sliceEnd = 3, showSectionTitle = true, } = props;
    return (
        <section className={hclass}>
            <div className="container">
                {showSectionTitle && (
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-12">
                            <SectionTitle title={'Our Team'} subtitle={'Meet Our Specialists'} />
                        </div>
                    </div>
                )}
                <div className="row">
                    {Teams.slice(sliceStart, sliceEnd).map((team, titem) => (
                        <div className="col-lg-4 col-md-6 col-12" key={titem}>
                            <div className="team_card">
                                <div className="image">
                                    <img src={team.timg} alt=""/>
                                        <div className="border-shape">
                                        <img src={borderShape} alt="" />
                                        </div>
                                </div>
                                <div className="content">
                                    <h3><Link onClick={ClickHandler} to={`/team-single/${team.slug}`}>{team.title}</Link></h3>
                                    <span>{team.subtitle}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default TeamSection;


