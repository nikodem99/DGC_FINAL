import React, { Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import PageTitle from '../../components/pagetitle/PageTitle.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';
import Logo from '../../images/logo.svg';
import { SEKCJE } from '../../api/politykaPrywatnosci';

const PolitykaPrywatnosciPage = () => {
    // Przewiniecie do sekcji wskazanej w adresie, np. /polityka-prywatnosci/#klauzule.
    //
    // react-router NIE robi tego sam: przy przejsciu wewnatrz aplikacji
    // przegladarka nie przeladowuje strony, wiec nie obsluguje kotwicy.
    // Odnosnik "Klauzule informacyjne" w stopce ladowal przez to na samej
    // gorze dokumentu, a sekcja jest w dwoch trzecich dlugosci.
    //
    // Czekamy jedna klatke, bo przy wejsciu z zewnatrz sekcje jeszcze sie
    // nie wyrenderowaly w chwili uruchomienia efektu.
    const { hash } = useLocation();
    useEffect(() => {
        if (!hash) return undefined;
        const id = decodeURIComponent(hash.slice(1));

        // Ponawiamy, a nie strzelamy raz. Przy WEJSCIU Z ZEWNATRZ jedna klatka
        // wystarcza, ale przy przejsciu WEWNATRZ aplikacji (klikniecie
        // w stopce) dokument nie jest jeszcze rozlozony i pojedyncze
        // scrollIntoView konczylo sie na samej gorze strony. Zmierzone:
        // po kliknieciu scrollY zostawalo 0, a sekcja byla 5643 px nizej.
        //
        // Warunek konca: sekcja stoi blisko gory okna. .polityka_sekcja ma
        // scroll-margin-top: 120px, wiec celujemy ponizej 200.
        let proby = 0;
        let czasomierz;
        const sprobuj = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ block: 'start' });
                if (Math.abs(el.getBoundingClientRect().top) < 200) return;
            }
            if (++proby < 12) czasomierz = setTimeout(sprobuj, 60);
        };
        czasomierz = setTimeout(sprobuj, 0);
        return () => clearTimeout(czasomierz);
    }, [hash]);

    return (
        <Fragment>
            <Navbar hclass={'dgc-site-header dgc-site-header-s2'} Logo={Logo} />
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
                                    {s.pliki && (
                                        <ul className="polityka_pliki">
                                            {s.pliki.map((pl) => (
                                                <li key={pl.adres}>
                                                    {/* download, nie nowa karta: to dokument do zachowania,
                                                        a nie strona do przeczytania. Typ i rozszerzenie
                                                        podane w nazwie, zeby czytnik ekranu zapowiedzial,
                                                        co sie zaraz pobierze. */}
                                                    <a href={pl.adres} download>
                                                        {pl.nazwa} <span className="polityka_plik_typ">(PDF)</span>
                                                    </a>
                                                    {pl.opis && <span className="polityka_plik_opis">{pl.opis}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {s.akapityPo?.map((a, i) => <p key={`po-${i}`}>{a}</p>)}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer hclass={'dgc-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    );
};

export default PolitykaPrywatnosciPage;
