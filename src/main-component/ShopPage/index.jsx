import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";

import PageTitle from "../../components/pagetitle/PageTitle";
import ShopProduct from "../../components/ShopProduct";
import Navbar from "../../components/Navbar/Navbar";
import CtafromSection from "../../components/CtafromSection/CtafromSection";
import Footer from "../../components/footer/Footer";
import Scrollbar from "../../components/scrollbar/scrollbar";

import api from "../../api";
import Logo from "../../images/logo-2.svg";

import { addToCart } from "../../store/slices/cartSlice";

const ShopPage = () => {
  const dispatch = useDispatch();

  const productsArray = api();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const totalProducts = productsArray.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentProducts = productsArray.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const addToCartProduct = (product, qty = 1) => {
    dispatch(addToCart({ ...product, qty }));
  };

  return (
    <Fragment>
      <Navbar hclass="wpo-site-header wpo-site-header-s2" Logo={Logo} />

      <PageTitle pageTitle="Shop" pagesub="Shop" />

      <section className="shop_section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              <ShopProduct
                products={currentProducts}
                addToCartProduct={addToCartProduct}
              />

              {/* PAGINATION */}
              <div className="pagination-wrapper pagination-wrapper-center">
                <ul className="pg-pagination">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous"
                    >
                      <i className="ti-angle-left"></i>
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <li
                        key={page}
                        className={currentPage === page ? "active" : ""}
                      >
                        <button onClick={() => handlePageChange(page)}>
                          {page}
                        </button>
                      </li>
                    );
                  })}

                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next"
                    >
                      <i className="ti-angle-right"></i>
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      <CtafromSection hclass="ctafrom_section" />
      <Footer hclass="wpo-site-footer" />
      <Scrollbar />
    </Fragment>
  );
};

export default ShopPage;
