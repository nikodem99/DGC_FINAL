import React, { Fragment, useState } from 'react';
import Collapse from "@mui/material/Collapse";
import { NavLink } from "react-router-dom";
import offerMenu from '../../api/offerMenu';
import './style.css';

const menus = [
    {
        id: 1,
        title: 'Strona główna',
        link: '/',
    },
    {
        id: 88,
        title: 'O nas',
        link: '/o-nas/',
    },
    {
        id: 7,
        title: 'Oferta',
        link: '/oferta/',
        submenu: offerMenu,
    },
    {
        id: 6,
        title: 'Cennik',
        link: '/cennik/',
    },
    {
        id: 5,
        title: 'Porady',
        link: '/porady/',
    },
    {
        id: 89,
        title: 'Kontakt',
        link: '/kontakt/',
    }


]


// UWAGA na historie tego pliku: szablon importowal ListItem z
// "@mui/material/List", czyli ten sam komponent co List. Kazda pozycja menu
// renderowala sie wiec jako <ul>, a nie <li>. Skutki byly dwa: znaczniki byly
// niepoprawne (<ul> w <ul> bez <li>, <a> bezposrednio w <ul>) i — wazniejsze —
// caly blok stylow ".responsivemenu li a" nigdy sie nie stosowal, przez co
// odnosniki mialy display: inline, zero paddingu i 16px wysokosci dotyku.
// Dlatego uzywamy tu zwyklych <li> i <ul> zamiast komponentow MUI.
const MobileMenu = () => {

    const [openId, setOpenId] = useState(0);
    const [menuActive, setMenuState] = useState(false);

    // Klikniecie pozycji menu musi je zamknac. Bez tego panel zostawal
    // otwarty nad nowa podstrona i trzeba go bylo zamykac recznie krzyzykiem.
    const ClickHandler = () => {
        setMenuState(false);
        setOpenId(0);
        window.scrollTo(10, 0);
    }

    return (
        <div>
            <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">
                    {menus.map((item, mn) => {
                        return (
                            <li className={item.id === openId ? 'active' : null} key={mn}>
                                {item.submenu ?
                                    <Fragment>
                                        <p onClick={() => setOpenId(item.id === openId ? 0 : item.id)}>{item.title}
                                            <i className={item.id === openId ? 'fa fa-angle-up' : 'fa fa-angle-down'}></i>
                                        </p>
                                        <Collapse in={item.id === openId} timeout="auto" unmountOnExit>
                                            <ul className="subMenu">
                                                {item.submenu.map((submenu, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <NavLink onClick={ClickHandler} className="active"
                                                                to={submenu.link}>{submenu.title}</NavLink>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </Collapse>
                                    </Fragment>
                                    : <NavLink onClick={ClickHandler} className="active"
                                        to={item.link}>{item.title}</NavLink>
                                }
                            </li>
                        )
                    })}
                </ul>

            </div>

            <div className="showmenu mobail-menu" onClick={() => setMenuState(!menuActive)}>
                <button type="button" className="navbar-toggler open-btn">
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
        </div>
    )
}

export default MobileMenu;
