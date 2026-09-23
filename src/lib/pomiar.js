// Zdarzenia dla Menedzera Tagow Google. Jedno miejsce, zeby nazwy nie
// rozjechaly sie miedzy szescioma formularzami, a osoba ustawiajaca tagi
// miala staly kontrakt, na ktorym moze oprzec konwersje.
//
// ZDARZENIE LECI DOPIERO PO POTWIERDZONEJ WYSYLCE, nie po klikniciu
// przycisku. Klikniecie nie jest leadem: formularz potrafi odpasc na
// walidacji, na limicie zgloszen dostawcy albo na jego awarii. Konwersja
// policzona w takim przypadku zawyza wynik kampanii i psuje optymalizacje,
// bo system uczy sie na zdarzeniach, ktore nigdy nie dotarly do biura.
//
// dataLayer zakladamy sami, gdy jeszcze nie istnieje. Zdarzenie wrzucone
// przed startem kontenera nie przepada, bo GTM po zaladowaniu przetwarza
// kolejke od poczatku.

const doWarstwy = (dane) => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(dane);
};

// Wyslane zgloszenie z formularza.
//   typ   — ktory formularz: kontakt, konsultacja, kalkulator, oferta
//   temat — wybor z listy tematow, o ile dany formularz ja ma
export const zgloszenieWyslane = (typ, temat) => {
    doWarstwy({
        event: 'lead_form_submit',
        form_type: typ,
        ...(temat ? { form_topic: temat } : {}),
    });
};

export const zapisNaNewsletter = () => {
    doWarstwy({ event: 'newsletter_signup' });
};
