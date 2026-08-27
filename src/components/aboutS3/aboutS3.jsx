import React from 'react';

import Ab2 from '../../images/about2.jpg'
import Ab1 from '../../images/signeture.png'

const aboutS3 = () => {
    return (
        <section className="about_section_s3 pt-0">
            <div className="container">
                <div className="wrapper">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-12 order-2 order-lg-1">
                            <div className="content">
                                <h2>About Medically</h2>
                                <h3>Your Smile & Happiness Is Our Mission</h3>
                                <p>Our health and hospital policy encompasses the strategies, guidelines, and practices
                                    that
                                    technology companies use to achieve their goals and objectives. The policies may
                                    vary
                                    depending on the company's size, market position, and competitive landscape.
                                    Commodo
                                    erat amet vitae consectetur consectetur feugiat.</p>
                                <p>Tellus viverra eu risus ut ipsum magna sed odio elit. Sed sem purus tincidunt
                                    condimentum amet condimentum massa. Nunc vel nascetur id cras.</p>
                                <div className="ceo">
                                    <div>
                                        <h4>Savannah Nguyen</h4>
                                        <span>CEO & Founder of Madically</span>
                                    </div>
                                    <div>
                                        <img src={Ab1} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 order-1 order-lg-2">
                            <div className="about_left">
                                <img src={Ab2} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default aboutS3;