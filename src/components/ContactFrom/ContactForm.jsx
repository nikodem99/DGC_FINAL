import React, { useState } from 'react'
import SimpleReactValidator from 'simple-react-validator';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';
import { TEMATY } from '../../lib/tematy';
import { KOMUNIKATY, WALIDATORY } from '../../lib/walidacja';

const PUSTY = { name: '', email: '', subject: '', phone: '', message: '', _gotcha: '' };

// zrodlo trafia do zgloszenia, zeby w skrzynce bylo widac, z ktorej
// podstrony przyszlo — ten sam formularz stoi na /contact i na /cennik
const ContactForm = ({ zrodlo = 'strona-kontaktu' }) => {

    const [forms, setForms] = useState(PUSTY);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage',
        messages: KOMUNIKATY,
        validators: WALIDATORY,
    }));
    // SimpleReactValidator trzyma stan bledow poza Reactem, wiec samo
    // showMessages() niczego nie przerysuje. Licznik wymusza render.
    const [, przerysuj] = useState(0);

    const changeHandler = e => {
        setForms({ ...forms, [e.target.name]: e.target.value })
        if (validator.allValid()) {
            validator.hideMessages();
        } else {
            validator.showMessages();
        }
    };

    const submitHandler = async e => {
        e.preventDefault();
        setSubmitted(false);
        setSubmissionError(null);

        if (!validator.allValid()) {
            validator.showMessages();
            przerysuj((n) => n + 1);
            return;
        }
        validator.hideMessages();

        // pole-pulapka na boty: czlowiek go nie widzi, wiec zostaje puste
        if (forms._gotcha) return;

        setIsSubmitting(true);
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
            setSubmitted(true);
            setForms(PUSTY);
        } catch (err) {
            setSubmissionError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className="contact-validation-active" noValidate >
            <div className="row">
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.name}
                            type="text"
                            name="name"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Imię i nazwisko" />
                        {validator.message('name', forms.name, 'required|alpha_space')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.email}
                            type="email"
                            name="email"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Adres e-mail" />
                        {validator.message('email', forms.email, 'required|email')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.phone}
                            type="tel"
                            name="phone"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Telefon" />
                        {validator.message('phone', forms.phone, 'required|telefon_pl')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <select
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            value={forms.subject}
                            name="subject">
                            <option value="">Czego dotyczy zapytanie?</option>
                            {TEMATY.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {validator.message('subject', forms.subject, 'required')}
                    </div>
                </div>
                <div className="col col-lg-12 col-12">
                    <textarea
                        onBlur={(e) => changeHandler(e)}
                        onChange={(e) => changeHandler(e)}
                        value={forms.message}
                        name="message"
                        placeholder="Twoja wiadomość">
                    </textarea>
                    {validator.message('message', forms.message, 'required')}
                </div>
            </div>

            {/* honeypot w postaci z dokumentacji Forminit */}
            <input
                type="hidden"
                name="_gotcha"
                value={forms._gotcha}
                onChange={(e) => changeHandler(e)}
                style={{ display: 'none' }}
            />

            <div className="submit-area">
                <button type="submit" className="theme-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Wysyłanie…' : 'Wyślij zapytanie'}
                </button>
            </div>

            <div className="form_status" role="status" aria-live="polite">
                {submitted && (
                    <div className="success_message">
                        Dziękujemy. Odezwiemy się w ciągu 24 godzin roboczych.
                    </div>
                )}
                {submissionError && (
                    <div className="error_message">
                        {submissionError} Zadzwoń:{' '}
                        <a href={KONTAKT_ZAPASOWY.telefonHref}>{KONTAKT_ZAPASOWY.telefon}</a>{' '}
                        lub napisz na{' '}
                        <a href={`mailto:${KONTAKT_ZAPASOWY.email}`}>{KONTAKT_ZAPASOWY.email}</a>.
                    </div>
                )}
            </div>
        </form >
    )
}

export default ContactForm;
