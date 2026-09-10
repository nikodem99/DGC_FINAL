import React, { Fragment } from 'react';
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import BlogSingle from '../../components/BlogDetails/BlogSingle.jsx'
import Scrollbar from '../../components/scrollbar/scrollbar.jsx'
import { useParams } from 'react-router-dom'
import blogs from '../../api/blogs.js'
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/footer/Footer.jsx';
import logo from '../../images/logo.svg';

const BlogDetailsLeftSiide = () => {

    const { slug } = useParams()
    const BlogDetails = blogs.find(item => item.slug === slug)
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={BlogDetails.title} pagesub={'Blog'} />
            <BlogSingle blLeft={'order-lg-1'} blRight={'order-lg-2'} />
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default BlogDetailsLeftSiide;


