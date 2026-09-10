import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import PageTitle from '../../components/pagetitle/PageTitle.jsx';
import Footer from '../../components/footer/Footer.jsx';
import Scrollbar from '../../components/scrollbar/scrollbar.jsx';
import KonsultacjaForm from '../../components/KonsultacjaForm/KonsultacjaForm.jsx';
import { KONTAKT } from '../../api/kontakt';
import {
    CENA, CZAS_TRWANIA, KROKI, CO_ZYSKUJESZ, JAK_SIE_PRZYGOTOWAC,
} from '../../api/konsultacje';
import logo from '../../images/logo.svg';

// Podstrona /umow-konsultacje.
//
// Celowo NIE ma jej w menu ani w stopce — prowadzi do niej tylko przycisk
// "Umów konsultację" ze strony glownej i docelowo reklamy. Nie jest jednak
// ukryta przed wyszukiwarka, bo ma sluzyc jako strona docelowa kampanii.
//
// Uklad tresci wynika z tego, ze konsultacja jest platna, a strona nie
// przyjmuje platnosci. Zanim ktokolwiek zobaczy formularz, musi wiedziec,
// ile to kosztuje i co sie stanie po wyslaniu — stad kolejnosc:
// po co to jest → ile kosztuje → jak przebiega → dopiero formularz.

const KonsultacjaPage = () => {
    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={'Umów konsultację'} pagesub={'Konsultacje'} />

            <section className="konsultacja_section section-padding">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="konsultacja_wstep">
                                <h2>Godzina rozmowy zamiast domysłów</h2>
                                <p>
                                    Konsultacja to indywidualna rozmowa o Twojej sytuacji: formie
                                    opodatkowania, rozliczeniach, kadrach albo planowanej zmianie
                                    w firmie. Odpowiadamy na konkretne pytania i mówimy, co zrobić
                                    dalej. Nie musisz być naszym klientem, żeby z niej skorzystać.
                                </p>

                                <div className="konsultacja_fakty">
                                    <div className="konsultacja_cena">
                                        <span className="konsultacja_cena_kwota">{CENA.kwota}</span>
                                        <span className="konsultacja_cena_opis">{CENA.jednostka}</span>
                                        <p>{CENA.uwaga}</p>
                                    </div>
                                    <ul className="konsultacja_fakty_lista">
                                        <li><strong>Czas trwania</strong><span>{CZAS_TRWANIA}</span></li>
                                        <li><strong>Forma</strong><span>telefon, wideo lub biuro w Łodzi</span></li>
                                        <li><strong>Dostępność</strong><span>{KONTAKT.godziny}</span></li>
                                        <li><strong>Płatność</strong><span>przelewem, po potwierdzeniu</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="konsultacja_kroki">
                                <h3>Jak to działa</h3>
                                <ol>
                                    {KROKI.map((krok, i) => (
                                        <li key={krok.tytul}>
                                            <span className="konsultacja_krok_nr">{i + 1}</span>
                                            <div>
                                                <strong>{krok.tytul}</strong>
                                                <p>{krok.opis}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="konsultacja_kolumny">
                                <div>
                                    <h3>Co z tego masz</h3>
                                    <ul>
                                        {CO_ZYSKUJESZ.map((poz) => <li key={poz}>{poz}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3>Jak się przygotować</h3>
                                    <ul>
                                        {JAK_SIE_PRZYGOTOWAC.map((poz) => <li key={poz}>{poz}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="cta_form_s2" id="formularz">
                                <div className="title">
                                    <h3>Zgłoś się na konsultację</h3>
                                    <p>
                                        Wypełnij formularz, a oddzwonimy w ciągu 24 godzin roboczych,
                                        żeby potwierdzić termin i cenę.
                                    </p>
                                </div>
                                <KonsultacjaForm />
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <p className="konsultacja_stopka">
                                Wolisz porozmawiać od razu? Zadzwoń:{' '}
                                <a href={KONTAKT.telefonHref}>{KONTAKT.telefon}</a>,{' '}
                                {KONTAKT.godziny}. Jeśli Twoja sprawa nie wymaga płatnej
                                konsultacji, powiemy to wprost i skierujemy Cię do{' '}
                                <a href={`mailto:${KONTAKT.email}`}>zwykłego kontaktu</a>.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    );
};

export default KonsultacjaPage;
