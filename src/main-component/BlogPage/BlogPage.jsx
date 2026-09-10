import React, { Fragment } from 'react';
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import NewsletterSection from '../../components/Newsletter/NewsletterSection.jsx';
import BlogList from '../../components/BlogList/BlogList.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';
import logo from '../../images/logo.svg';

const BlogPage = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={'Porady'} pagesub={'Porady'} />
            <BlogList />
            <NewsletterSection />
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default BlogPage;

