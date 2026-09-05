import React, { useState } from 'react';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';
import { TEMATY } from '../../lib/tematy';

const PUSTY = { imie: '', email: '', telefon: '', temat: '', _gotcha: '' };

const AppointmentForm = () => {
    const [formData, setFormData] = useState(PUSTY);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const sprawdz = (pola) => {
        const e = {};

        if ('imie' in pola) {
            e.imie = pola.imie.trim().length >= 3 ? '' : 'Podaj imię i nazwisko';
        }
        if ('email' in pola) {
            if (!pola.email.trim()) e.email = 'Podaj adres e-mail';
            else e.email = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(pola.email.trim())
                ? ''
                : 'Niepoprawny adres e-mail';
        }
        if ('telefon' in pola) {
            const cyfry = pola.telefon.replace(/[^\d]/g, '');
            if (!pola.telefon.trim()) e.telefon = 'Podaj numer telefonu';
            else e.telefon = cyfry.length >= 9 ? '' : 'Niepoprawny numer telefonu';
        }
        if ('temat' in pola) {
            e.temat = pola.temat ? '' : 'Wybierz temat';
        }

        return e;
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, ...sprawdz({ [name]: value }) }));
    };

    const handleBlur = (evt) => {
        const { name, value } = evt.target;
        setErrors((prev) => ({ ...prev, ...sprawdz({ [name]: value }) }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setSubmitted(false);
        setSubmissionError(null);

        const wynik = sprawdz({
            imie: formData.imie,
            email: formData.email,
            telefon: formData.telefon,
            temat: formData.temat,
        });
        setErrors(wynik);

        if (Object.values(wynik).some(Boolean)) return;

        // pole-pulapka na boty: czlowiek go nie widzi, wiec zostaje puste
        if (formData._gotcha) return;

        setIsSubmitting(true);
        try {
            await sendLead({
                imie: formData.imie.trim(),
                email: formData.email.trim(),
                telefon: formData.telefon.trim(),
                temat: formData.temat,
                zrodlo: 'pasek-naglowek',
                strona: typeof window !== 'undefined' ? window.location.pathname : '',
            });
            setSubmitted(true);
            setFormData(PUSTY);
            setErrors({});
        } catch (err) {
            // sendLead rzuca gotowym komunikatem po polsku; rozne przyczyny
            // maja rozna tresc, zeby "odczekaj chwile" nie wygladalo jak awaria
            setSubmissionError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Slot na komunikat renderuje sie zawsze — dzieki temu pojawienie sie bledu
    // rozpycha pole w dol zamiast przesuwac caly pasek.
    const pole = (id, name, label, extra = {}) => (
        <div className="form_item">
            <label htmlFor={`lead-${id}`}>{label}</label>
            <input
                id={`lead-${id}`}
                name={name}
                className={`form_control${errors[name] ? ' error' : ''}`}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={errors[name] ? 'true' : undefined}
                aria-describedby={`lead-${id}-error`}
                {...extra}
            />
            <p className="error" id={`lead-${id}-error`}>{errors[name] || ''}</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="wrapper">
                {pole('imie', 'imie', 'Imię i nazwisko', { type: 'text', placeholder: 'Jan Kowalski' })}
                {pole('email', 'email', 'Adres e-mail', { type: 'email', placeholder: 'jan@firma.pl' })}
                {pole('telefon', 'telefon', 'Telefon', { type: 'tel', placeholder: '601 234 567' })}

                <div className="form_item">
                    <label htmlFor="lead-temat">Czego szukasz?</label>
                    <select
                        id="lead-temat"
                        name="temat"
                        className={`form_control${errors.temat ? ' error' : ''}`}
                        value={formData.temat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={errors.temat ? 'true' : undefined}
                        aria-describedby="lead-temat-error"
                    >
                        <option value="">Wybierz temat</option>
                        {TEMATY.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <p className="error" id="lead-temat-error">{errors.temat || ''}</p>
                </div>

                {/* honeypot w postaci z dokumentacji Forminit — nazwa pola
                    zgadza sie z ustawieniem w panelu */}
                <input
                    type="hidden"
                    name="_gotcha"
                    value={formData._gotcha}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                <div className="form_item form_item_submit">
                    {/* pusta etykieta trzyma przycisk w jednej linii z polami */}
                    <label className="label_spacer" aria-hidden="true"></label>
                    <input
                        className="form_btn"
                        type="submit"
                        value={isSubmitting ? 'Wysyłanie…' : 'Wyślij zapytanie'}
                        disabled={isSubmitting}
                    />
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
            </div>
        </form>
    );
};

export default AppointmentForm;
