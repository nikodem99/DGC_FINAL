import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero2 from '../../components/hero2/Hero2';
import ProcessSection from '../../components/ProcessSection/ProcessSection';
import About2 from '../../components/about2/about2';
import ServiceSection2 from '../../components/ServiceSection2/ServiceSection2';
import ProjectSectionS2 from '../../components/ProjectSectionS2/ProjectSectionS2';
import Testimonial from '../../components/Testimonial/Testimonial';
import FunFactS2 from '../../components/FunFactS2/FunFactS2';
import TeamSection from '../../components/TeamSection/TeamSection';
import CtafromSection from '../../components/CtafromSection/CtafromSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo-2.svg'

const HomePage2 = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <Hero2 />
            <ProcessSection hclass={"work_section_s2 section-padding"} />
            <About2 />
            <ServiceSection2 hclass={'service_section_s2 section-padding'} />
            <ProjectSectionS2 hclass={'project_section_s2 section-padding'} />
            <Testimonial tClass={'testimonial_section testimonial_section_slider section-padding'} />
            <FunFactS2 hclass={'funfact_section_s2'} />
            <TeamSection hclass={'team_section_s2 section-padding'} />
            <CtafromSection hclass={'ctafrom_section_s2'} />
            <BlogSection tClass={'blog_section section-padding'} />
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage2;