# Przekazanie techniczne — biurodgc.pl

Dla programisty, który przejmuje stronę. Rzeczy, których nie widać z kodu
i o które najłatwiej się potknąć.

---

## Jedna rzecz, która kasuje cudzą pracę

**Repozytorium NIE jest jedynym źródłem prawdy o artykułach.**

Biuro dodaje i edytuje artykuły przez panel w PHP, który stoi na serwerze.
Panel zapisuje je do `dane/wpisy.json`, `dane/tresci/<slug>.json` i generuje
gotowe `porady/<slug>/index.html`. Te pliki nie trafiają same do repozytorium.

Zbudowanie strony z samego repozytorium i wgranie paczki **skasuje wszystkie
artykuły dodane przez biuro od ostatniego wgrania.**

Kolejność jest zawsze taka:

```bash
node scripts/pobierz-z-serwera.mjs   # najpierw to
npm run build                        # dopiero potem
```

Pierwszy skrypt pobiera z serwera artykuły, których nie ma lokalnie, i dopisuje
je do `src/api/blogs.js` oraz `src/tresci/`. Działa zwykłym zapytaniem HTTP,
bo te pliki są publiczne, więc nie potrzebuje ani FTP, ani hasła.

**Ograniczenie, o którym trzeba wiedzieć:** skrypt pobiera tylko artykuły,
których w repozytorium NIE MA. Nie wykrywa zmian w artykułach, które już
są w obu miejscach. Jeśli biuro poprawiło tekst istniejącego wpisu, a potem
ktoś wgra paczkę, ta poprawka zniknie. Przy rzadkich wdrożeniach to akceptowalne,
przy częstych trzeba to rozbudować.

---

## Dlaczego strona jest zbudowana właśnie tak

### Wszystko jest statyczne

Każda z ponad 450 podstron to gotowy plik HTML, generowany przy budowaniu
(`vite-prerender-plugin`). Nie ma serwera aplikacji. Hosting to współdzielony
cyber_Folks: jest PHP, nie ma Node'a, nie ma SSH.

To ograniczenie tłumaczy większość decyzji poniżej.

### Treści artykułów są poza paczką JavaScriptu

`src/tresci/<slug>.json`, podpięte przez `import.meta.glob` bez `eager`.
Powód jest policzony: przy 376 artykułach treść w głównej paczce ważyłaby
około 530 kB po kompresji, przy samej paczce ważącej 263 kB. Płaciłby za to
każdy odwiedzający, także ten, który nigdy nie otworzy artykułu.

Prerender wkleja treść artykułu do gotowego HTML-a, a przeglądarka przy
pierwszym wejściu bierze ją z tego samego HTML-a (znacznik `<script
type="application/json" id="dgc-tresc">`). Dzięki temu nie ma ani
dodatkowego zapytania, ani rozjazdu przy hydracji.

### Szablon dla panelu wypada z budowania

`scripts/szablon.mjs` bierze prawdziwy, prerenderowany artykuł i zastępuje
w nim pola znacznikami `@@...@@`. Panel wypełnia ten szablon.

Alternatywą byłoby napisanie szablonu w PHP, czyli drugi opis tego samego
wyglądu. Rozjechałby się przy pierwszej zmianie stylu i nikt by tego nie
zauważył, bo każda wersja osobno wyglądałaby poprawnie.

**Każde podstawienie w tym skrypcie jest sprawdzane i musi trafić dokładnie
raz, inaczej budowanie się przerywa.** Jeśli zmienisz strukturę
`BlogSingle.jsx`, budowanie padnie z informacją, które wyrażenie przestało
pasować. To jest celowe: cichy szablon z niepodmienionym tytułem oznaczałby
setki stron z cudzym tytułem.

To samo dotyczy `blokiNaHtml()` w `panel-dgc/generator.php` — to odpowiednik
komponentu `Blok`. Dodajesz nowy typ bloku w React, dodaj go też tam.

Drugie takie lustro to `podobneHtml()` w generatorze i wybór trzech wpisów
w `BlogSidebar.jsx` (blok „Podobne wpisy” w pasku bocznym). Obie strony muszą
wybierać te same artykuły w tej samej kolejności, bo inaczej artykuł dodany
z panelu po wczytaniu Reacta podmieniłby ten blok na inny.

Dwie kontrole trzymają tę parę razem:

- **budowanie** przerywa się, jeśli szablon ma pole `@@COŚ@@`, którego nie ma
  w `generator.php`. Widać to od razu, a nie dopiero przy dodawaniu artykułu;
- **panel** nie zapisze strony, w której został niepodmieniony napis
  `@@COŚ@@`, i powie, że paczka strony jest nowsza niż pliki panelu.

Dlatego przy zmianie szablonu wgrywa się **razem** paczkę strony i
`generator.php`. Z nowym panelem odwrotna kolejność jest bezpieczna: panel
odmówi zapisu i wyświetli komunikat o aktualizacji.

**Ten strażnik działa dopiero od chwili, gdy nowy `generator.php` stoi na
serwerze.** Jeśli wgrasz samą paczkę, a panel zostanie stary, to stary kod
nie zna ani nowego pola, ani strażnika — wstawi na stronę goły napis
`@@PODOBNE@@` i zapisze ją bez ostrzeżenia. Zdarzyło się to raz, 4 października
2026, na dwóch stronach. Kolejność ma znaczenie: **najpierw pliki panelu,
potem paczka strony.**

### Zapis w panelu nadpisuje ręcznie dobrane meta

Piętnaście artykułów ma w `src/seo/meta.js` ręcznie napisany tytuł i opis pod
wyszukiwarkę, krótszy i inaczej sformułowany niż tytuł samego artykułu. Panel
tego pliku nie zna — składa tytuł jako `tytuł artykułu · DGC`, a opis bierze
z `description` wpisu.

Skutek: zapisanie takiego artykułu w panelu, nawet bez żadnej zmiany w treści,
podmienia dobrane meta na wersję ogólną. Strona dalej działa i jest poprawna,
ale tytuł i opis w wynikach wyszukiwania robią się dłuższe i mniej celne.

Nie jest to zepsute, tylko świadomie proste: od chwili uruchomienia panelu to
biuro jest właścicielem tekstu. Gdyby kiedyś miało to przeszkadzać, trzeba
przenieść pola `tytulMeta` i `opisMeta` do `dane/wpisy.json` (w
`scripts/szablon.mjs`) i czytać je w `zapiszStroneArtykulu()`.

---

## Panel

Katalog o nazwie zaczynającej się od `panel-`, w `public_html`. Nazwa jest
celowo nieoczywista i zna ją właściciel strony.

- `index.php` — logowanie, lista, formularz, zapis
- `generator.php` — składanie stron, bloki na HTML, mapa strony, zdjęcia
- hasło: `dane/konfig.php`, skrót `password_hash`, ustawiany przy pierwszym wejściu

**`.htaccess` serwisu blokuje wykonywanie PHP wszędzie poza dwoma wyjątkami:**
`nadaj.php` (wysyłka poczty z formularzy) i `^panel-[a-z0-9-]+/(index|generator)\.php$`.
Reguła jest wąska celowo: po starym WordPressie został katalog `wp-content`,
też pierwszego poziomu, i właśnie tam lądują podrzucone skrypty.

Ta blokada jest też głównym zabezpieczeniem wgrywania zdjęć — plik `.php`
przemycony jako obrazek nie ma jak się wykonać.

**Przy każdej nowej paczce** rozpakuje się katalog `panel-dgc`, bo build nie
zna nazwy wybranej przez właściciela. Trzeba przenieść z niego trzy pliki do
właściwego katalogu i skasować resztę.

---

## Poczta z formularzy

`public/nadaj.php`. Wysyła powiadomienie o zgłoszeniu na skrzynkę biura
oraz automatyczną odpowiedź do osoby, która wypełniła formularz.

Działa **równolegle** z zewnętrzną usługą Forminit, a nie po niej. To jest
istotne: darmowy plan Forminit kończy się na 100 zgłoszeniach miesięcznie
i po przekroczeniu limitu odrzuca kolejne. Wtedy ten skrypt jest jedyną
drogą, którą lead dociera do biura.

Poczta domeny stoi na tym samym serwerze co strona, więc wiadomość nie
wychodzi nawet do internetu i SPF zgadza się sam z siebie.

**Dostarczanie potwierdzone 5 października 2026**: biuro potwierdziło, że
zgłoszenia z formularza docierają na `kontakt@biurodgc.pl`. Do tego dnia
była to jedyna nieprzetestowana ścieżka w całym serwisie.

Forminit zostaje podłączony jako zapas i **nie jest już niczym krytycznym**.
Można go odłączyć w dowolnej chwili bez zmiany w kodzie — `sendLead.js`
uznaje zgłoszenie za wysłane, gdy zadziała którakolwiek z dwóch dróg.
Gdyby kiedyś skończył się darmowy limit 100 zgłoszeń miesięcznie, też nic
się nie stanie: poczta leci niezależnie.

Jeśli kiedykolwiek pojawi się podejrzenie, że formularz przestał działać,
pierwsze, co trzeba sprawdzić, to `nadaj.php?test=dgc-sprawdzam`. Nic nie
wysyła, zwraca JSON ze stanem środowiska (`poczta`, `mbstring`, `licznik`).

---

## Pułapki, na które już wpadliśmy

**Top-level `await` w `main.jsx`** blokuje się z kawałkiem PersistGate.
Zero błędów w konsoli, wszystkie pliki pobrane z kodem 200, strona wygląda
poprawnie, bo widać prerenderowany HTML — ale React nigdy się nie montuje.
Opis w komentarzu w `main.jsx`. Nie zamieniaj tam funkcji asynchronicznej
na `await`.

**`node:fs` i `node:path` nie działają w funkcji `prerender`**, mimo że
wykonuje się ona w Node. `main.jsx` jest wejściem paczki przeglądarkowej
i Vite wycina z niej moduły wbudowane. Dane do prerenderu bierz przez
`import.meta.glob`.

**`DirectoryIndex index.html`** w głównym `.htaccess` sprawia, że katalog
bez `index.html` zwraca 403, a `ErrorDocument` podstawia stronę 404.
Wygląda to na pustą stronę. Katalog panelu ma własny `DirectoryIndex`.

**`react-router-dom`, nie `react-router`.** Osobny pakiet tworzy drugą kopię
modułu i budowanie wywala się na invariancie.

**ModSecurity na tym hostingu** potrafi odbić żądanie POST z pustym polem
formularza, zwracając 406 i stronę HTML zamiast JSON-a. Dotyczy zapytań
surowych, ruch z przeglądarki przechodzi. `sendLead.js` rozpoznaje odpowiedź,
która nie jest JSON-em, i mówi o tym wprost w konsoli.

---

## Po szablonie nie ma już śladu

Strona powstała na kupionym motywie „Medically". 5 października 2026 został
z niego usunięty cały balast — nie tylko ukryty, ale wyrzucony z repozytorium
i z paczki:

- **13 tras i 28 komponentów**: sklep, koszyk, kasa, potwierdzenie zamówienia,
  projekty, trzy warianty bloga, dwie dodatkowe strony główne, profile zespołu.
  Serwer i tak zwracał na nie 404, ale **router dorysowywał je w przeglądarce** —
  `/checkout/` pokazywało angielski formularz płatności kartą w nawigacji biura
  rachunkowego. Dziś pokazuje stronę 404.
- **Dane demo**: hasło `123456`, numer karty, adresy `admin@`.
- **Prefiks klas `wpo-`** (nazwa dostawcy motywu) zamieniony na `dgc-` —
  217 wystąpień. Zamiana sprawdzona przez porównanie HTML-a wszystkich
  podstron przed i po: zero różnic poza samym prefiksem.
- **Font ikon** `flaticon_medically` → `dgc-ikony`. Słowo „medically" nie
  występuje już nigdzie w gotowej paczce.
- **Dziewięć partiali SCSS** opisujących nieistniejące strony oraz katalogi
  obrazków sklepu, koszyka, lekarzy i zespołu.

Paczka JavaScriptu: **1 119 994 → 809 003 B** (o 28% mniej). Arkusz:
557 247 → 507 301 B.

Jeśli kiedyś trzeba będzie sprawdzić, czy coś nie zostało: `grep -ri
"medically\|wpo-" src/` ma nie dawać trafień poza komentarzami opisującymi
historię.

---

## Dlaczego aplikacja montuje się przez `createRoot`, a nie `hydrateRoot`

To jest świadoma decyzja, nie przeoczenie — i ma konsekwencję, o której
trzeba wiedzieć.

`src/main.jsx` używa `createRoot`, czyli React **wyrzuca prerenderowany HTML
i rysuje stronę od zera**. Skutek: atrybuty `loading="lazy"`,
`decoding="async"` i `width`/`height`, które dokłada `scripts/wydajnosc.mjs`
po budowaniu, **znikają w momencie montowania**. Zostają tylko dla robotów
nieuruchamiających JavaScriptu. Leniwe ładowanie obrazków w przeglądarce
więc nie działa.

Sama zamiana na `hydrateRoot` niczego nie naprawi, a pogorszy. `PersistGate`
przy pierwszym rysowaniu w przeglądarce zwraca `null` (stan z `localStorage`
nie istnieje przed `componentDidMount`), więc React porówna pełny HTML
z pustym drzewem, zgłosi rozjazd i **i tak odrzuci cały prerender** — tyle że
po zapłaceniu za przebieg hydracji. Rozjazd jest pewny na wszystkich
podstronach.

Żeby hydracja przeszła czysto, trzeba wcześniej poprawić cztery rzeczy:

1. `PersistGate` — podać `loading={children}` albo wyjąć go z korzenia,
2. `TeamSection` i `Testimonial` — `slidesToShow` liczone z `window.innerWidth`
   zmienia liczbę klonów w `react-slick`, czyli liczbę dzieci w DOM. Rozjazd
   strukturalny poniżej 992 px,
3. `KonsultacjaForm` — `min={dzisiaj()}` liczone przy rysowaniu. Po hydracji
   React zostawi wartość z HTML-a, czyli datę budowania, a walidator dalej
   porówna z prawdziwym dziś,
4. `Licznik` (`src/components/Licznik/Licznik.jsx`) — gdyby wróciła tam
   animacja zależna od przeglądarki.

Dopóki to nie jest zrobione, `createRoot` jest właściwym wyborem.

---

## Co zostało niezrobione

- **103 akapity w 19 artykułach udają punkty listy** — zaczynają się od
  myślnika zamiast być elementami `ul`. Celowo NIE poprawione automatem:
  w kilku plikach myślnik jest zwykłą interpunkcją, w innych kilka pozycji
  jest sklejonych w jednym akapicie, a jeszcze gdzie indziej akapit
  z myślnikiem to wprowadzenie do listy, nie jej część. Automat zepsułby
  treść. Do poprawienia w panelu, artykuł po artykule. Najwięcej:
  `spolka-jawna` (17), `spolka-partnerska` (16).
- **20 opisów meta krótszych niż 90 znaków**, w tym `spolka-akcyjna`
  (26 znaków) i `spolka-komandytowo-akcyjna` (23). `zTresci()`
  w `scripts/popraw-meta.mjs` dociąga tekst tylko z bloków typu `p`,
  a te artykuły zaczynają się od listy. Do poprawienia w panelu.
- **Obrazki bez `srcset` i bez WebP.** Miniatury 1200×628 renderują się na
  353×184, a w pasku bocznym na 90×47. Mobilna strona główna waży ok. 3 MB.
- **Fonty ikon**: `themify` nie ma wariantu WOFF2 (56 kB na każdej
  podstronie), FontAwesome pobiera 72 kB dla jednej strzałki poniżej 992 px.
- **373 artykuły mają okładkę z logo zamiast zdjęcia.** Obrazki z kupionego
  szablonu okazały się szarymi prostokątami z wypisanym rozmiarem.
- **215 opisów meta** to przycięte pierwsze akapity, a nie pisane opisy.
  Powstały automatycznie przy przenoszeniu artykułów z archiwum.
- **Filtry kategorii i miesiąca na liście porad działają tylko w JavaScripcie**
  i nie mają własnych adresów. Stronicowanie ma, i to wystarcza, żeby każdy
  artykuł miał odnośnik z HTML-a.
- **14 artykułów ze starej strony nie istnieje** — nie zachowały się w żadnym
  archiwum. Ich adresy przekierowują na listę porad.
