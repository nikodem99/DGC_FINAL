import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import BlogList from '../../components/BlogList/BlogList.jsx'
import Scrollbar from '../../components/scrollbar/scrollbar.jsx'
import Footer from '../../components/footer/Footer.jsx';

import logo from '../../images/logo-2.svg';

const BlogPageFullwidth = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={'Latest News'} pagesub={'Blog'}/> 
            <BlogList blLeft={'d-none'} blRight={'col-lg-10 offset-lg-1'}/>
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar/>
        </Fragment>
    )
};
export default BlogPageFullwidth;

