import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import CheckoutSection from '../../components/CheckoutSection'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useSelector } from "react-redux";
import Footer from '../../components/footer/Footer';
import logo from '../../images/logo.svg';

const CheckoutPage =() => {

     const cartList = useSelector((state) => state.cart.cart);

    return(
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={'Checkout'} pagesub={'Checkout'}/> 
            <CheckoutSection cartList={cartList}/>
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar/>
        </Fragment>
    )
};

export default CheckoutPage;
