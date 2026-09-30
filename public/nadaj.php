<?php
declare(strict_types=1);

/**
 * Nadajnik poczty dla formularzy biurodgc.pl
 * ------------------------------------------
 * Po wyslaniu formularza robi dwie rzeczy:
 *   1. wysyla powiadomienie o zgloszeniu do biura,
 *   2. wysyla automatyczna odpowiedz do osoby, ktora zostawila zgloszenie.
 *
 * Czego ten plik NIE robi, celowo:
 *   - nie loguje sie do zadnej skrzynki i nie zna zadnego hasla,
 *   - nie czyta ani nie zapisuje niczego w imap/ ani Maildir/,
 *   - nie zapisuje tresci zgloszen na dysku (archiwum zostaje w Forminit),
 *   - nie przyjmuje adresu odbiorcy z zewnatrz. Biuro ma adres wpisany
 *     na sztywno nizej, a autoodpowiedz idzie wylacznie na adres podany
 *     w formularzu i tylko po przejsciu przez limit czestotliwosci.
 *
 * Dlaczego wlasny skrypt, a nie autoresponder dostawcy formularzy:
 * Forminit ma te funkcje dopiero w planie Business (ok. 490 USD rocznie),
 * a poczta domeny stoi na tym samym serwerze, wiec wiadomosc wyslana stad
 * wychodzi z wlasnej domeny i przechodzi SPF bez dodatkowej konfiguracji.
 *
 * Powiadomienie do biura jest tu WAZNIEJSZE niz autoodpowiedz. Darmowy plan
 * Forminit konczy sie na 100 zgloszeniach miesiecznie i po przekroczeniu
 * limitu odrzuca kolejne. Wtedy ten skrypt jest jedyna droga, ktora lead
 * dociera do biura, dlatego sendLead.js wola go ROWNOLEGLE z Forminit,
 * a nie dopiero po jego sukcesie.
 *
 * UWAGA przy .htaccess: caly serwis ma blokade wykonywania PHP
 * (RewriteRule \.(php|phtml|phar|php[0-9])$ - [F,L] w scripts/seo.mjs).
 * Ten jeden plik ma wyjatek wpisany PRZED ta blokada. Blokady nie wolno
 * zdejmowac w calosci, bo po starym WordPressie zostal katalog wp-content,
 * gdzie zwykle laduja podrzucone skrypty.
 */

// --- Konfiguracja ------------------------------------------------------

/** Skrzynka biura. Glowny odbiorca powiadomienia o zgloszeniu. */
const BIURO = 'kontakt@biurodgc.pl';

/**
 * Drugi odbiorca powiadomienia, w kopii. Opiekun strony, zeby widzial
 * zgloszenia bez zagladania do panelu Forminit i niezaleznie od jego
 * limitu 100 zgloszen miesiecznie.
 *
 * Pusty lancuch wylacza kopie. NIE zgaduj tu adresu: pusty jest bezpieczny,
 * bledny wysyla dane osobowe klientow pod nieznany adres.
 */
const OPIEKUN = 'chaoticshapes@gmail.com';

/** Nadawca obu wiadomosci. Musi byc adresem w domenie tego serwera. */
const NADAWCA = 'kontakt@biurodgc.pl';
const NADAWCA_NAZWA = 'DGC Biuro Rachunkowe';

/** Domena serwisu. Uzywana do rozpoznania adresow wlasnych. */
const DOMENA = 'biurodgc.pl';

/** Skad wolno wolac ten skrypt. */
const DOZWOLONE = ['https://biurodgc.pl', 'https://www.biurodgc.pl'];

/** Limit: ile autoodpowiedzi na jeden adres IP w oknie czasowym. */
const LIMIT_ILE = 8;
const LIMIT_OKNO = 600; // sekund

/** Gorny limit dlugosci pojedynczego pola i calego zgloszenia (w bajtach). */
const MAX_POLE = 4000;
const MAX_CALOSC = 20000;

/** Haslo do samotestu. Nie jest sekretem, ma tylko nie byc odgadywane
 *  przypadkiem przez robota indeksujacego. */
const KLUCZ_TESTU = 'dgc-sprawdzam';

// --- Odpowiedz ---------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow');

function koniec(int $kod, bool $ok, string $powod = ''): void {
    http_response_code($kod);
    echo json_encode(['ok' => $ok, 'powod' => $powod], JSON_UNESCAPED_UNICODE);
    exit;
}

// --- Samotest ----------------------------------------------------------
// Sluzy do sprawdzenia zaraz po wgraniu, czy PHP na tym hostingu dziala
// i czy da sie wysylac poczte. Nic nie wysyla.
//
// UWAGA, to nie jest kosmetyka: odpowiedz samotestu NIE MOZE zawierac
// klucza "ok". Gdyby zadanie POST trafilo w ktorakolwiek regule 301
// z .htaccess, przegladarka zamienia metode na GET i gubi cialo zadania.
// Skrypt zobaczylby wtedy GET, a gdyby odpowiedzial {"ok":true}, strona
// uznalaby to za udana wysylke. Nie byloby ani maila, ani ostrzezenia.

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    if (($_GET['test'] ?? '') !== KLUCZ_TESTU) {
        koniec(405, false, 'tylko POST');
    }
    echo json_encode([
        'samotest' => true,
        'poczta'   => function_exists('mail'),
        'mbstring' => function_exists('mb_substr'),
        'licznik'  => is_writable(katalogLicznika()),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    koniec(405, false, 'tylko POST');
}

// --- Kto puka ----------------------------------------------------------

// Origin sam w sobie nie jest zabezpieczeniem (da sie go podrobic poza
// przegladarka), ale odcina najtansze proby i przypadkowe wywolania.
$zrodloHttp = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($zrodloHttp === '' && !empty($_SERVER['HTTP_REFERER'])) {
    $cz = parse_url($_SERVER['HTTP_REFERER']);
    if (is_array($cz) && !empty($cz['scheme']) && !empty($cz['host'])) {
        $zrodloHttp = $cz['scheme'] . '://' . $cz['host'];
    }
}
if (!in_array($zrodloHttp, DOZWOLONE, true)) {
    koniec(403, false, 'obce zrodlo');
}

// Pole-pulapka. Prawdziwy formularz zawsze przysyla je puste. Sprawdzamy
// typ, bo _gotcha[]=x przyszloby jako tablica i rzutowanie na tekst dalo
// by "Array", czyli kazde takie zadanie bylo by po cichu uznane za bota.
$pulapka = $_POST['_gotcha'] ?? '';
if (!is_string($pulapka) || trim($pulapka) !== '') {
    // Bot dostaje sukces, zeby nie probowal dalej. Nic nie wysylamy.
    koniec(200, true);
}

// Gorny limit na calosc, zeby jedno zadanie nie zrobilo maila na kilkaset kB.
$calosc = 0;
foreach ($_POST as $v) {
    if (is_string($v)) $calosc += strlen($v);
}
if ($calosc > MAX_CALOSC) {
    koniec(413, false, 'zgloszenie za duze');
}

// --- Dane ze zgloszenia ------------------------------------------------

function bezSterujacych(string $v): string {
    // Flaga /u przy niepoprawnym UTF-8 zwraca null. Wtedy nie wolno
    // podstawic pustego lancucha, bo pole znikneloby po cichu razem
    // z trescia zgloszenia. Schodzimy wtedy na wariant bajtowy.
    $czysty = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
    if ($czysty === null) {
        $czysty = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $v);
    }
    return $czysty ?? '';
}

/**
 * Przyciecie do zadanej liczby ZNAKOW. Bez mbstring substr() tnie po
 * bajtach i potrafi rozciac polska litere na pol, co konczy sie krzakiem
 * na koncu tematu albo tresci. Dlatego wariant zapasowy dopina reszte
 * znaku wyrazeniem regularnym.
 */
function utnij(string $v, int $ile): string {
    if (function_exists('mb_substr')) return mb_substr($v, 0, $ile);
    $wynik = preg_match('/^.{0,' . $ile . '}/us', $v, $m) === 1 ? $m[0] : substr($v, 0, $ile);
    return $wynik;
}

function dlugosc(string $v): int {
    return function_exists('mb_strlen') ? mb_strlen($v) : strlen($v);
}

function pole(string $nazwa): string {
    $v = $_POST[$nazwa] ?? '';
    if (!is_string($v)) return '';
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);
    return utnij(trim(bezSterujacych($v)), MAX_POLE);
}

/** Wieloliniowe pole wiadomosci: nowe linie zostaja, znaki sterujace nie. */
function poleWielolinijkowe(string $nazwa): string {
    $v = $_POST[$nazwa] ?? '';
    if (!is_string($v)) return '';
    $v = str_replace(["\r\n", "\r", "\0"], ["\n", "\n", ''], $v);
    $czysty = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
    if ($czysty === null) {
        $czysty = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $v);
    }
    return utnij(trim($czysty ?? ''), MAX_POLE);
}

$email = pole('email');
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    koniec(400, false, 'zly adres');
}
// Podwojna kontrola: adres trafia do naglowka To:, wiec nie moze zawierac
// niczego, co pozwoliloby dopisac wlasny naglowek.
if (preg_match('/[\r\n,;<>]/', $email) === 1 || dlugosc($email) > 254) {
    koniec(400, false, 'zly adres');
}

$imie      = pole('imie');
$telefon   = pole('telefon');
$firma     = pole('firma');
$temat     = pole('temat');
$zrodlo    = pole('zrodlo');
$strona    = pole('strona');
$zgoda     = pole('zgoda');
$wiadomosc = poleWielolinijkowe('wiadomosc');

// Pozostale pola formularzy wyceny i konsultacji. Lista jest zamknieta
// swiadomie: do maila trafia tylko to, co znamy.
$dodatkowe = [];
foreach ([
    'formaPrawna'       => 'Forma prawna',
    'dokumenty'         => 'Dokumentów miesięcznie',
    'dataKonsultacji'   => 'Data konsultacji',
    'przedzial'         => 'Przedział godzin',
    'formaKonsultacji'  => 'Forma konsultacji',
    'formaDzialalnosci' => 'Forma działalności',
] as $kluczPola => $etykieta) {
    $v = pole($kluczPola);
    if ($v !== '') $dodatkowe[$etykieta] = $v;
}

// --- Limit czestotliwosci ---------------------------------------------
// Stoi PO walidacji, zeby smieciowe zadania nie zjadaly limitu prawdziwym
// klientom. Jeden maly plik na adres IP, a nie jeden wspolny: wspolny przy
// naplywie z puli adresow urosl by do megabajtow i byl przepisywany przy
// kazdym zgloszeniu. Trzymamy wylacznie licznik i czas, zadnych danych
// ze zgloszenia ani adresu IP w jawnej postaci.
//
// Gdy licznika nie da sie prowadzic, NIE wylaczamy go po cichu. Wysylka do
// biura idzie dalej, bo to najwazniejsze, ale autoodpowiedz jest wtedy
// wstrzymana, bo to ona jest czescia mozliwa do naduzycia.

function katalogLicznika(): string {
    return sys_get_temp_dir();
}

function limitPrzekroczony(bool &$dziala): bool {
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $klucz = hash('sha256', $ip . '|' . DOMENA . '|licznik');
    $plik = katalogLicznika() . '/dgc-lim-' . substr($klucz, 0, 24);
    $teraz = time();

    // Odmawiamy pracy na dowiazaniu: w katalogu wspolnym ktos moglby
    // podstawic dowiazanie do cudzego pliku i kazac nam go skrocic.
    if (is_link($plik)) { $dziala = false; return false; }

    $uchwyt = @fopen($plik, 'c+');
    if ($uchwyt === false) { $dziala = false; return false; }
    if (!flock($uchwyt, LOCK_EX)) { fclose($uchwyt); $dziala = false; return false; }

    $surowe = stream_get_contents($uchwyt);
    $stan = json_decode(is_string($surowe) ? $surowe : '', true);
    if (!is_array($stan) || !isset($stan['do'], $stan['ile']) || (int)$stan['do'] < $teraz) {
        $stan = ['ile' => 0, 'do' => $teraz + LIMIT_OKNO];
    }
    $stan['ile'] = (int)$stan['ile'] + 1;

    ftruncate($uchwyt, 0);
    rewind($uchwyt);
    fwrite($uchwyt, json_encode($stan));
    fflush($uchwyt);
    flock($uchwyt, LOCK_UN);
    fclose($uchwyt);

    $dziala = true;
    return $stan['ile'] > LIMIT_ILE;
}

$limitDziala = false;
$ponadLimit = limitPrzekroczony($limitDziala);

// --- Budowa wiadomosci -------------------------------------------------

function znaki(string $t): array {
    if (function_exists('mb_str_split')) return mb_str_split($t);
    $r = preg_split('//u', $t, -1, PREG_SPLIT_NO_EMPTY);
    return $r === false ? str_split($t) : $r;
}

/**
 * Temat maila w kodowaniu =?UTF-8?B?...?=
 *
 * Slowo zakodowane nie moze przekroczyc 75 znakow RAZEM z opakowaniem
 * (RFC 2047), a base64 puchnie o jedna trzecia. Dlatego tniemy tekst na
 * kawalki po 45 bajtow i sklejamy zlozeniem wiersza. Ciecie idzie po
 * znakach, nie po bajtach, zeby nie rozwalic polskiej litery na pol.
 */
function temat(string $t): string {
    $t = utnij(trim($t), 120);
    if ($t === '') return '';
    $czesci = [];
    $bufor = '';
    foreach (znaki($t) as $znak) {
        if ($bufor !== '' && strlen($bufor) + strlen($znak) > 45) {
            $czesci[] = $bufor;
            $bufor = '';
        }
        $bufor .= $znak;
    }
    if ($bufor !== '') $czesci[] = $bufor;
    $gotowe = [];
    foreach ($czesci as $c) $gotowe[] = '=?UTF-8?B?' . base64_encode($c) . '?=';
    return implode("\r\n ", $gotowe);
}

function nadawca(): string {
    return temat(NADAWCA_NAZWA) . ' <' . NADAWCA . '>';
}

/**
 * Imie wstawiane do powitania w wiadomosci, ktora idzie na adres podany
 * w formularzu. To jedyne miejsce, gdzie tresc od uzytkownika trafia do
 * maila wychodzacego na dowolny adres, wiec przepuszczamy wylacznie
 * litery, spacje, mysliniki i apostrofy. Cokolwiek innego znaczy probe
 * przemycenia wlasnej tresci i wtedy witamy bez imienia.
 */
function imieDoPowitania(string $v): string {
    $v = utnij(trim($v), 40);
    if ($v === '') return '';
    return preg_match('/^[\p{L}\p{M}\' -]+$/u', $v) === 1 ? $v : '';
}

/**
 * Adres wlasny albo rolowy. Autoodpowiedz na taki adres potrafi zapetlic
 * sie z autoresponderem po drugiej stronie (RFC 3834), a w przypadku
 * wlasnej domeny odpowiadalaby sama sobie.
 */
function adresRolowy(string $email): bool {
    $czesci = explode('@', strtolower($email));
    if (count($czesci) !== 2) return true;
    [$nazwa, $domena] = $czesci;
    if ($domena === DOMENA || substr($domena, -(strlen(DOMENA) + 1)) === '.' . DOMENA) return true;
    $role = [
        'postmaster', 'abuse', 'noreply', 'no-reply', 'donotreply', 'do-not-reply',
        'mailer-daemon', 'bounce', 'bounces', 'root', 'admin', 'webmaster', 'sekretariat',
    ];
    return in_array($nazwa, $role, true);
}

/**
 * Wysylka z nadawca koperty. Bez piatego argumentu koperta dostaje adres
 * uzytkownika serwera WWW, co psuje zgodnosc z SPF i sprawia, ze odbicia
 * nie wracaja na skrzynke biura. Czesc hostingow tego argumentu zabrania,
 * wiec przy niepowodzeniu probujemy jeszcze raz bez niego.
 */
function wyslij(string $do, string $tytul, string $tresc, array $naglowki): bool {
    $n = implode("\r\n", array_merge($naglowki, [
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ]));
    $cialo = chunk_split(base64_encode($tresc));
    if (@mail($do, $tytul, $cialo, $n, '-f' . NADAWCA)) return true;
    return @mail($do, $tytul, $cialo, $n);
}

/**
 * Wiadomosc w dwoch wersjach naraz: czysty tekst i HTML. Program pocztowy
 * bierze te, ktora umie pokazac.
 *
 * Wersja tekstowa nie jest tu formalnoscia. Czesc skrzynek pokazuje
 * wylacznie ja, a filtry antyspamowe traktuja HTML bez tekstowego
 * odpowiednika gorzej. Obie wersje musza niesc te sama tresc.
 */
function wyslijDwuczesciowy(string $do, string $tytul, string $tekst, string $html, array $naglowki): bool {
    $granica = 'dgc-' . md5(uniqid('', true));
    $n = implode("\r\n", array_merge($naglowki, [
        'Content-Type: multipart/alternative; boundary="' . $granica . '"',
    ]));
    $cialo = "--$granica\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($tekst)) . "\r\n"
        . "--$granica\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n"
        . "--$granica--\r\n";
    if (@mail($do, $tytul, $cialo, $n, '-f' . NADAWCA)) return true;
    return @mail($do, $tytul, $cialo, $n);
}

$naglowkiWspolne = [
    'MIME-Version: 1.0',
    'From: ' . nadawca(),
    'X-Mailer: biurodgc.pl',
];

// 1. Powiadomienie do biura -------------------------------------------

$trescBiuro = "Nowe zgłoszenie ze strony biurodgc.pl\n"
    . str_repeat('-', 48) . "\n\n"
    . ($imie !== ''    ? "Imię i nazwisko: $imie\n" : '')
    . "E-mail: $email\n"
    . ($telefon !== '' ? "Telefon: $telefon\n" : '')
    . ($firma !== ''   ? "Firma: $firma\n" : '')
    . ($temat !== ''   ? "Temat: $temat\n" : '');

foreach ($dodatkowe as $etykieta => $v) {
    $trescBiuro .= "$etykieta: $v\n";
}

if ($wiadomosc !== '') {
    // Wciecie, zeby tresc od uzytkownika nie mogla udawac kolejnej
    // linii naglowkowej tego podsumowania.
    $trescBiuro .= "\nWiadomość:\n  " . str_replace("\n", "\n  ", $wiadomosc) . "\n";
}

if ($zgoda !== '') {
    $trescBiuro .= "\nZgoda: $zgoda\n";
}

$trescBiuro .= "\n" . str_repeat('-', 48) . "\n"
    . ($zrodlo !== '' ? "Formularz: $zrodlo\n" : '')
    . ($strona !== '' ? "Podstrona: $strona\n" : '')
    . 'Data: ' . date('Y-m-d H:i:s') . "\n\n"
    . "Odpowiadając na tego maila piszesz prosto do klienta.\n";

$naglowkiBiuro = array_merge($naglowkiWspolne, [
    'Reply-To: ' . $email,
    // To powiadomienie o leadzie, a nie odpowiedz na cudzy list. Wartosc
    // inna niz "no" jest dla filtrow sygnalem poczty maszynowej i potrafi
    // zepchnac wiadomosc poza skrzynke glowna (RFC 3834).
    'Auto-Submitted: no',
]);

// Kazdy odbiorca dostaje wlasna wiadomosc, zamiast jednej z naglowkiem Cc.
// Powod: mail() uruchamia sendmaila z przelacznikiem -t, czyli odbiorcow
// czyta z naglowkow. Zwykle dziala, ale przy innej konfiguracji hostingu
// kopia przepadlaby po cichu. Przy osobnej wysylce mail() zwraca wynik
// dla kazdego adresu z osobna i wiadomo, co doszlo.
$tytulBiuro = temat('Zgłoszenie ze strony' . ($temat !== '' ? ': ' . utnij($temat, 60) : ''));

$odbiorcy = [BIURO];
if (OPIEKUN !== '' && strcasecmp(OPIEKUN, BIURO) !== 0) {
    $odbiorcy[] = OPIEKUN;
}

$poszloBiuro = false;
$nieudaneKopie = [];
foreach ($odbiorcy as $odbiorca) {
    $ok = wyslij($odbiorca, $tytulBiuro, $trescBiuro, $naglowkiBiuro);
    // O powodzeniu calosci decyduje skrzynka biura. Kopia dla opiekuna
    // jest wygoda, nie warunkiem przyjecia zgloszenia.
    if ($odbiorca === BIURO) {
        $poszloBiuro = $ok;
    } elseif (!$ok) {
        $nieudaneKopie[] = 'kopia';
    }
}

// 2. Automatyczna odpowiedz do klienta ---------------------------------

$poszlaOdpowiedz = true;
$pominietaOdpowiedz = '';

// Formularz newslettera stoi w pieciu miejscach i kazde podaje wlasne
// zrodlo: newsletter, newsletter-home, newsletter-porady, newsletter-oferta,
// newsletter-popup. Dlatego przedrostek, a nie dokladna wartosc.
// Potwierdzenie zapisu wysyla narzedzie do mailingu, a dwie wiadomosci
// za jednym klknieciem to o jedna za duzo.
if (strncmp($zrodlo, 'newsletter', 10) === 0) {
    $pominietaOdpowiedz = 'newsletter';
} elseif (adresRolowy($email)) {
    $pominietaOdpowiedz = 'adres rolowy';
} elseif (!$limitDziala) {
    $pominietaOdpowiedz = 'licznik niedostepny';
} elseif ($ponadLimit) {
    $pominietaOdpowiedz = 'limit';
} else {
    $imieCzyste = imieDoPowitania($imie);
    $powitanie = $imieCzyste !== '' ? "Dzień dobry, $imieCzyste," : 'Dzień dobry,';

    // Wersja tekstowa. Pelna tresc, bez skrotow: czesc skrzynek pokazuje
    // wylacznie ja, a filtry antyspamowe patrza na nia tak samo uwaznie
    // jak na HTML.
    $trescKlient = "$powitanie\n\n"
        . "dziękujemy za kontakt. Twoja wiadomość do nas dotarła.\n"
        . "Odpowiemy na nią w godzinach pracy biura, zwykle tego samego\n"
        . "albo następnego dnia roboczego.\n\n"
        . "Jeśli sprawa jest pilna, zadzwoń: 731 580 184\n"
        . "(poniedziałek-piątek, 8:00-16:00).\n\n"
        . "Pozdrawiamy\n"
        . "DGC Biuro Rachunkowe\n\n"
        . str_repeat('-', 56) . "\n"
        . "DGC Biuro Rachunkowe spółka z ograniczoną odpowiedzialnością\n"
        . "ul. Brukowa 8, 91-341 Łódź\n"
        . "NIP: 9471976277 | REGON: 101073765\n"
        . "E-mail: kontakt@biurodgc.pl | tel. 731 580 184\n"
        . "https://biurodgc.pl/\n"
        . "Oddział: ul. Toruńska 73, 62-600 Koło, tel. 510 002 230\n\n"
        . "Ta wiadomość została wysłana automatycznie, ale możesz na nią\n"
        . "odpowiedzieć. Odpowiedź trafi na naszą skrzynkę.\n";

    // Wersja HTML. Uklad na tabelach i style pisane przy elementach, bo
    // programy pocztowe nie czytaja arkuszy i slabo radza sobie z flexem.
    // Logo lezy na wlasnej domenie: doklejanie obrazka do wiadomosci
    // podnosi jej wage i czesciej wpada w filtry. Wiadomosc ma czytac sie
    // tak samo dobrze, gdy skrzynka zablokuje obrazki, dlatego logo ma
    // opis tekstowy, a zadna tresc nie siedzi w obrazku.
    $logo = 'https://' . DOMENA . '/logo-mail.jpg';
    $h = static function (string $t): string {
        return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };

    $trescHtml = '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>' . $h('Dziękujemy za wiadomość') . '</title></head>'
        . '<body style="margin:0;padding:0;background:#fdfcfc;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdfcfc;">'
        . '<tr><td align="center" style="padding:32px 16px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(13,68,68,0.13);border-radius:12px;">'

        . '<tr><td style="padding:32px 32px 8px;">'
        . '<img src="' . $h($logo) . '" width="200" height="116" alt="DGC Biuro Rachunkowe"'
        . ' style="display:block;border:0;width:200px;height:auto;">'
        . '</td></tr>'

        . '<tr><td style="padding:16px 32px 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:26px;color:#0d4444;">'
        . '<p style="margin:0 0 16px;">' . $h($powitanie) . '</p>'
        . '<p style="margin:0 0 16px;">dziękujemy za kontakt. Twoja wiadomość do nas dotarła.'
        . ' Odpowiemy na nią w godzinach pracy biura, zwykle tego samego albo następnego dnia roboczego.</p>'
        . '<p style="margin:0 0 24px;">Jeśli sprawa jest pilna, zadzwoń:'
        . ' <a href="tel:+48731580184" style="color:#b50b50;text-decoration:none;font-weight:bold;">731&nbsp;580&nbsp;184</a>'
        . '<br><span style="color:rgba(13,68,68,0.7);font-size:14px;">poniedziałek-piątek, 8:00-16:00</span></p>'
        . '<p style="margin:0 0 4px;">Pozdrawiamy</p>'
        . '<p style="margin:0 0 24px;font-weight:bold;">DGC Biuro Rachunkowe</p>'
        . '</td></tr>'

        . '<tr><td style="padding:0 32px;"><hr style="border:0;border-top:1px solid rgba(13,68,68,0.13);margin:0;"></td></tr>'

        . '<tr><td style="padding:20px 32px 28px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:21px;color:rgba(13,68,68,0.75);">'
        . '<strong style="color:#0d4444;">DGC Biuro Rachunkowe spółka z ograniczoną odpowiedzialnością</strong><br>'
        . 'ul. Brukowa 8, 91-341 Łódź<br>'
        . 'NIP: 9471976277 &nbsp;|&nbsp; REGON: 101073765<br>'
        . '<a href="mailto:kontakt@biurodgc.pl" style="color:#0d4444;">kontakt@biurodgc.pl</a>'
        . ' &nbsp;|&nbsp; <a href="tel:+48731580184" style="color:#0d4444;">731 580 184</a>'
        . ' &nbsp;|&nbsp; <a href="https://biurodgc.pl/" style="color:#0d4444;">biurodgc.pl</a><br>'
        . 'Oddział: ul. Toruńska 73, 62-600 Koło, tel. '
        . '<a href="tel:+48510002230" style="color:#0d4444;">510 002 230</a>'
        . '</td></tr>'

        . '<tr><td style="padding:0 32px 28px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:19px;color:rgba(13,68,68,0.55);">'
        . 'Ta wiadomość została wysłana automatycznie, ale możesz na nią odpowiedzieć.'
        . ' Odpowiedź trafi na naszą skrzynkę.'
        . '</td></tr>'

        . '</table></td></tr></table></body></html>';

    $naglowkiKlient = array_merge($naglowkiWspolne, [
        'Reply-To: ' . NADAWCA,
        // Zeby autoodpowiedz po drugiej stronie nie odbila sie w kolko.
        'Auto-Submitted: auto-replied',
        'X-Auto-Response-Suppress: All',
        // "bulk" jest wartoscia, ktora filtry naprawde rozpoznaja.
        'Precedence: bulk',
    ]);

    $poszlaOdpowiedz = wyslijDwuczesciowy(
        $email,
        temat('Dziękujemy za wiadomość, DGC Biuro Rachunkowe'),
        $trescKlient,
        $trescHtml,
        $naglowkiKlient
    );
}

// Nieudana wysylka zostawia slad w logu serwera. Bez adresu i bez tresci,
// zeby log nie stal sie drugim miejscem, w ktorym leza dane osobowe.
if (!$poszloBiuro) {
    error_log('[DGC] mail() odmowil wyslania powiadomienia do biura');
}
if (!$poszlaOdpowiedz) {
    error_log('[DGC] mail() odmowil wyslania automatycznej odpowiedzi');
}

// Zgloszenie moze lezec juz w Forminit, wiec nieudana wysylka nie jest
// powodem do pokazywania bledu osobie po drugiej stronie. Pole "powod"
// niesie szczegol do konsoli przegladarki. "biuro" znaczy, ze najwazniejsza
// z dwoch wiadomosci nie wyszla.
$powod = $nieudaneKopie;
if (!$poszloBiuro) $powod[] = 'biuro';
if (!$poszlaOdpowiedz) $powod[] = 'odpowiedz';
if ($pominietaOdpowiedz !== '') $powod[] = 'pominieto: ' . $pominietaOdpowiedz;

koniec(200, $poszloBiuro, implode(', ', $powod));
