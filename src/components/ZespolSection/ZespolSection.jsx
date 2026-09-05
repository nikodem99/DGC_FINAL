import React from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import ZdjecieZespolu from '../../images/zespol.jpg';
import { ZESPOL_OPIS, ZAPEWNIAMY, BRANZE } from '../../api/zespol';

// Sekcja o zespole na /about. Tresc pochodzi z podstrony "Nasz zespół"
// starego serwisu — nie robimy z tego osobnej podstrony, bo caly material
// miesci sie tutaj i lepiej pracuje razem z opisem prezes powyzej.
const ZespolSection = ({ hclass = 'zespol_section section-padding' }) => {
    return (
        <section className={hclass}>
            <div className="container">
                <div className="row align-items-center zespol_glowna">
                    <div className="col-lg-5 col-12">
                        <div className="zespol_foto">
                            <img src={ZdjecieZespolu} alt="Zespół DGC Biuro Rachunkowe" />
                        </div>
                    </div>

                    <div className="col-lg-7 col-12">
                        <SectionTitle title={'Zespół'} subtitle={'Kto prowadzi Twoje księgi'} />
                        {ZESPOL_OPIS.map((a, i) => <p className="zespol_opis" key={i}>{a}</p>)}

                        <ul className="zespol_zapewniamy">
                            {ZAPEWNIAMY.map((z) => (
                                <li key={z.tytul}>
                                    <strong>{z.tytul}</strong>
                                    <span>{z.opis}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="zespol_branze">
                    <h3>Branże, które znamy od podszewki</h3>
                    {/* "między innymi" jest w zrodle i musi zostac — bez tego
                        lista przestaje byc przykladem, a staje sie deklaracja
                        pelnej specjalizacji. */}
                    <p>Od lat specjalizujemy się między innymi w obsłudze:</p>
                    <ul>
                        {BRANZE.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                    <p className="zespol_branze_stopka">
                        Obsługujemy też osoby prowadzące jednoosobową działalność
                        i osoby fizyczne rozliczające się indywidualnie.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ZespolSection;
