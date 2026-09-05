import React, { useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';
import { TEMATY } from '../../lib/tematy';
import { KOMUNIKATY, WALIDATORY } from '../../lib/walidacja';

// Formularz w karcie na podstronach oferty.
//
// Szablon zostawil tu formularz przychodni: "Select Department",
// "Choose Doctor", "Say Details About Your Problem" — i przycisk, ktory
// wypisywal dane do konsoli przegladarki. Zadne zgloszenie stad nie wychodzilo.
//
// Nie da sie tu po prostu wstawic ContactForm z /contact, bo cale ostylowanie
// tej bialej karty (.cta_form_s2 w _service-single.scss) opiera sie na innym
// markupie: etykieta nad polem, klasa .input-fild, .form_item i blad
// pozycjonowany absolutnie pod polem. ContactForm ma same placeholdery
// i .form-field. Dlatego markup zostaje szablonowy, a wspolne jest to,
// co naprawde musi byc wspolne: wysylka (sendLead), lista tematow (TEMATY)
// i reguly walidacji (walidacja.js).

const PUSTY = { name: '', email: '', phone: '', subject: '', message: '', _gotcha: '' };

const ContactForm = ({ zrodlo = 'podstrona-oferty', temat = '' }) => {
    // Temat podpowiedziany na podstawie ogladanej uslugi (Services.js).
    // Pole zostaje edytowalne — podpowiedz ma oszczedzic klikniecie,
    // a nie zdecydowac za pytajacego.
    const [forms, setForms] = useState({ ...PUSTY, subject: temat });
    const [wysylka, setWysylka] = useState(false);
    const [wyslane, setWyslane] = useState(false);
    const [blad, setBlad] = useState(null);
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage',
        messages: KOMUNIKATY,
        validators: WALIDATORY,
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
                temat: forms.subject,
                wiadomosc: forms.message.trim(),
                zrodlo,
                strona: typeof window !== 'undefined' ? window.location.pathname : '',
            });
            setWyslane(true);
            // Po udanej wysylce wracamy do podpowiedzianego tematu, nie do pustki.
            setForms({ ...PUSTY, subject: temat });
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
                    <label htmlFor="oferta-imie">Imię i nazwisko</label>
                    <input
                        id="oferta-imie"
                        className="input-fild"
                        type="text"
                        name="name"
                        value={forms.name}
                        onBlur={zmiana}
                        onChange={zmiana}
                        placeholder="Jan Kowalski"
                    />
                    {validator.message('name', forms.name, 'required|alpha_space')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="oferta-email">Adres e-mail</label>
                    <input
                        id="oferta-email"
                        className="input-fild"
                        type="email"
                        name="email"
                        value={forms.email}
                        onBlur={zmiana}
                        onChange={zmiana}
                        placeholder="jan@twojafirma.pl"
                    />
                    {validator.message('email', forms.email, 'required|email')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="oferta-telefon">Telefon</label>
                    <input
                        id="oferta-telefon"
                        className="input-fild"
                        type="tel"
                        name="phone"
                        value={forms.phone}
                        onBlur={zmiana}
                        onChange={zmiana}
                        placeholder="601 234 567"
                    />
                    {validator.message('phone', forms.phone, 'required|telefon_pl')}
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label htmlFor="oferta-temat">Czego dotyczy zapytanie?</label>
                    <select
                        id="oferta-temat"
                        className="input-fild"
                        name="subject"
                        value={forms.subject}
                        onBlur={zmiana}
                        onChange={zmiana}
                    >
                        <option value="">Wybierz temat</option>
                        {TEMATY.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {validator.message('subject', forms.subject, 'required')}
                </div>
                <div className="col-12 form_item">
                    <label htmlFor="oferta-wiadomosc">Twoja wiadomość</label>
                    <textarea
                        id="oferta-wiadomosc"
                        className="input-fild"
                        name="message"
                        value={forms.message}
                        onBlur={zmiana}
                        onChange={zmiana}
                        placeholder="Napisz, czym zajmuje się Twoja firma i czego potrzebujesz."
                    ></textarea>
                    {validator.message('message', forms.message, 'required')}
                </div>
            </div>

            {/* honeypot w postaci z dokumentacji Forminit */}
            <input
                type="hidden"
                name="_gotcha"
                value={forms._gotcha}
                onChange={zmiana}
                style={{ display: 'none' }}
            />

            <button type="submit" className="theme-btn" disabled={wysylka}>
                {wysylka ? 'Wysyłanie…' : 'Wyślij zapytanie'}
            </button>

            <div className="form_status" role="status" aria-live="polite">
                {wyslane && (
                    <div className="success_message">
                        Dziękujemy. Odezwiemy się w ciągu 24 godzin roboczych.
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

export default ContactForm;
