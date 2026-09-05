import React, { useState } from 'react';
import { sendLead, KONTAKT_ZAPASOWY } from '../../lib/sendLead';

// Tresc zgody. RODO wymaga, zeby dalo sie wykazac, ze zostala udzielona,
// wiec zapisujemy jej brzmienie razem ze znacznikiem czasu — samo "tak"
// nic nie dowodzi, jesli pozniej zmienimy tekst pod checkboxem.
export const TRESC_ZGODY =
    'Chcę otrzymywać newsletter DGC. Zgodę mogę wycofać w każdej chwili.';

const NewsletterForm = ({ zrodlo = 'newsletter' }) => {
    const [email, setEmail] = useState('');
    const [zgoda, setZgoda] = useState(false);
    const [blad, setBlad] = useState('');
    const [wysylam, setWysylam] = useState(false);
    const [zapisany, setZapisany] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBlad('');

        if (!email.trim()) return setBlad('Podaj adres e-mail');
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) {
            return setBlad('Niepoprawny adres e-mail');
        }
        // Zgoda musi byc odrebna i dobrowolna — bez niej nie wolno wyslac
        // ani jednej wiadomosci marketingowej.
        if (!zgoda) return setBlad('Zaznacz zgodę, żebyśmy mogli wysyłać Ci wiadomości');

        setWysylam(true);
        try {
            await sendLead({
                email: email.trim(),
                zgoda: `${TRESC_ZGODY} [zaznaczono ${new Date().toISOString()}]`,
                zrodlo,
                strona: typeof window !== 'undefined' ? window.location.pathname : '',
            });
            setZapisany(true);
            setEmail('');
            setZgoda(false);
        } catch (err) {
            setBlad(err.message);
        } finally {
            setWysylam(false);
        }
    };

    if (zapisany) {
        return (
            <p className="newsletter_ok" role="status">
                Dziękujemy. Adres jest zapisany. Odezwiemy się, gdy pojawi się
                coś, co warto wiedzieć.
            </p>
        );
    }

    return (
        <form className="newsletter_form" onSubmit={handleSubmit} noValidate>
            <label className="visually-hidden" htmlFor={`nl-${zrodlo}`}>Adres e-mail</label>
            <input
                id={`nl-${zrodlo}`}
                className="fild"
                type="email"
                name="email"
                placeholder="Adres e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={wysylam}>
                {wysylam ? 'Zapisuję…' : 'Zapisz się'}
            </button>

            <label className="newsletter_zgoda">
                <input
                    type="checkbox"
                    checked={zgoda}
                    onChange={(e) => setZgoda(e.target.checked)}
                />
                <span>{TRESC_ZGODY}</span>
            </label>

            {blad && (
                <p className="newsletter_blad" role="alert">
                    {blad}
                    {blad.startsWith('Nie udało') && (
                        <>
                            {' '}Napisz na{' '}
                            <a href={`mailto:${KONTAKT_ZAPASOWY.email}`}>{KONTAKT_ZAPASOWY.email}</a>.
                        </>
                    )}
                </p>
            )}
        </form>
    );
};

export default NewsletterForm;
