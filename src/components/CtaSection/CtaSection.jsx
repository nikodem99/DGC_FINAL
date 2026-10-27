import React from 'react';
import { uzyjTresci } from '../../api/tresciStron.js';

// Szablon mial tu "Available 24/7" i amerykanski numer z puli zastrzezonej
// dla fikcji filmowej (555). DGC pracuje pon.-pt. 8:00-16:00 — obietnica
// calodobowej dostepnosci na stronie biura rachunkowego to zapowiedz,
// ktorej nikt nie dotrzyma.
// Po prawej stal kiedys obrazek: pionowy znak DGC na bialej karcie, wcinajacej
// sie w zielony panel. Zdjety 27.10.2026 na prosbe klienta — znak marki stoi juz
// w naglowku i w stopce, a bialy prostokat w srodku kolorowego pasa psul go
// bardziej, niz cokolwiek wnosil.
//
// Usuniecie jest bezpieczne, bo .image bylo pozycjonowane absolutnie
// (position: absolute; right: 30px; bottom: 0 — src/sass/page/_home-default.scss),
// wiec nie wnosilo nic do wysokosci panelu. Prawa strone wypelnia teraz znak
// wodny kalendarza (.shape-icon), ktory i tak tam lezal, tylko przyslaniany.
// Ten uklad byl juz sprawdzony: ponizej 768 px obrazka nie bylo od poczatku
// (display: none), czyli telefony ogladaly ta wersje od dnia uruchomienia.
const CtaSection = (props) => {
    const KONTAKT = uzyjTresci('kontakt');
    return (
        <section className={"" + props.tClass}>
            <div className="container">
                <div className="cta_wrapper">
                    <div className="content">
                        <div className="icon">
                            <i className="flaticon-phone-call"></i>
                        </div>
                        <div className="text">
                            <h2>Zadzwoń do nas</h2>
                            {/* numer jako link — na telefonie jedno tkniecie dzwoni */}
                            <h3><a href={KONTAKT.telefonHref}>{KONTAKT.telefon}</a></h3>
                            <p className="cta_godziny">{KONTAKT.godziny}</p>
                        </div>
                    </div>
                    <div className="shape-icon">
                        <i className="flaticon-deadline"></i>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
