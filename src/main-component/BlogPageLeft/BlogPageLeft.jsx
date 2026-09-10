import React, { Fragment } from 'react';
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import BlogList from '../../components/BlogList/BlogList.jsx'
import Scrollbar from '../../components/scrollbar/scrollbar.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import logo from '../../images/logo.svg';

const BlogPageLeft = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={'Latest News'} pagesub={'Blog'} />
            <BlogList blLeft={'order-lg-1'} blRight={'order-lg-2'} />
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default BlogPageLeft;

