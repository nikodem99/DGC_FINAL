import React from 'react'
import {Link} from 'react-router-dom'


// Strona pokazywana pod nieistniejacym adresem. Teksty byly po angielsku,
// prosto z kupionego szablonu, choc cala warstwa meta tej strony jest po
// polsku od poczatku. Doklejamy tez odnosnik do porad: najczesciej trafia
// tu ktos ze starego linku do artykulu, ktorego nie przenieslismy.
//
// Bylo tu jeszcze zdjecie error-404.png z szablonu — szary prostokat
// z napisem "700X500". Zamiast szukac zastepnika, nie ma go wcale: na
// stronie bledu liczy sie zdanie, co dalej, a nie ilustracja.
const Error = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }

    return(
        <section className="error-404-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="content clearfix">
                            <div className="error-message">
                                <h3>Nie znaleźliśmy takiej strony</h3>
                                <p>
                                    Adres może być wpisany z literówką albo strona została
                                    przeniesiona. Zajrzyj na stronę główną lub do porad —
                                    jest tam ponad 370 artykułów o księgowości, podatkach
                                    i kadrach.
                                </p>
                                <Link onClick={ClickHandler} to="/" className="theme-btn">Strona główna</Link>
                                <Link onClick={ClickHandler} to="/porady/" className="theme-btn bl-404-porady">Przejdź do porad</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Error;