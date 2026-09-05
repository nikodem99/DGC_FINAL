import React, { useEffect, useRef, useState } from 'react';
import NewsletterForm from './NewsletterForm';

const KLUCZ = 'dgc-newsletter';

// Zapamietujemy decyzje w przegladarce odwiedzajacego. Wrapper na try/catch,
// bo w trybie prywatnym i przy zablokowanych danych witryn samo siegniecie
// do localStorage potrafi rzucic wyjatkiem.
const pamiec = {
    odczyt() {
        try { return localStorage.getItem(KLUCZ); } catch { return null; }
    },
    zapis(v) {
        try { localStorage.setItem(KLUCZ, v); } catch { /* trudno */ }
    },
};

const NewsletterPopup = () => {
    const [otwarte, setOtwarte] = useState(false);
    const przyciskZamknij = useRef(null);

    useEffect(() => {
        // Kto juz sie zapisal albo zamknal okno, nie oglada go ponownie.
        if (pamiec.odczyt()) return;

        let pokazane = false;
        const pokaz = () => {
            if (pokazane) return;
            pokazane = true;
            setOtwarte(true);
        };

        // Okno nie wyskakuje na wejsciu. Czeka, az odwiedzajacy pokaze
        // zainteresowanie: przewinie 40% strony albo spedzi na niej pol minuty.
        // Natychmiastowe nachalne okno to zla praktyka, a na telefonach
        // Google traktuje je jako czynnik obnizajacy pozycje w wynikach.
        const naScroll = () => {
            const doKonca = document.documentElement.scrollHeight - window.innerHeight;
            if (doKonca > 0 && window.scrollY / doKonca > 0.4) pokaz();
        };

        const czasomierz = setTimeout(pokaz, 30000);
        window.addEventListener('scroll', naScroll, { passive: true });

        return () => {
            clearTimeout(czasomierz);
            window.removeEventListener('scroll', naScroll);
        };
    }, []);

    useEffect(() => {
        if (!otwarte) return;
        const naKlawisz = (e) => { if (e.key === 'Escape') zamknij(); };
        window.addEventListener('keydown', naKlawisz);
        przyciskZamknij.current?.focus();
        return () => window.removeEventListener('keydown', naKlawisz);
    }, [otwarte]);

    const zamknij = () => {
        pamiec.zapis(`zamkniete ${new Date().toISOString()}`);
        setOtwarte(false);
    };

    if (!otwarte) return null;

    return (
        <div className="newsletter_popup" role="dialog" aria-modal="true" aria-labelledby="nl-popup-tytul">
            <div className="newsletter_popup_tlo" onClick={zamknij} />

            <div className="newsletter_popup_okno">
                <button
                    ref={przyciskZamknij}
                    type="button"
                    className="newsletter_popup_zamknij"
                    onClick={zamknij}
                    aria-label="Zamknij okno"
                >
                    ×
                </button>

                <span className="newsletter_popup_nad">Newsletter DGC</span>
                <h3 id="nl-popup-tytul">Nie przegap zmian w przepisach</h3>
                <p>
                    Zostaw adres, a napiszemy, gdy zmieni się coś, co dotyczy rozliczeń
                    Twojej firmy. Krótko i konkretnie, bez reklam.
                </p>

                <NewsletterForm zrodlo="newsletter-popup" />
            </div>
        </div>
    );
};

export default NewsletterPopup;
