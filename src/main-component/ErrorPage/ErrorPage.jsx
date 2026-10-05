import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Error from '../../components/404/404'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'
const ErrorPage =() => {
    return(
        <Fragment>
            <Navbar hclass={'dgc-site-header dgc-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'404'} pagesub={'404'}/> 
            <Error/>
            <Footer hclass={'dgc-site-footer_s2'} />
            <Scrollbar/>
        </Fragment>
    )
};
export default ErrorPage;



