// Jedyne miejsce w kodzie, ktore wie, dokad trafiaja zgloszenia z formularzy.
// Gdy powstanie wlasny backend, podmieniamy wnetrze sendLead() — komponenty
// formularzy zostaja nietkniete.
//
// Dostawca: Forminit (forminit.com, do stycznia 2026 Getform.io), UXPLUS LTD,
// Londyn. Dane zgloszen leza na AWS w Irlandii, szyfrowane AES-256. To byl
// glowny powod wyboru: formularz zbiera dane osobowe klientow biura
// rachunkowego, wiec trzymanie ich w UE upraszcza rejestr czynnosci
// przetwarzania do zera wpisow poza EOG.
//
// Adres odbiorcy NIE jest w kodzie — ustawia go panel Forminit. Dzieki temu
// zmiana skrzynki nie wymaga wdrozenia strony, a adres nie krazy w bundlu
// jako gotowy cel dla robotow zbierajacych maile.
//
// FORM_ID jest identyfikatorem publicznym, nie sekretem. Tryb Public to
// jedyny tryb dzialajacy prosto z przegladarki, bo strona statyczna nie ma
// gdzie bezpiecznie schowac klucza. Dlatego prefiks VITE_ jest tu poprawny.
// Klucza X-API-KEY nigdy nie wolno w ten sposob wystawic.
//
// Wysylamy FormData, a nie JSON, mimo ze API przyjmuje oba. Powod: honeypot
// `_gotcha` jest w dokumentacji opisany wylacznie jako pole formularza i nie
// ma udokumentowanego odpowiednika w JSON-ie. Przy JSON-ie ustawienie
// honeypota wlaczone w panelu byloby martwe.
//
// Nie uzywamy tez ich SDK z CDN. Skrypt sam zbiera parametry UTM, click ID
// z reklam i referrer — dla strony biura rachunkowego to dodatkowe dane
// osobowe i dodatkowy podmiot w lancuchu, ktorych nikt nie zamawial.
// Zwykly fetch robi dokladnie to, co potrzebne, i nic ponadto.

const FORM_ID = import.meta.env.VITE_FORMINIT_FORM_ID;
const ENDPOINT = 'https://forminit.com/f/';

// Nazwa pola-pulapki ustawiona w panelu Forminit (Form Settings → Honeypot).
const HONEYPOT = '_gotcha';

// Kontakt zapasowy pokazywany, gdy wysylka padnie — zeby lead nie przepadl.
export const KONTAKT_ZAPASOWY = {
    telefon: '731 580 184',
    telefonHref: 'tel:+48731580184',
    email: 'kontakt@biurodgc.pl',
};

const BLAD_OGOLNY = 'Nie udało się wysłać zgłoszenia.';

// Komunikaty pisane dla osoby po drugiej stronie, nie dla programisty.
const wgKodu = (kod) => {
    // Tryb Public dopuszcza jedno zgloszenie na 5 sekund (docs: Rate Limits).
    if (kod === 429) return 'Zbyt wiele prób pod rząd. Odczekaj kilka sekund i wyślij ponownie.';
    if (kod === 400) return 'Formularz odrzucił dane. Sprawdź adres e-mail i spróbuj ponownie.';
    // 401 = formularz nie jest w trybie Public, 403 = wylaczony albo wyczerpany
    // limit miesieczny, 404 = zly FORM_ID. Uzytkownik nie naprawi zadnego
    // z nich, wiec dostaje prosbe o kontakt, a szczegol trafia do konsoli.
    return BLAD_OGOLNY;
};

// Forminit waliduje `fi-sender-phone` wedlug E.164. Polskie numery zapisuje
// sie na wiele sposobow, wiec sprowadzamy je do +48XXXXXXXXX. Gdy numer nie
// da sie tak zapisac, ida jako zwykly tekst — utrata leada przez format
// numeru byłaby gorsza niz brak walidacji po stronie serwera.
const naE164 = (surowy) => {
    const cyfry = String(surowy).replace(/[^\d]/g, '');
    if (/^\+/.test(String(surowy).trim()) && cyfry.length >= 9) return `+${cyfry}`;
    if (cyfry.length === 9) return `+48${cyfry}`;
    if (cyfry.length === 11 && cyfry.startsWith('48')) return `+${cyfry}`;
    return null;
};

/**
 * Wysyla zgloszenie z dowolnego formularza na stronie. Rzuca bledem
 * z gotowym komunikatem po polsku — komponent pokazuje go bez przerabiania.
 *
 * Darmowy plan Forminit daje jeden formularz, wiec wszystkie trzy formularze
 * strony celuja w ten sam FORM_ID. Pole `zrodlo` mowi, z ktorego przyszlo
 * zgloszenie, a `strona` — z ktorej podstrony.
 *
 * @param {{imie?: string, email: string, telefon?: string, temat?: string,
 *          firma?: string, wiadomosc?: string, formaPrawna?: string,
 *          dokumenty?: string, dataKonsultacji?: string, przedzial?: string,
 *          formaKonsultacji?: string, formaDzialalnosci?: string,
 *          zgoda?: string, zrodlo?: string, strona?: string}} dane
 */
export async function sendLead(dane) {
    if (!FORM_ID) {
        // Swiadomie glosna awaria. Cichy sukces przy braku konfiguracji
        // znaczylby, ze klient widzi podziekowanie, a zapytanie znika.
        console.error(
            '[DGC] Brak VITE_FORMINIT_FORM_ID — formularz nie jest podłączony. ' +
            'Wpisz identyfikator formularza z panelu Forminit do pliku .env.local.'
        );
        throw new Error(BLAD_OGOLNY);
    }

    const fd = new FormData();
    // Imie jest opcjonalne: pasek wyceny go nie pyta, bo do odeslania ceny
    // trzeba wiedziec co za firma, a nie kto pyta. Forminit wymaga tylko
    // jednej wlasciwosci nadawcy — e-mail wystarcza.
    if (dane.imie) fd.append('fi-sender-fullName', dane.imie);
    fd.append('fi-sender-email', dane.email);

    if (dane.telefon) {
        const e164 = naE164(dane.telefon);
        if (e164) fd.append('fi-sender-phone', e164);
        else fd.append('fi-text-telefon', dane.telefon);
    }
    if (dane.firma) fd.append('fi-sender-company', dane.firma);
    if (dane.temat) fd.append('fi-select-temat', dane.temat);
    if (dane.formaPrawna) fd.append('fi-select-forma-prawna', dane.formaPrawna);
    if (dane.dokumenty) fd.append('fi-select-dokumenty', dane.dokumenty);
    // Pola z formularza umawiania konsultacji (/umow-konsultacje). Data idzie
    // jako tekst w formacie z pola <input type="date">, czyli RRRR-MM-DD —
    // pracownik i tak dzwoni potwierdzic termin, wiec liczy sie czytelnosc
    // w skrzynce, a nie typ danych po stronie Forminit.
    if (dane.dataKonsultacji) fd.append('fi-text-data-konsultacji', dane.dataKonsultacji);
    if (dane.przedzial) fd.append('fi-select-przedzial-godzin', dane.przedzial);
    if (dane.formaKonsultacji) fd.append('fi-select-forma-konsultacji', dane.formaKonsultacji);
    if (dane.formaDzialalnosci) fd.append('fi-select-forma-dzialalnosci', dane.formaDzialalnosci);
    if (dane.wiadomosc) fd.append('fi-text-wiadomosc', dane.wiadomosc);
    // Zapisy na newsletter: RODO wymaga, zeby dalo sie wykazac, ze zgoda
    // marketingowa zostala udzielona — zapisujemy jej tresc i moment.
    if (dane.zgoda) fd.append('fi-text-zgoda', dane.zgoda);
    if (dane.zrodlo) fd.append('fi-text-zrodlo', dane.zrodlo);
    if (dane.strona) fd.append('fi-text-podstrona', dane.strona);

    // Pole-pulapka zawsze obecne i zawsze puste. Formularze i tak przerywaja
    // wysylke, gdy czlowiek-bot je wypelni (nie zjadamy wtedy limitu), ale
    // pole musi istniec, zeby ustawienie honeypota w panelu mialo sens.
    fd.append(HONEYPOT, '');

    let odpowiedz;
    try {
        odpowiedz = await fetch(`${ENDPOINT}${FORM_ID}`, {
            method: 'POST',
            // Bez tego naglowka Forminit odpowiada na FormData przekierowaniem
            // 302 na wlasna strone "thank you" (zachowanie natywnego formularza
            // HTML). fetch poszedlby za przekierowaniem, dostal HTML zamiast
            // JSON-a i kazda UDANA wysylka wygladalaby na blad. Sprawdzone
            // na zywym API.
            headers: { Accept: 'application/json' },
            body: fd,
        });
    } catch (err) {
        // Brak sieci, blokada przez rozszerzenie przegladarki, padniety DNS.
        console.error('[DGC] Wysyłka nie doszła do skutku:', err);
        throw new Error(BLAD_OGOLNY);
    }

    let tresc = null;
    try {
        tresc = await odpowiedz.json();
    } catch {
        // odpowiedz bez poprawnego JSON-a traktujemy jak awarie
    }

    // UWAGA: status HTTP tutaj nie wystarcza. Sprawdzone na zywym API —
    // przy nieistniejacym FORM_ID Forminit odpowiada HTTP 200, a informacja
    // o bledzie siedzi dopiero w tresci: {"success": false, "code": 404}.
    // Oparcie sie na odpowiedz.ok znaczyloby, ze zly identyfikator formularza
    // wyglada jak udana wysylka, a zgloszenia znikaja bez sladu.
    // Dlatego liczy sie wylacznie jawne success === true.
    if (!odpowiedz.ok || tresc?.success !== true) {
        const kod = tresc?.code ?? odpowiedz.status;
        if (kod === 401) {
            console.error('[DGC] Formularz w panelu Forminit nie jest w trybie Public');
        }
        console.error(
            '[DGC] Forminit nie przyjął zgłoszenia:',
            kod,
            tresc?.error ?? '(brak treści)',
            tresc?.message ?? ''
        );
        throw new Error(wgKodu(kod));
    }

    return tresc;
}
