import React, { useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';
import { KOMUNIKATY, WALIDATORY } from '../../lib/walidacja';
import {
    TEMATY_KONSULTACJI,
    FORMY_KONSULTACJI,
    FORMY_DZIALALNOSCI,
    PRZEDZIALY,
} from '../../api/konsultacje';

// Formularz umawiania konsultacji. Glebszy niz pozostale formularze strony,
// bo poza kontaktem zbiera termin, pore dnia i forme spotkania — pracownik
// dzwoni juz z konkretem, zamiast dopiero ustalac, kiedy moze zadzwonic.
//
// Markup celowo taki sam jak w formularzu na podstronach oferty
// (.form_item + .input-fild + etykieta nad polem), zeby cala oprawa wizualna
// przyszla z .cta_form_s2 i nie trzeba bylo pisac drugiego zestawu stylow.

const PUSTY = {
    name: '', email: '', phone: '', company: '',
    dzialalnosc: '', subject: '', forma: '',
    data: '', przedzial: '', message: '', _gotcha: '',
};

// Data w formacie pola <input type="date">, czyli RRRR-MM-DD, liczona
// lokalnie. new Date().toISOString() dalby UTC i w Polsce wieczorem
// wskazywalby wczorajszy dzien.
const dzisiaj = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
};

// Biuro pracuje pon.–pt., wiec sobota i niedziela nie maja sensu jako
// preferowany termin. Pole jest tylko preferencja — termin potwierdza
// pracownik telefonicznie — ale lepiej powiedziec to od razu niz dzwonic
// i przestawiac.
const WALIDATORY_TERMINU = {
    ...WALIDATORY,
    dzien_roboczy: {
        message: 'Wybierz dzień od poniedziałku do piątku',
        rule: (wartosc) => {
            if (!wartosc) return false;
            const dzien = new Date(`${wartosc}T12:00:00`).getDay();
            return dzien >= 1 && dzien <= 5;
        },
    },
    nie_w_przeszlosci: {
        message: 'Wybierz dzisiejszą lub późniejszą datę',
        rule: (wartosc) => Boolean(wartosc) && wartosc >= dzisiaj(),
    },
};

const KonsultacjaForm = ({ zrodlo = 'umow-konsultacje' }) => {
    const [forms, setForms] = useState(PUSTY);
    const [wysylka, setWysylka] = useState(false);
    const [wyslane, setWyslane] = useState(false);
    const [blad, setBlad] = useState(null);
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage',
        messages: KOMUNIKATY,
        validators: WALIDATORY_TERMINU,
    }));
    // SimpleReactValidator trzyma stan bledow poza Reactem, wiec samo
    // showMessages() niczego nie przerysuje. Licznik wymusza render.
    const [, przerysuj] = useState(0);

    const zmiana = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value });
        if (validator.allValid()) {
            validator.hideMessages();
        } else {
            validator.showMessages();
        }
    };

    const wyslij = async (e) => {
        e.preventDefault();
        setWyslane(false);
        setBlad(null);

        if (!validator.allValid()) {
            validator.showMessages();
            przerysuj((n) => n + 1);
            return;
        }
        validator.hideMessages();

        // pole-pulapka na boty: czlowiek go nie widzi, wiec zostaje puste
        if (forms._gotcha) return;

        setWysylka(true);
        try {
            await sendLead({
                imie: forms.name.trim(),
                email: forms.email.trim(),
                telefon: forms.phone.trim(),
                firma: forms.company.trim(),
                formaDzialalnosci: forms.dzialalnosc,
                temat: forms.subject,
                formaKonsultacji: forms.forma,
                dataKonsultacji: forms.data,
                przedzial: forms.przedzial,
                wiadomosc: forms.message.trim(),
                zrodlo,
                strona: typeof window !== 'undefined' ? window.location.pathname : '',
            });
            setWyslane(true);
            setForms(PUSTY);
        } catch (err) {
            setBlad(err.message);
        } finally {
            setWysylka(false);
        }
    };

    return (
        <form onSubmit={wyslij} className="contact-validation-active" noValidate>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="k-imie">Imię i nazwisko</label>
                    <input id="k-imie" className="input-fild" type="text" name="name"
                        value={forms.name} onBlur={zmiana} onChange={zmiana}
                        placeholder="Jan Kowalski" />
                    {validator.message('name', forms.name, 'required|alpha_space')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="k-email">Adres e-mail</label>
                    <input id="k-email" className="input-fild" type="email" name="email"
                        value={forms.email} onBlur={zmiana} onChange={zmiana}
                        placeholder="jan@twojafirma.pl" />
                    {validator.message('email', forms.email, 'required|email')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="k-telefon">Telefon</label>
                    <input id="k-telefon" className="input-fild" type="tel" name="phone"
                        value={forms.phone} onBlur={zmiana} onChange={zmiana}
                        placeholder="601 234 567" />
                    {validator.message('phone', forms.phone, 'required|telefon_pl')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    {/* Nazwa firmy nieobowiazkowa — na konsultacje zglaszaja sie
                        tez osoby, ktore dopiero zakladaja dzialalnosc. */}
                    <label htmlFor="k-firma">Nazwa firmy <span className="etykieta_opc">(opcjonalnie)</span></label>
                    <input id="k-firma" className="input-fild" type="text" name="company"
                        value={forms.company} onBlur={zmiana} onChange={zmiana}
                        placeholder="Nazwa firmy" />
                </div>

                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="k-dzialalnosc">Forma działalności</label>
                    <select id="k-dzialalnosc" className="input-fild" name="dzialalnosc"
                        value={forms.dzialalnosc} onBlur={zmiana} onChange={zmiana}>
                        <option value="">Wybierz</option>
                        {FORMY_DZIALALNOSCI.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    {validator.message('dzialalnosc', forms.dzialalnosc, 'required')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="k-temat">Temat konsultacji</label>
                    <select id="k-temat" className="input-fild" name="subject"
                        value={forms.subject} onBlur={zmiana} onChange={zmiana}>
                        <option value="">Wybierz temat</option>
                        {TEMATY_KONSULTACJI.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {validator.message('subject', forms.subject, 'required')}
                </div>

                <div className="col-lg-4 col-md-6 col-12 form_item">
                    <label htmlFor="k-forma">Forma spotkania</label>
                    <select id="k-forma" className="input-fild" name="forma"
                        value={forms.forma} onBlur={zmiana} onChange={zmiana}>
                        <option value="">Wybierz</option>
                        {FORMY_KONSULTACJI.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    {validator.message('forma', forms.forma, 'required')}
                </div>
                <div className="col-lg-4 col-md-6 col-12 form_item">
                    <label htmlFor="k-data">Preferowany dzień</label>
                    {/* min pilnuje przeszlosci w kalendarzu przegladarki,
                        a reguly walidatora lapia wpis z klawiatury. */}
                    <input id="k-data" className="input-fild" type="date" name="data"
                        min={dzisiaj()} value={forms.data} onBlur={zmiana} onChange={zmiana} />
                    {validator.message('data', forms.data, 'required|nie_w_przeszlosci|dzien_roboczy')}
                </div>
                <div className="col-lg-4 col-md-6 col-12 form_item">
                    <label htmlFor="k-przedzial">Preferowana pora</label>
                    <select id="k-przedzial" className="input-fild" name="przedzial"
                        value={forms.przedzial} onBlur={zmiana} onChange={zmiana}>
                        <option value="">Wybierz porę</option>
                        {PRZEDZIALY.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {validator.message('przedzial', forms.przedzial, 'required')}
                </div>

                <div className="col-12 form_item">
                    <label htmlFor="k-wiadomosc">Opisz swoją sprawę</label>
                    <textarea id="k-wiadomosc" className="input-fild" name="message"
                        value={forms.message} onBlur={zmiana} onChange={zmiana}
                        placeholder="Czego dotyczy pytanie? Im więcej szczegółów, tym lepiej przygotujemy się do rozmowy."></textarea>
                    {validator.message('message', forms.message, 'required')}
                </div>
            </div>

            {/* honeypot w postaci z dokumentacji Forminit */}
            <input type="hidden" name="_gotcha" value={forms._gotcha}
                onChange={zmiana} style={{ display: 'none' }} />

            <button type="submit" className="theme-btn" disabled={wysylka}>
                {wysylka ? 'Wysyłanie…' : 'Wyślij zgłoszenie'}
            </button>

            {/* Formularz niczego nie rezerwuje ani nie pobiera platnosci.
                Napisane przy przycisku, a nie tylko w opisie wyzej, zeby
                nie dalo sie tego przeoczyc tuz przed wyslaniem. */}
            <p className="form_nota">
                Wysłanie formularza nie rezerwuje terminu i nie jest płatnością.
                Skontaktujemy się, żeby potwierdzić termin i cenę.
            </p>

            <div className="form_status" role="status" aria-live="polite">
                {wyslane && (
                    <div className="success_message">
                        <strong>Dziękujemy, zgłoszenie do nas dotarło.</strong>
                        <br />
                        Zadzwonimy w ciągu 24 godzin roboczych, żeby potwierdzić termin,
                        zakres rozmowy i cenę. Dopiero po tej rozmowie wyślemy dane do przelewu.
                    </div>
                )}
                {blad && (
                    <div className="error_message">
                        {blad} Zadzwoń:{' '}
                        <a href={KONTAKT_ZAPASOWY.telefonHref}>{KONTAKT_ZAPASOWY.telefon}</a>{' '}
                        lub napisz na{' '}
                        <a href={`mailto:${KONTAKT_ZAPASOWY.email}`}>{KONTAKT_ZAPASOWY.email}</a>.
                    </div>
                )}
            </div>
        </form>
    );
};

export default KonsultacjaForm;
