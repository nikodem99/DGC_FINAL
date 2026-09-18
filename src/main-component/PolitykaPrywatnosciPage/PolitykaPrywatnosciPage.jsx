import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import PageTitle from '../../components/pagetitle/PageTitle.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';
import Logo from '../../images/logo.svg';
import { SEKCJE } from '../../api/politykaPrywatnosci';

const PolitykaPrywatnosciPage = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'Polityka prywatności'} pagesub={'Polityka prywatności'} />

            <main className="polityka_page section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-12">
                            <nav className="polityka_spis" aria-label="Spis treści">
                                <h2>Na tej stronie</h2>
                                <ol>
                                    {SEKCJE.map((s) => (
                                        <li key={s.id}><a href={`#${s.id}`}>{s.tytul}</a></li>
                                    ))}
                                </ol>
                            </nav>

                            {SEKCJE.map((s) => (
                                <section className="polityka_sekcja" id={s.id} key={s.id}>
                                    <h2>{s.tytul}</h2>
                                    {s.akapity?.map((a, i) => <p key={i}>{a}</p>)}
                                    {s.lista && (
                                        <ul>
                                            {s.lista.map((l, i) => <li key={i}>{l}</li>)}
                                        </ul>
                                    )}
                                    {s.akapityPo?.map((a, i) => <p key={`po-${i}`}>{a}</p>)}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    );
};

export default PolitykaPrywatnosciPage;
