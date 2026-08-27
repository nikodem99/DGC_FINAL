import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx'
import PageTitle from '../../components/pagetitle/PageTitle.jsx'
import Scrollbar from '../../components/scrollbar/scrollbar.jsx'
import { useParams } from 'react-router-dom'
import blogs from '../../api/blogs.js'
import BlogSingle from '../../components/BlogDetails/BlogSingle.jsx'
import Footer from '../../components/footer/Footer.jsx';
import logo from '../../images/logo-2.svg';

const BlogDetails = (props) => {

    const { slug } = useParams()
    const BlogDetails = blogs.find(item => item.slug === slug)

    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={BlogDetails.title} pagesub={'Blog Single'} />
            <BlogSingle />
            <Footer hclass={"wpo-site-footer_s2"}/>
            <Scrollbar />
        </Fragment>
    )
};
export default BlogDetails;
