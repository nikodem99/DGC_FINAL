import React from 'react';
import FormSection from '../FormSection/FormSection';
import { KONTAKT } from '../../api/kontakt';

// Adres, telefon, godziny i mapa pochodza z biurodgc.pl. Szablon mial tu
// adres w Indianie, dwa razy ten sam medically@gmail.com, amerykanskie
// numery i mape Nowego Jorku.
const ADRES = {
    ulica: 'ul. Brukowa 8',
    miasto: '91-341 Łódź',
};

// Mapa. Osadzenie z biurodgc.pl (format ?pb=) pokazywalo sam wycinek mapy
// bez pinezki, a "Otwórz w Mapach" prowadzilo do samych wspolrzednych.
// Format ?q= z adresem stawia znacznik i przenosi to samo zapytanie do Map.
//
// Sprawdzone: wariant ze wspolrzednymi i wlasna etykieta w nawiasie —
// "51.7977303,19.4095675 (DGC Biuro Rachunkowe)" — Google przy output=embed
// ignoruje. Zwraca wtedy pusta mape bez znacznika. Dlatego etykieta przy
// pinezce to nazwa wizytowki w Google i da sie ja zmienic tylko w Profilu
// Firmy, nie stad.
const ADRES_ZAPYTANIE = `DGC Biuro Rachunkowe Sp. z o.o., ${ADRES.ulica}, ${ADRES.miasto}`;
const MAPA = `https://maps.google.com/maps?q=${encodeURIComponent(ADRES_ZAPYTANIE)}&z=16&hl=pl&output=embed`;

const Contactpage = () => {

    return (
        <section className="wpo-contact-pg-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-10 offset-lg-1">
                        <div className="office-info">
                            <div className="row">
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-location-1"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Adres</h2>
                                            <p>{ADRES.ulica}</p>
                                            <p>{ADRES.miasto}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-phone-call"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Telefon</h2>
                                            <p><a href={KONTAKT.telefonHref}>{KONTAKT.telefon}</a></p>
                                            <p>{KONTAKT.godziny}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-email"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>E-mail</h2>
                                            {/* Bez dopisku o czasie odpowiedzi — lamal sie na dwie
                                                linie i wydluzal kafel wzgledem pozostalych, a to samo
                                                zdanie stoi juz nad formularzem nizej. */}
                                            <p><a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FormSection
                zrodlo="strona-kontaktu"
                title={'Kontakt'}
                subtitle={'Napisz do nas'}
                lead={'Opisz krótko, czego potrzebujesz. Odpowiemy w ciągu 24 godzin roboczych. Jeśli sprawa jest pilna, zadzwoń.'}
            />

            <section className="wpo-contact-map-section">
                <div className="wpo-contact-map">
                    {/* Mapa laduje sie razem ze strona — decyzja klienta.
                        Nie jest kategoria w banerze cookies; opisana jest
                        w polityce prywatnosci. referrerPolicy ogranicza to,
                        co Google dostaje: bez niej szedl pelny adres podstrony. */}
                    <iframe
                        title="Mapa dojazdu do biura DGC przy ul. Brukowej 8 w Łodzi"
                        src={MAPA}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    ></iframe>
                </div>
            </section>
        </section>
    )

}

export default Contactpage;
