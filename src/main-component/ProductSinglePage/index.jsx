import React, {Fragment, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Product from './product'
import api from "../../api";
import ProductTabs from './alltab';
import Footer from '../../components/footer/Footer';
import logo from '../../images/logo.svg';


const ProductSinglePage =(props) => {
    const { slug } = useParams();
    const dispatch = useDispatch();

    const products = api();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const found = products.find((p) => String(p.slug) === String(slug));
        setProduct(found || null);
    }, [slug, products]);

    const addToCartProduct = (item, qty = 1) => {
        dispatch(addToCart({ ...item, qty }));
    };

    return(
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
            <PageTitle pageTitle={'Shop Single'} pagesub={'Shop Single'}/> 
            <section className="shop_single section-padding">
                <div className="container">
                    {product && (
                        <Product item={product} addToCart={addToCartProduct} />
                    )}
                    <ProductTabs/>
                </div>
            </section>
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar/>
        </Fragment>
    )
};

export default ProductSinglePage;
