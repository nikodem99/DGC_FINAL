import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll'
import './style.css'

const Scrollbar = () => {

    return(
        <div className="col-lg-12">
            <div className="header-menu">
                <ul className="smothscroll">
                    {/* Nazwa dla czytnika ekranu. Cala tresc tego odnosnika to ikona
                        z fontu, wiec bez aria-label czytnik oglasza "odnosnik" i nic
                        wiecej — na kazdej z 469 podstron. */}
                    <li><AnchorLink href='#scrool' aria-label="Wróć na górę strony"><i className="ti-arrow-up" aria-hidden="true"></i></AnchorLink></li>
                </ul>
            </div>
        </div>
        
    )
}

export default Scrollbar;
