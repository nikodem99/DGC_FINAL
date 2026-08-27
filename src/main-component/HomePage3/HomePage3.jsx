import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx'
import Hero3 from '../../components/hero3/hero3.jsx';
import AppointmentSection from '../../components/AppointmentSection/AppointmentSection.jsx';
import AboutS3 from '../../components/aboutS3/aboutS3.jsx';
import ProcessSection from '../../components/ProcessSection/ProcessSection.jsx';
import ServiceSection from '../../components/ServiceSection/ServiceSection.jsx';
import ProjectSection from '../../components/ProjectSection/ProjectSection.jsx';
import Testimonial from '../../components/Testimonial/Testimonial.jsx';
import CtaSectionS2 from '../../components/CtaSectionS2/CtaSectionS2.jsx';
import TeamSection from '../../components/TeamSection/TeamSection.jsx';
import FunFact from '../../components/FunFact/FunFact.jsx';
import BlogSection from '../../components/BlogSection/BlogSection.jsx';
import CtafromSection from '../../components/CtafromSection/CtafromSection.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';

import Logo from '../../images/logo-2.svg'

const HomePage3 = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <Hero3 />
            <AppointmentSection hclass={'appointment_section_s2'} />
            <AboutS3/>
            <ProcessSection hclass={"work_section_s2 section-padding"} />
            <ServiceSection hclass={"service_section_s3 section-padding"} />
            <ProjectSection hclass={'project_section_s3 section-padding'} />
            <Testimonial tClass={'testimonial_section testimonial_section_slider section-padding pt-0'} />
            <CtaSectionS2 />
            <TeamSection hclass={'team_section_s2 section-padding'} />
            <FunFact hclass={'funfact_section'} />
            <BlogSection tClass={'blog_section section-padding'} />
            <CtafromSection hclass={'ctafrom_section'} />
            <Footer hclass={'wpo-site-footer'} />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage3;