import React, { useState } from 'react';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';

// Formy prawne z materialow DGC — te same, ktore biuro wymienia jako
// obslugiwane. "Dopiero zakładam firmę" jest tu celowo: poprzednia wersja
// paska wymagala nazwy firmy i odcinala osoby szukajace rejestracji,
// czyli usługi, ktora DGC ma w ofercie.
const FORMY = [
    'Jednoosobowa działalność',
    'Spółka cywilna',
    'Spółka z o.o.',
    'Spółka komandytowa lub akcyjna',
    'Stowarzyszenie lub związek zawodowy',
    'Dopiero zakładam firmę',
];

// Widelki odpowiadaja pakietom z cennika — pakiety obejmuja "do 20
// dokumentow miesiecznie", wiec kazda wyzsza odpowiedz od razu mowi biuru,
// ze wycena bedzie ponad stawke wywolawcza.
const DOKUMENTY = [
    'Do 20 dokumentów',
    'Od 21 do 50',
    'Od 51 do 100',
    'Powyżej 100',
    'Jeszcze nie wiem',
];

const PUSTY = { forma: '', dokumenty: '', email: '', _gotcha: '' };

const CtaForm = () => {

    const [formData, setFormData] = useState(PUSTY);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const e = {};

        if (!formData.forma) e.forma = 'Wybierz formę prawną';
        if (!formData.dokumenty) e.dokumenty = 'Wybierz liczbę dokumentów';

        if (!formData.email.trim()) {
            e.email = 'Podaj adres e-mail';
        } else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(formData.email.trim())) {
            e.email = 'Niepoprawny adres e-mail';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setSubmitted(false);
        setSubmissionError(null);

        if (!validate()) return;

        // pole-pulapka na boty: czlowiek go nie widzi, wiec zostaje puste
        if (formData._gotcha) return;

        setIsSubmitting(true);
        try {
            await sendLead({
                email: formData.email.trim(),
                formaPrawna: formData.forma,
                dokumenty: formData.dokumenty,
                zrodlo: 'pasek-cta',
                strona: typeof window !== 'undefined' ? window.location.pathname : '',
            });
            setSubmitted(true);
            setFormData(PUSTY);
            setErrors({});
        } catch (err) {
            setSubmissionError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Baner stoi POZA <form>, bo .cta_form to flex bez zawijania — w srodku
    // ustawialby sie jako kolejna kolumna i sciskal pola. .cta_wrap jest
    // zwyklym blokiem, wiec rodzenstwo formularza niczego nie psuje.
    return (
        <>
        <form className="cta_form" onSubmit={handleSubmit} noValidate>
            <div className="input_filled cta_pole_forma">
                <label className="visually-hidden" htmlFor="cta-forma">Forma prawna</label>
                <select
                    id="cta-forma"
                    name="forma"
                    className={errors.forma ? 'error' : ''}
                    value={formData.forma}
                    onChange={handleChange}
                >
                    <option value="">Forma prawna*</option>
                    {FORMY.map((f) => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
                {errors.forma && <span className="error">{errors.forma}</span>}
            </div>

            <div className="input_filled cta_pole_dokumenty">
                <label className="visually-hidden" htmlFor="cta-dokumenty">Dokumentów miesięcznie</label>
                <select
                    id="cta-dokumenty"
                    name="dokumenty"
                    className={errors.dokumenty ? 'error' : ''}
                    value={formData.dokumenty}
                    onChange={handleChange}
                >
                    <option value="">Dokumentów miesięcznie*</option>
                    {DOKUMENTY.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                {errors.dokumenty && <span className="error">{errors.dokumenty}</span>}
            </div>

            <div className="input_filled cta_pole_email">
                <label className="visually-hidden" htmlFor="cta-email">Adres e-mail</label>
                <input
                    id="cta-email"
                    type="email"
                    name="email"
                    className={errors.email ? 'error' : ''}
                    placeholder="Adres e-mail*"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* honeypot w postaci z dokumentacji Forminit */}
            <input
                type="hidden"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            <div className="input_filled cta_pole_submit">
                <button type="submit" className="theme-btn-accent" disabled={isSubmitting}>
                    {isSubmitting ? 'Wysyłanie…' : 'Policz moją cenę'}
                </button>
            </div>
        </form>

        <div className="form_status" role="status" aria-live="polite">
            {submitted && (
                <div className="success_message">
                    Dziękujemy. Wycenę odeślemy na podany adres w ciągu 24 godzin roboczych.
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
        </>
    );
};

export default CtaForm;
