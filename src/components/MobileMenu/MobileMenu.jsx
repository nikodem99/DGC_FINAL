import React, { Fragment, useState } from 'react';
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

    // Identyfikator panelu, zeby hamburger mogl na niego wskazac.
    const idPanelu = React.useId();

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
            <div className={`mobileMenu ${menuActive ? "show" : ""}`} id={idPanelu}>
                <div className="menu-close">
                    {/* Bylo <div onClick>: poza kolejnoscia Tab, bez reakcji na
                        Enter i bez nazwy. Krzyzyk to jedyny sposob zamkniecia
                        menu poza wybraniem pozycji. */}
                    <button
                        type="button"
                        className="clox"
                        aria-label="Zamknij menu"
                        onClick={() => setMenuState(false)}
                    >
                        <i className="ti-close" aria-hidden="true"></i>
                    </button>
                </div>

                <ul className="responsivemenu">
                    {menus.map((item, mn) => {
                        return (
                            <li className={item.id === openId ? 'active' : null} key={mn}>
                                {item.submenu ?
                                    <Fragment>
                                        {/* Bylo <p onClick>. Teraz przycisk, wiec pozycja
                                            jest w kolejnosci Tab, reaguje na Enter i spacje,
                                            a czytnik mowi, czy podmenu jest rozwiniete. */}
                                        <button
                                            type="button"
                                            aria-expanded={item.id === openId}
                                            aria-controls={`${idPanelu}-podmenu-${item.id}`}
                                            onClick={() => setOpenId(item.id === openId ? 0 : item.id)}
                                        >
                                            {item.title}
                                            <i className={item.id === openId ? 'fa fa-angle-up' : 'fa fa-angle-down'} aria-hidden="true"></i>
                                        </button>
                                        {/* Bylo tu <Collapse> z MUI z unmountOnExit, czyli
                                            szesc odnosnikow do podstron oferty nie istnialo
                                            w dokumencie, dopoki ktos nie rozwinal podmenu —
                                            ani dla czytnika, ani dla wyszukiwarki.

                                            Zwykly <ul> z atrybutem hidden zamiast MUI: tamten
                                            komponent renderuje sie przez emotion, ktore przy
                                            prerenderowaniu w Node nie ma zainicjowanej pamieci
                                            podrecznej i wywracalo budowanie. Przy okazji z
                                            paczki znika kolejny kawalek MUI. */}
                                        <ul
                                            className="subMenu"
                                            id={`${idPanelu}-podmenu-${item.id}`}
                                            hidden={item.id !== openId}
                                        >
                                            {item.submenu.map((submenu, i) => {
                                                return (
                                                    <li key={i}>
                                                        <NavLink onClick={ClickHandler} className="active"
                                                            to={submenu.link}>{submenu.title}</NavLink>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </Fragment>
                                    : <NavLink onClick={ClickHandler} className="active"
                                        to={item.link}>{item.title}</NavLink>
                                }
                            </li>
                        )
                    })}
                </ul>

            </div>

            {/* onClick siedzial na otaczajacym <div>, wiec fokus z klawiatury
                trafial na przycisk, ktory nic nie robil. Przycisk nie mial tez
                zadnej nazwy — jego cala tresc to trzy kreski ze <span>. */}
            <div className="showmenu mobail-menu">
                <button
                    type="button"
                    className="navbar-toggler open-btn"
                    aria-label={menuActive ? 'Zamknij menu' : 'Otwórz menu'}
                    aria-expanded={menuActive}
                    aria-controls={idPanelu}
                    onClick={() => setMenuState(!menuActive)}
                >
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
        </div>
    )
}

export default MobileMenu;
