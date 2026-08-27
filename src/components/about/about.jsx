import React from 'react';
import CountUp from 'react-countup';


// image
import Ab1 from '../../images/about.jpg'
import Abd1 from '../../images/doctors/1.jpg'
import Abd2 from '../../images/doctors/2.jpg'
import Abd3 from '../../images/doctors/3.jpg'
import Abd4 from '../../images/doctors/4.jpg'
import sine from '../../images/signeture.png'

const about = (props) => {
    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-12">
                        <div className="about_left">
                            <div className="image">
                                <img src={Ab1} alt="" />
                                    <span className="round-on"></span>
                                    <span className="round-two"></span>
                                    <div className="award">
                                        <div className="icon">
                                            <i className="flaticon-cup"></i>
                                        </div>
                                        <div className="text">
                                        <h2><CountUp end={25} enableScrollSpy />+</h2>
                                            <p>Years Of Experience</p>
                                        </div>
                                    </div>
                                    <div className="doctors">
                                        <ul>
                                        <li><img src={Abd1} alt="" /></li>
                                        <li><img src={Abd2} alt="" /></li>
                                        <li><img src={Abd3} alt="" /></li>
                                        <li><img src={Abd4} alt="" /></li>
                                            <li><span>95+</span></li>
                                        </ul>
                                        <h4>Available Doctors</h4>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="content">
                            <h2>About Medically</h2>
                            <h3>Your Smile & Happiness Is Our Mission</h3>
                            <p>Our health and hospital policy encompasses the strategies, guidelines, and practices that
                                technology companies use to achieve their goals and objectives. The policies may vary
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
                                    <img src={sine} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default about;