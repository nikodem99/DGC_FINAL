import React from 'react';
import CountUp from 'react-countup';
import About1 from '../../images/about2.jpg';
import About3 from '../../images/signeture.png';


const About2 = (props) => {


    return (
        <section className="about_section_s2">
            <div className="container">
                <div className="wrapper">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12">
                            <div className="about_left">
                                <img src={About1} alt="" />
                                    <div className="award">
                                        <div className="icon">
                                            <i className="flaticon-cup"></i>
                                        </div>
                                        <div className="text">
                                            <h2><CountUp end={25} enableScrollSpy />+</h2>
                                            <p>Years Of Experience</p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="content">
                                <h2>About Medically</h2>
                                <h3>Your Smile & Happiness Is Our Mission</h3>
                                <p>Our health and hospital policy encompasses the strategies, guidelines, and practices
                                    that
                                    technology companies use to achieve their goals and objectives. The policies may
                                    vary
                                    depending on the company's size, market position, and competitive landscape. Commodo
                                    erat amet vitae consectetur consectetur feugiat.</p>
                                <p>Tellus viverra eu risus ut ipsum magna sed odio elit. Sed sem purus tincidunt
                                    condimentum amet condimentum massa. Nunc vel nascetur id cras.</p>
                                <div className="ceo">
                                    <div>
                                        <h4>Savannah Nguyen</h4>
                                        <span>CEO & Founder of Madically</span>
                                    </div>
                                    <div>
                                        <img src={About3} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About2;