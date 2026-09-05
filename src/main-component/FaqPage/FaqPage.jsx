import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import FaqSection from '../../components/FaqSection/FaqSection.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';
import Logo from '../../images/logo-2.svg'


const ProjectPage = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'Najczęstsze pytania'} pagesub={'Najczęstsze pytania'} />
            <FaqSection />
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />

        </Fragment>
    )
};
export default ProjectPage;





