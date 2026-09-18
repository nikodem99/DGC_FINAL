// Analityka i pomiary marketingowe — JEDEN przelacznik na wszystko.
//
// Po co tak: tresc polityki prywatnosci i faktycznie ladowane skrypty MUSZA
// wejsc w zycie w tej samej chwili. Polityka mowiaca "sledzimy", gdy nic nie
// jest podpiete, jest tak samo nieprawdziwa jak polityka mowiaca "nie
// sledzimy", gdy juz jest. Oba warianty to naruszenie art. 13 RODO, bo
// dokument ma opisywac stan faktyczny.
//
// Dlatego ten plik czyta i loader skryptow (ponizej), i polityka prywatnosci
// (src/api/politykaPrywatnosci.js). Zmiana WLACZONA na true wlacza jedno
// i drugie naraz. Nie da sie wypuscic jednego bez drugiego.
//
// JAK URUCHOMIC, gdy klient poda identyfikatory:
//   1. wpisz identyfikatory ponizej (bez nich nic sie nie zaladuje),
//   2. ustaw WLACZONA na true,
//   3. zbuduj i wdroz.
// Polityka sama dopisze sekcje o narzedziach, a skrypty zaczna sie ladowac
// wylacznie tym uzytkownikom, ktorzy wyraza zgode w banerze.

export const ANALITYKA = {
    WLACZONA: true,

    // GA4 CELOWO null. Identyfikator G-NR5CRWTMC7 istnieje, ale siedzi
    // WEWNATRZ kontenera GTM ponizej (sprawdzone 18.09.2026 w publicznej
    // zawartosci kontenera). Wpisanie go tutaj zaladowaloby GA4 drugi raz,
    // rownolegle do tego z kontenera, i kazda odslona liczylaby sie
    // podwojnie. Statystyki wygladalyby na dwa razy lepsze, niz sa.
    ga4: null,

    // Kontener przeniesiony ze starej strony. W srodku ma GA4
    // (G-NR5CRWTMC7) oraz Google Ads (AW-708608299), wiec ciaglosc
    // pomiarow i konwersji reklamowych zostaje zachowana.
    gtm: 'GTM-5Z98MN2',

    // Piksel Meta ze starej strony, tam wpiety bezposrednio w kod, nie
    // przez GTM — dlatego musi byc tutaj osobno.
    pixelMeta: '2468225276952522',

    // Narzedzia dzialajace WEWNATRZ kontenera GTM. Nie laduje ich nasz kod,
    // ale zbieraja dane, wiec polityka prywatnosci musi je wymienic —
    // inaczej przemilczelibysmy przed czytelnikiem dwa realne narzedzia.
    // Odczytane z publicznej zawartosci kontenera 18.09.2026.
    wKontenerze: ['Google Analytics 4', 'Google Ads'],
};

// Kategorie zgody wymagane przez poszczegolne narzedzia. Zgodne z tym,
// co baner pokazuje uzytkownikowi (src/lib/zgody.js).
export const WYMAGANA_ZGODA = {
    ga4: 'statystyki',
    // GTM celowo bez jednej kategorii: kontener niesie NARAZ statystyki
    // (GA4) i reklame (Google Ads). Bramka na sama kategorie "statystyki"
    // oznaczalaby, ze ktos, kto zgodzil sie na statystyki, a odmowil
    // marketingu, i tak dostaje tagi reklamowe — czyli zgoda jest fikcja.
    // Dlatego kontener ladujemy, gdy jest DOWOLNA zgoda, a o tym, ktore
    // tagi w nim wolno odpalic, decyduje Consent Mode ponizej.
    pixelMeta: 'marketing',
};

// Czy przy obecnej konfiguracji cokolwiek moze sie zaladowac. Polityka
// prywatnosci pyta o to, zeby wiedziec, czy dopisac sekcje o pomiarach.
export const czyPomiaryDzialaja = () =>
    ANALITYKA.WLACZONA && Boolean(ANALITYKA.ga4 || ANALITYKA.gtm || ANALITYKA.pixelMeta);

// Nazwy narzedzi do wypisania w polityce — tylko te realnie skonfigurowane.
export const AKTYWNE_NARZEDZIA = () => {
    if (!czyPomiaryDzialaja()) return [];
    const lista = [];
    if (ANALITYKA.gtm) {
        lista.push('Google Tag Manager');
        lista.push(...(ANALITYKA.wKontenerze || []));
    }
    if (ANALITYKA.ga4) lista.push('Google Analytics 4');
    if (ANALITYKA.pixelMeta) lista.push('piksel Meta');
    return [...new Set(lista)];
};

// --- Ladowanie skryptow -------------------------------------------------
// Wolane z App.jsx po zamontowaniu. Dziala wylacznie w przegladarce.
const zaladowane = new Set();

const dodajSkrypt = (klucz, src, przedStartem) => {
    if (zaladowane.has(klucz) || typeof document === 'undefined') return;
    zaladowane.add(klucz);
    if (przedStartem) przedStartem();
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
};

export const uruchomPomiary = (czyZgoda) => {
    if (!czyPomiaryDzialaja()) return;

    if (ANALITYKA.ga4 && czyZgoda(WYMAGANA_ZGODA.ga4)) {
        dodajSkrypt('ga4', `https://www.googletagmanager.com/gtag/js?id=${ANALITYKA.ga4}`, () => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            // anonymize_ip nie jest juz opcja w GA4 (adres IP i tak nie jest
            // zapisywany), wiec nie udajemy, ze cos wlaczamy.
            window.gtag('config', ANALITYKA.ga4);
        });
    }

    // Kontener GTM + Consent Mode. Kolejnosc jest tu istotna: stan zgody
    // musi trafic do dataLayer PRZED zaladowaniem kontenera, inaczej tagi
    // zdaza odpalic, zanim dowiedza sie, na co jest zgoda.
    const zgodaStatystyki = czyZgoda('statystyki');
    const zgodaMarketing = czyZgoda('marketing');

    if (ANALITYKA.gtm && (zgodaStatystyki || zgodaMarketing)) {
        const stan = {
            analytics_storage: zgodaStatystyki ? 'granted' : 'denied',
            ad_storage: zgodaMarketing ? 'granted' : 'denied',
            ad_user_data: zgodaMarketing ? 'granted' : 'denied',
            ad_personalization: zgodaMarketing ? 'granted' : 'denied',
        };

        if (!zaladowane.has('gtm')) {
            dodajSkrypt('gtm', `https://www.googletagmanager.com/gtm.js?id=${ANALITYKA.gtm}`, () => {
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
                // Domyslnie wszystko odmowione, potem od razu aktualizacja.
                window.gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                });
                window.gtag('consent', 'update', stan);
                window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
            });
        } else if (window.gtag) {
            // Kontener juz stoi, a uzytkownik zmienil zdanie w ustawieniach.
            window.gtag('consent', 'update', stan);
        }
    }

    if (ANALITYKA.pixelMeta && czyZgoda(WYMAGANA_ZGODA.pixelMeta)) {
        dodajSkrypt('meta', 'https://connect.facebook.net/en_US/fbevents.js', () => {
            /* eslint-disable */
            const f = window;
            f.fbq = f.fbq || function () { (f.fbq.callMethod ? f.fbq.callMethod.apply(f.fbq, arguments) : f.fbq.queue.push(arguments)); };
            if (!f._fbq) f._fbq = f.fbq;
            f.fbq.push = f.fbq; f.fbq.loaded = true; f.fbq.version = '2.0'; f.fbq.queue = [];
            /* eslint-enable */
            window.fbq('init', ANALITYKA.pixelMeta);
            window.fbq('track', 'PageView');
        });
    }
};
