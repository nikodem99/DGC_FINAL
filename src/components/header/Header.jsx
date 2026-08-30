import React from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import offerMenu from '../../api/offerMenu';


const Header = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (
        <header id="header">
            <div className={"" + props.hclass}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <MobileMenu />
                            </div>
                            <div className="col-lg-2 col-md-6 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/home"><img src={props.Logo}
                                        alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-10 col-md-3 col-3">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li><Link onClick={ClickHandler} to="/home">Strona główna</Link></li>
                                        <li><Link onClick={ClickHandler} to="/about">O nas</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/oferta/">Oferta</Link>
                                            <ul className="sub-menu">
                                                {offerMenu.map((item) => (
                                                    <li key={item.link}>
                                                        <Link onClick={ClickHandler} to={item.link}>{item.title}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/blog">Porady</Link></li>
                                        <li><Link onClick={ClickHandler} to="/contact">Kontakt</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;
