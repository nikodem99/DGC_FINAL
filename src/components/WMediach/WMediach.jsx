import React, { useState } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import miniatura from '../../images/wywiad-radio-parada.jpg';
import './style.scss';

// Rozmowa z prezes DGC w Radiu Parada, osadzona z YouTube.
//
// NIE osadzamy tego zwyklym <iframe>. Zwykly iframe YouTube wysyla dane do
// Google natychmiast po wejsciu na strone, jeszcze zanim ktokolwiek kliknie
// odtwarzanie. Polityka prywatnosci tego serwisu mowi wprost, ze strona nie
// sledzi zachowania odwiedzajacych — zwykly iframe czynilby to zdanie
// nieprawdziwym.
//
// Zamiast tego: miniatura trzymana na NASZYM serwerze (pobranie jej z
// i.ytimg.com mialoby ten sam skutek co iframe) i odtwarzacz wczytywany
// dopiero po klknieciu, z domeny youtube-nocookie.com. Do Google nie idzie
// zadne zapytanie, dopoki uzytkownik sam nie zdecyduje. Przy okazji strona
// nie ciagnie na starcie kilkuset kilobajtow odtwarzacza.
const ID_FILMU = 'YOTtY6srKUs';

const WMediach = ({ hclass = 'wmediach_section section-padding' }) => {
    const [gra, setGra] = useState(false);

    return (
        <section className={hclass} aria-labelledby="wmediach-tytul">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <SectionTitle
                            title={'W mediach'}
                            subtitle={'O zmianach w podatkach na antenie'}
                            subtitleId="wmediach-tytul"
                        />
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <div className="wmediach_ramka">
                            {gra ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${ID_FILMU}?autoplay=1&rel=0`}
                                    title="Rozmowa z prezes DGC Biuro Rachunkowe w Radiu Parada"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <button
                                    type="button"
                                    className="wmediach_zaslona"
                                    onClick={() => setGra(true)}
                                    aria-label="Odtwórz rozmowę w Radiu Parada. Film wczyta się z serwisu YouTube."
                                >
                                    <img
                                        src={miniatura}
                                        alt="Danuta Grabińska-Chłopaś podczas rozmowy w studiu Radia Parada"
                                        width="960"
                                        height="540"
                                        loading="lazy"
                                    />
                                    <span className="wmediach_play" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <p className="wmediach_podpis">
                            Danuta Grabińska-Chłopaś, prezes zarządu DGC, w Radiu Parada 96,0 FM
                            o zmianach w rozliczeniach VAT i o tym, co powinni o nich wiedzieć
                            przedsiębiorcy.
                        </p>
                        {!gra && (
                            <p className="wmediach_zastrzezenie">
                                Odtworzenie wczyta film z serwisu YouTube. Do tego momentu
                                nie wysyłamy tam żadnych danych.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WMediach;
