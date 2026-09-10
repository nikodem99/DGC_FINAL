import React, { Fragment } from "react";
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import logo from '../../images/logo.svg';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increment,
  decrement,
} from "../../store/slices/cartSlice";

import Footer from "../../components/footer/Footer";

const CartPage = (props) => {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.cart);

  const ClickHandler = () => window.scrollTo(10, 0);

  const totalPrice = carts.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <Fragment>
      <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={logo} />
      <PageTitle pageTitle={"Cart"} pagesub={"Cart"} />
      <div className="cart-area section-padding">
        <div className="container">
          <div className="form">
            <div className="cart-wrapper">
              <div className="row">
                <div className="col-12">

                  <table className="table-responsive cart-wrap">
                    <thead>
                      <tr>
                        <th className="images images-b">Image</th>
                        <th className="product-2">Product Name</th>
                        <th className="pr">Quantity</th>
                        <th className="ptice">Price</th>
                        <th className="stock">Total Price</th>
                        <th className="remove remove-b">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {carts.map((item, index) => (
                        <tr key={index}>
                          <td className="images">
                            <img src={item.proImg} alt="" />
                          </td>

                          <td className="product">
                            <ul>
                              <li className="first-cart">{item.title}</li>
                              {item.brand && <li>Brand : {item.brand}</li>}
                              {item.size && <li>Size : {item.size}</li>}
                            </ul>
                          </td>

                          <td className="stock">
                            <div className="pro-single-btn">
                              <div className="quantity cart-plus-minus">
                                <button
                                  className="dec qtybutton"
                                  onClick={() => dispatch(decrement(item.id))}
                                >
                                  -
                                </button>

                                <input
                                  type="text"
                                  value={item.qty}
                                  readOnly
                                />

                                <button
                                  className="inc qtybutton"
                                  onClick={() => dispatch(increment(item.id))}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="ptice">${item.price}</td>
                          <td className="stock">
                            ${item.qty * item.price}
                          </td>

                          <td className="action">
                            <ul>
                              <li
                                className="w-btn"
                                onClick={() =>
                                  dispatch(removeFromCart(item.id))
                                }
                              >
                                <i className="fi ti-trash"></i>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* ACTION BUTTONS */}
                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/shop"
                        >
                          Continue Shopping
                        </Link>
                      </li>
                      <li>
                        <button type="button">Update Cart</button>
                      </li>
                    </ul>
                  </div>

                  {/* TOTAL */}
                  <div className="cart-product-list">
                    <ul>
                      <li>
                        Total product<span>( {carts.length} )</span>
                      </li>
                      <li>
                        Sub Price<span>${totalPrice}</span>
                      </li>
                      <li>Vat<span>$0</span></li>
                      <li>Eco Tax<span>$0</span></li>
                      <li>Delivery Charge<span>$0</span></li>
                      <li className="cart-b">
                        Total Price<span>${totalPrice}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/checkout"
                        >
                          Proceed to Checkout
                        </Link>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer hclass={'wpo-site-footer_s2'} />
      <Scrollbar />
    </Fragment>
  );
};

export default CartPage;