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

        // Okno nie wyskakuje na wejsciu ani w trakcie czytania. Wczesniej
        // odpalalo sie po przewinieciu 40% strony, co na stronie glownej
        // wypadalo dokladnie na cenniku i opiniach — czyli tam, gdzie
        // odwiedzajacy podejmuje decyzje. Teraz czeka na moment, w ktorym
        // nikomu nie przerywa: albo dojechanie do konca strony, albo
        // wyprowadzenie kursora poza okno (zamiar wyjscia).
        const naScroll = () => {
            const doKonca = document.documentElement.scrollHeight - window.innerHeight;
            if (doKonca > 0 && window.scrollY / doKonca > 0.9) pokaz();
        };

        // Zamiar wyjscia dziala tylko na urzadzeniach z kursorem. Na telefonie
        // nie ma czego wykrywac, tam zostaje samo dojechanie do konca.
        const naWyjscie = (e) => {
            if (e.clientY <= 0 && !e.relatedTarget) pokaz();
        };

        window.addEventListener('scroll', naScroll, { passive: true });
        document.addEventListener('mouseout', naWyjscie);

        return () => {
            window.removeEventListener('scroll', naScroll);
            document.removeEventListener('mouseout', naWyjscie);
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
