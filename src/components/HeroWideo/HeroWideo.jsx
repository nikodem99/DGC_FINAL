import React, { useEffect, useRef, useState } from 'react';

// Film w tle po prawej stronie sekcji powitalnej. Zapetlony, wyciszony,
// bez sterowania — pelna wersja z dzwiekiem otwiera sie przyciskiem
// "Obejrzyj film", ktory stoi obok i dziala jak wczesniej.
//
// Plik petli jest juz przyciety do pionu w ffmpeg, dokladnie do proporcji
// slotu (438x540 = 0,811, zdjecie mialo 753x928 = 0,811). Dzieki temu nie
// trzeba nic docinac w CSS, a caly bitrate idzie na to, co widac.
//
// Plakat to pierwsza klatka tej samej petli, wiec przed startem filmu i po
// jego zablokowaniu widac ten sam kadr — bez przeskoku.

const PETLA = '/video/dgc-hero-petla.mp4';
const PLAKAT = '/video/hero-plakat.jpg';

// Film jest dekoracja, a nie trescia, wiec nie wolno go dociagac tam, gdzie
// przeszkadza: przy wlaczonej oszczednosci danych, na wolnym laczu, przy
// wylaczonych animacjach w systemie i na waskich ekranach, gdzie i tak
// zajmowalby pol ekranu na komorkowym transferze.
const wolnoOdtwarzac = () => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.innerWidth < 992) return false;

    const l = navigator.connection;
    if (l?.saveData) return false;
    if (l?.effectiveType && /2g/.test(l.effectiveType)) return false;

    return true;
};

const HeroWideo = ({ alt = 'Danuta Grabińska-Chłopaś, prezes zarządu DGC' }) => {
    const ref = useRef(null);
    const [zrodlo, setZrodlo] = useState(null);

    useEffect(() => {
        if (!wolnoOdtwarzac()) return;

        // Film dociagamy dopiero, gdy strona sie zaladuje. Inaczej 631 kB
        // konkurowaloby o lacze z tekstem i zdjeciami, ktore uzytkownik
        // faktycznie chce zobaczyc najpierw.
        const start = () => setZrodlo(PETLA);
        if (document.readyState === 'complete') {
            start();
            return undefined;
        }
        window.addEventListener('load', start, { once: true });
        return () => window.removeEventListener('load', start);
    }, []);

    // Odtwarzanie startuje dopiero, gdy przegladarka ma dane. Wolanie play()
    // od razu po ustawieniu `src` konczylo sie odrzuceniem obietnicy, bo
    // element nie mial jeszcze czego odtwarzac — a `catch` to polykal i film
    // po cichu stal na plakacie.
    const start = () => {
        // Autoodtwarzanie bywa blokowane mimo `muted` (np. oszczedzanie
        // energii w Safari). Wtedy zostaje plakat, czyli ten sam kadr,
        // wiec nie ma czego ratowac.
        ref.current?.play().catch(() => {});
    };

    // Przegladarka wstrzymuje film, gdy karta idzie w tlo, i sama go nie
    // wznawia po powrocie — bez tego uzytkownik, ktory na chwile przelaczyl
    // okno, wraca do zamrozonej klatki.
    useEffect(() => {
        if (!zrodlo) return undefined;
        const wroc = () => {
            if (!document.hidden) start();
        };
        document.addEventListener('visibilitychange', wroc);
        return () => document.removeEventListener('visibilitychange', wroc);
    }, [zrodlo]);

    return (
        <video
            ref={ref}
            className="hero_wideo"
            src={zrodlo ?? undefined}
            poster={PLAKAT}
            aria-label={alt}
            onCanPlay={start}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
        />
    );
};

export default HeroWideo;
