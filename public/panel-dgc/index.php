<?php
declare(strict_types=1);

/**
 * Panel redakcyjny DGC — dodawanie i edycja artykulow.
 *
 * Zalozenia, ktore tlumacza wszystkie decyzje ponizej:
 *
 * 1. Obsluguja to ksiegowe, nie programisci. Zadnego HTML-a w formularzu,
 *    zadnego przeciagania blokow. Zwykle pole tekstowe i cztery znaki
 *    specjalne, ktore mozna zapamietac w minute.
 * 2. Po odejsciu agencji nikt tego nie bedzie aktualizowal. Wiec zero bazy
 *    danych, zero bibliotek, zero wgrywania plikow. Im mniej kodu, tym
 *    mniej rzeczy do zepsucia przez kolejne lata.
 * 3. Strona ma dzialac, nawet gdy panel padnie. Dlatego panel pisze gotowe
 *    pliki HTML, a nie renderuje stron na zadanie.
 *
 * Hasla nie ma w kodzie. Ustawia sie je przy pierwszym wejsciu i trafia
 * do dane/konfig.php jako skrot, ktorego nie da sie odwrocic.
 */

require __DIR__ . '/generator.php';

const KONFIG = DANE . '/konfig.php';
const LIMIT_PROB = 5;
const LIMIT_OKNO = 900; // 15 minut

session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict',
    'secure' => (($_SERVER['HTTPS'] ?? '') === 'on')]);
session_name('dgcpanel');
session_start();

header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');
// style-src MUSI miec 'self'. Przez pierwsze wersje panelu caly styl siedzial
// w <style> w naglowku, wiec wystarczalo samo 'unsafe-inline' — i tak bylo tu
// wpisane. Gdy 02.11.2026 doszly arkusze szablonu jako osobne pliki, wszystkie
// trzy zostaly ZABLOKOWANE, a ekran logowania pokazal sie jako goly HTML.
// Zadne narzedzie z linii polecen tego nie zlapie: curl ignoruje CSP, a plik
// zwraca poprawne 200 z content-type text/css. Widac to dopiero w przegladarce.
// 'unsafe-inline' zostaje na zapas: nic go dzis nie potrzebuje, ale styl
// wpisany w atrybut style=" " w ktoryms widoku nadal by na nim stal.
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");

// --- pomocnicze ---------------------------------------------------------

function konfig(): ?array {
    if (!is_file(KONFIG)) return null;
    $d = @include KONFIG;
    return is_array($d) ? $d : null;
}

function zalogowany(): bool {
    return !empty($_SESSION['dgc_ok']);
}

function token(): string {
    if (empty($_SESSION['dgc_token'])) $_SESSION['dgc_token'] = bin2hex(random_bytes(16));
    return $_SESSION['dgc_token'];
}

function sprawdzToken(): bool {
    return !empty($_POST['token']) && hash_equals($_SESSION['dgc_token'] ?? '', (string)$_POST['token']);
}

/** Limit prob logowania na adres IP. Plik w katalogu tymczasowym. */
function limitLogowania(bool $nieudana = false): bool {
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $plik = sys_get_temp_dir() . '/dgc-panel-' . substr(hash('sha256', $ip . '|panel'), 0, 20);
    $teraz = time();
    $stan = ['ile' => 0, 'do' => $teraz + LIMIT_OKNO];
    if (is_file($plik)) {
        $d = json_decode((string)@file_get_contents($plik), true);
        if (is_array($d) && ($d['do'] ?? 0) > $teraz) $stan = $d;
    }
    if ($nieudana) {
        $stan['ile'] = (int)$stan['ile'] + 1;
        @file_put_contents($plik, json_encode($stan));
    }
    return $stan['ile'] < LIMIT_PROB;
}

function przekieruj(string $adres): void {
    header('Location: ' . $adres);
    exit;
}

// --- akcje --------------------------------------------------------------

$konfig = konfig();
$komunikat = '';
$blad = '';

// Pierwsze uruchomienie: ustawienie hasla. Mozliwe TYLKO gdy konfiguracji
// jeszcze nie ma — inaczej ktokolwiek moglby nadpisac cudze haslo.
if ($konfig === null) {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['nowe_haslo'])) {
        $h1 = (string)$_POST['nowe_haslo'];
        $h2 = (string)($_POST['powtorz'] ?? '');
        if (mb_strlen($h1) < 12) {
            $blad = 'Hasło musi mieć co najmniej 12 znaków.';
        } elseif ($h1 !== $h2) {
            $blad = 'Hasła nie są takie same.';
        } else {
            $tresc = "<?php return " . var_export(['haslo' => password_hash($h1, PASSWORD_DEFAULT)], true) . ";\n";
            if (zapiszAtomowo(KONFIG, $tresc)) {
                $_SESSION['dgc_ok'] = true;
                przekieruj('?');
            }
            $blad = 'Nie udało się zapisać hasła. Sprawdź uprawnienia katalogu dane/.';
        }
    }
    widokPierwszeUruchomienie($blad);
    exit;
}

if (($_GET['akcja'] ?? '') === 'wyloguj') {
    session_destroy();
    przekieruj('?');
}

if (!zalogowany()) {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['haslo'])) {
        if (!limitLogowania()) {
            $blad = 'Za dużo prób logowania. Spróbuj ponownie za kwadrans.';
        } elseif (password_verify((string)$_POST['haslo'], $konfig['haslo'])) {
            session_regenerate_id(true);
            $_SESSION['dgc_ok'] = true;
            przekieruj('?');
        } else {
            limitLogowania(true);
            $blad = 'Nieprawidłowe hasło.';
        }
    }
    widokLogowania($blad);
    exit;
}

// --- od tego miejsca uzytkownik jest zalogowany -------------------------

$wpisy = wczytajWpisy();
$akcja = (string)($_GET['akcja'] ?? 'lista');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat, $wpisy] = zapiszWpis($wpisy);
        if ($blad === '') $akcja = 'lista';
    }
}

// --- szkice -------------------------------------------------------------
// Szkic to artykul zapisany, ale jeszcze niewidoczny na stronie. Lezy poza
// dane/wpisy.json, wiec nie wchodzi ani na liste porad, ani do mapy strony,
// ani do podpowiedzi. Publikacja to osobne, swiadome klikniecie.

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'szkic') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszSzkic();
        if ($blad === '') $akcja = 'szkice';
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'publikuj-szkic') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat, $wpisy] = opublikujSzkic((string)($_POST['id'] ?? ''), $wpisy);
        $akcja = $blad === '' ? 'lista' : 'szkice';
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'usun-szkic') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        $id = (string)($_POST['id'] ?? '');
        $szkice = array_values(array_filter(wczytajSzkice(), static fn($sz) => ($sz['id'] ?? '') !== $id));
        $komunikat = zapiszSzkice($szkice) ? 'Szkic usunięty.' : '';
        if ($komunikat === '') $blad = 'Nie udało się usunąć szkicu.';
        $akcja = 'szkice';
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-strony') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszTekstyStronZFormularza();
    }
    $akcja = 'strony';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-cennik') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszCennik();
    }
    $akcja = 'cennik';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-faq') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszFaq();
    }
    $akcja = 'faq';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-konsultacje') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszKonsultacje();
    }
    $akcja = 'konsultacje';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-kontakt') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszKontakt();
    }
    $akcja = 'kontakt';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['co'] ?? '') === 'zapisz-oferte') {
    if (!sprawdzToken()) {
        $blad = 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.';
    } else {
        [$blad, $komunikat] = zapiszOferte();
    }
    $akcja = 'oferta';
}

if ($akcja === 'oferta') {
    $slugOferty = (string)($_GET['slug'] ?? '');
    $oferta = wczytajOferte();
    if ($slugOferty !== '' && isset($oferta[$slugOferty])) {
        widokOferty($slugOferty, $oferta[$slugOferty], $komunikat, $blad);
    } else {
        widokListyOferty($oferta, $komunikat, $blad);
    }
    exit;
}

if ($akcja === 'kontakt') {
    widokKontaktu(wczytajKontakt(), $komunikat, $blad);
    exit;
}

if ($akcja === 'konsultacje') {
    widokKonsultacji(wczytajKonsultacje(), $komunikat, $blad);
    exit;
}

if ($akcja === 'strony') {
    widokTekstowStron(wczytajTekstyStron(), $komunikat, $blad);
    exit;
}

if ($akcja === 'cennik') {
    widokCennika(wczytajTrescStrony('cennik'), $komunikat, $blad);
    exit;
}

if ($akcja === 'faq') {
    widokFaq(wczytajTrescStrony('faq'), $komunikat, $blad);
    exit;
}

if ($akcja === 'szkice') {
    widokSzkicow(wczytajSzkice(), $komunikat, $blad);
    exit;
}

if ($akcja === 'edytuj-szkic') {
    $sz = szkicPoId(wczytajSzkice(), (string)($_GET['id'] ?? ''));
    if (!$sz) { $blad = 'Nie ma takiego szkicu.'; widokSzkicow(wczytajSzkice(), '', $blad); exit; }
    widokFormularza(null, (string)($sz['tresc'] ?? ''), $blad, $sz);
    exit;
}

if ($akcja === 'nowy' || $akcja === 'edytuj') {
    $slug = (string)($_GET['slug'] ?? '');
    $wpis = null;
    $tresc = '';
    foreach ($wpisy as $w) if ($w['slug'] === $slug) { $wpis = $w; break; }
    if ($wpis) $tresc = tekstZBlokow(wczytajTresc($slug));
    widokFormularza($wpis, $tresc, $blad);
    exit;
}

widokListy($wpisy, $komunikat, $blad);

// =======================================================================
//  ZAPIS
// =======================================================================

/**
 * Zapis szkicu. Celowo LAGODNIEJSZY niz zapiszWpis(): szkic wolno zostawic
 * niedokonczony, bo po to jest. Pelna kontrola pol odpala sie dopiero przy
 * publikacji — i to ta sama, co przy zwyklym zapisie artykulu.
 */
function zapiszSzkic(): array {
    $tytul = trim((string)($_POST['tytul'] ?? ''));
    if ($tytul === '') return ['Szkic musi mieć tytuł — po nim go odnajdziesz.', ''];
    if (mb_strlen($tytul) > 160) return ['Tytuł jest za długi (maksimum 160 znaków).', ''];

    $szkice = wczytajSzkice();
    $id = (string)($_POST['szkic_id'] ?? '');
    $stary = $id !== '' ? szkicPoId($szkice, $id) : null;

    // Zdjecie: nowe wgrane albo to, ktore szkic juz mial.
    $bladZdjecia = null;
    $wgrane = isset($_FILES['zdjecie']) ? zapiszObrazek($_FILES['zdjecie'], $bladZdjecia) : null;
    if ($bladZdjecia !== null) return [$bladZdjecia, ''];
    $obrazek = $wgrane ?: (string)($_POST['obrazek_biezacy'] ?? ($stary['obrazek'] ?? ''));

    $nowy = [
        'id'        => $id !== '' ? $id : bin2hex(random_bytes(8)),
        'title'     => $tytul,
        'tag'       => in_array((string)($_POST['tag'] ?? ''), KATEGORIE, true) ? (string)$_POST['tag'] : KATEGORIE[0],
        'opis'      => trim((string)($_POST['opis'] ?? '')),
        'data'      => (string)($_POST['data'] ?? ''),
        'tresc'     => (string)($_POST['tresc'] ?? ''),
        'obrazek'   => $obrazek,
        'zmieniony' => date('Y-m-d H:i'),
    ];

    if ($stary) {
        foreach ($szkice as $i => $sz) if (($sz['id'] ?? '') === $id) { $szkice[$i] = $nowy; break; }
    } else {
        array_unshift($szkice, $nowy);
    }

    if (!zapiszSzkice($szkice)) return ['Nie udało się zapisać szkicu.', ''];
    return ['', 'Szkic zapisany. Nie ma go jeszcze na stronie — opublikujesz go przyciskiem.'];
}

/**
 * Publikacja szkicu.
 *
 * Nie powielamy tu logiki publikowania. Przekladamy pola szkicu do $_POST
 * i wolamy zapiszWpis() — dokladnie te sama funkcje, ktora obsluguje zwykly
 * zapis. Dzieki temu szkic przechodzi ta sama kontrole pol, tak samo powstaje
 * strona, tak samo odswiezaja sie sasiedzi, listy i mapa strony. Gdyby byla
 * tu druga sciezka publikacji, predzej czy pozniej rozjechalaby sie z tamta.
 */
function opublikujSzkic(string $id, array $wpisy): array {
    $szkice = wczytajSzkice();
    $sz = szkicPoId($szkice, $id);
    if (!$sz) return ['Nie ma takiego szkicu.', '', $wpisy];

    $_POST['tytul']            = (string)($sz['title'] ?? '');
    $_POST['tag']              = (string)($sz['tag'] ?? '');
    $_POST['opis']             = (string)($sz['opis'] ?? '');
    $_POST['data']             = (string)($sz['data'] ?? '');
    $_POST['tresc']            = (string)($sz['tresc'] ?? '');
    $_POST['slug_stary']       = '';
    $_POST['obrazek_biezacy']  = (string)($sz['obrazek'] ?? '');
    $_FILES = [];  // zdjecie szkic ma juz wgrane, nic nie przychodzi formularzem

    [$blad, $komunikat, $wpisy] = zapiszWpis($wpisy);
    if ($blad !== '') return [$blad, '', $wpisy];

    // Dopiero gdy artykul naprawde stanal — kasujemy szkic.
    $szkice = array_values(array_filter($szkice, static fn($x) => ($x['id'] ?? '') !== $id));
    zapiszSzkice($szkice);

    return ['', 'Opublikowane. ' . $komunikat, $wpisy];
}

function zapiszWpis(array $wpisy): array {
    $tytul = trim((string)($_POST['tytul'] ?? ''));
    $tag = (string)($_POST['tag'] ?? '');
    $opis = trim((string)($_POST['opis'] ?? ''));
    $data = (string)($_POST['data'] ?? '');
    $tresc = (string)($_POST['tresc'] ?? '');
    $slugStary = trim((string)($_POST['slug_stary'] ?? ''));

    if ($tytul === '') return ['Tytuł nie może być pusty.', '', $wpisy];
    if (mb_strlen($tytul) > 160) return ['Tytuł jest za długi (maksimum 160 znaków).', '', $wpisy];
    if (!in_array($tag, KATEGORIE, true)) return ['Wybierz kategorię z listy.', '', $wpisy];
    if ($opis === '') return ['Krótki opis nie może być pusty — pokazuje się na liście i w Google.', '', $wpisy];
    if (mb_strlen($opis) > 400) return ['Opis jest za długi (maksimum 400 znaków).', '', $wpisy];
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) return ['Podaj poprawną datę.', '', $wpisy];

    $bloki = blokiZTekstu($tresc);
    if (!$bloki) return ['Treść artykułu jest pusta.', '', $wpisy];

    // Tabele z poprzedniej wersji: panel ich nie tworzy, ale nie wolno ich
    // zgubic przy edycji. Przenosimy je ze starej tresci na te same miejsca.
    if ($slugStary !== '') {
        $stare = wczytajTresc($slugStary);
        $tabele = array_values(array_filter($stare, static fn($b) => ($b['t'] ?? '') === 'tabela'));
        if ($tabele) {
            $wynik = [];
            $i = 0;
            foreach ($bloki as $b) {
                if (($b['t'] ?? '') === 'p' && str_contains((string)($b['x'] ?? ''), '[tabela zachowana')) {
                    if (isset($tabele[$i])) { $wynik[] = $tabele[$i]; $i++; continue; }
                    continue;
                }
                $wynik[] = $b;
            }
            $bloki = $wynik;
        }
    }

    // Zdjecie: nowe wgrane, albo dotychczasowe, albo okladka firmowa.
    $bladZdjecia = null;
    $wgrane = isset($_FILES['zdjecie']) ? zapiszObrazek($_FILES['zdjecie'], $bladZdjecia) : null;
    if ($bladZdjecia !== null) return [$bladZdjecia, '', $wpisy];
    $obrazek = $wgrane ?: ((string)($_POST['obrazek_biezacy'] ?? '') ?: domyslnaOkladka($wpisy));

    $slug = $slugStary !== '' ? $slugStary : naSlug($tytul);
    if ($slug === '') return ['Z tego tytułu nie da się zrobić adresu. Dodaj w nim litery.', '', $wpisy];

    if ($slugStary === '') {
        foreach ($wpisy as $w) {
            if ($w['slug'] === $slug) return ['Artykuł o takim adresie już istnieje. Zmień tytuł.', '', $wpisy];
        }
    }

    [$rok, $mies, $dzien] = array_map('intval', explode('-', $data));
    $nowy = [
        'slug' => $slug,
        'title' => $tytul,
        'tag' => $tag,
        'description' => $opis,
        'author' => 'DGC Biuro Rachunkowe',
        'create_at' => "$dzien " . MIESIACE[$mies] . " $rok",
        'archiveMonth' => sprintf('%04d-%02d', $rok, $mies),
        'archiveLabel' => MIESIACE_ET[$mies] . " $rok",
        'obrazek' => $obrazek,
    ];

    // Podmiana albo dopisanie, potem sortowanie od najnowszego.
    //
    // Sortujemy po dacie w zapisie ISO, a nie po polskim zapisie slownym.
    // Wczesniej bylo tu strcmp($b['archiveMonth'].$b['create_at'], ...), co
    // porownuje "4 października 2026" z "22 października 2026" znak po znaku:
    // "4" > "2", wiec czwarty wypadal nad dwudziestym drugim. Jeden zapis
    // w panelu przestawial w ten sposob cala liste — na zywej stronie dalo
    // to 60 par ustawionych odwrotnie.
    $bezNiego = array_values(array_filter($wpisy, static fn($w) => $w['slug'] !== $slug));
    $bezNiego[] = $nowy;

    $klucz = static function (array $w): string {
        $iso = isoZDaty((string)($w['create_at'] ?? ''));
        // Wpis z niecytelna data ladu je na koncu swojego miesiaca, zamiast
        // wywracac cala liste.
        return $iso !== '' ? $iso : ((string)($w['archiveMonth'] ?? '') . '-00');
    };

    // Przy tej samej dacie trzymamy dotychczasowa kolejnosc. usort w PHP 7.4
    // nie jest stabilny, a bez tego trzynascie wpisow z powtorzona data
    // przeskakiwaloby przy kazdym zapisie i za kazdym razem trzeba by
    // przebudowac wszystkie strony listy.
    $pozycje = [];
    foreach ($bezNiego as $i => $w) $pozycje[$w['slug']] = $i;

    usort($bezNiego, static function (array $a, array $b) use ($klucz, $pozycje): int {
        $r = strcmp($klucz($b), $klucz($a));
        if ($r !== 0) return $r;
        return ($pozycje[$a['slug']] ?? 0) <=> ($pozycje[$b['slug']] ?? 0);
    });
    $wpisy = $bezNiego;

    // Kopia poprzedniej wersji, zeby dalo sie cofnac zla zmiane.
    // Katalog tworzymy sami: przy pierwszej edycji jeszcze go nie ma,
    // a bez niego kopia nie powstawala po cichu i nie bylo do czego wracac.
    if ($slugStary !== '') {
        $stary = DANE . '/tresci/' . $slug . '.json';
        if (is_file($stary)) {
            $katKopii = DANE . '/kopie';
            if (!is_dir($katKopii)) @mkdir($katKopii, 0755, true);
            @copy($stary, $katKopii . '/' . $slug . '-' . date('Ymd-His') . '.json');
        }
    }

    if (!zapiszAtomowo(DANE . '/tresci/' . $slug . '.json', (string)json_encode($bloki, JSON_UNESCAPED_UNICODE))) {
        return ['Nie udało się zapisać treści artykułu.', '', $wpisy];
    }
    if (!zapiszWpisy($wpisy)) {
        return ['Nie udało się zapisać listy artykułów.', '', $wpisy];
    }

    $nr = 0;
    foreach ($wpisy as $i => $w) if ($w['slug'] === $slug) { $nr = $i; break; }

    $bladStrony = null;
    if (!zapiszStroneArtykulu($nowy, $bloki, $wpisy, $nr, $bladStrony)) {
        return ["Dane zapisane, ale nie powstala strona artykulu: $bladStrony", '', $wpisy];
    }

    // Sasiedzi maja teraz inne odnosniki "poprzedni/nastepny".
    //
    // Nie przebudowujemy calej kategorii, choc nowy wpis wchodzi do bloku
    // "Podobne wpisy" u swoich sasiadow z tej samej kategorii. Tam bywa
    // blisko stu artykulow, a zapis stu stron przy kazdym zapisie trwalby
    // zbyt dlugo na tym hostingu. Tamte strony dalej pokazuja trzy wpisy
    // z WLASCIWEJ kategorii, tylko nie te najnowsze, a po wczytaniu listy
    // z serwera przegladarka i tak podmienia je na aktualne.
    foreach ([$nr - 1, $nr + 1] as $sasiad) {
        if (!isset($wpisy[$sasiad])) continue;
        $s = $wpisy[$sasiad];
        zapiszStroneArtykulu($s, wczytajTresc($s['slug']), $wpisy, $sasiad);
    }

    $stron = odswiezListy($wpisy);
    odswiezMape($wpisy);

    return ['', "Zapisane. Odświeżono stronę artykułu i $stron stron listy.", $wpisy];
}

/** Okladka firmowa, ta sama co w reszcie artykulow bez wlasnego zdjecia. */
function domyslnaOkladka(array $wpisy): string {
    foreach ($wpisy as $w) {
        if (str_contains($w['obrazek'] ?? '', 'okladka-dgc')) return $w['obrazek'];
    }
    return '';
}

// =======================================================================
//  WIDOKI
// =======================================================================

function naglowek(string $tytul): void {
    $t = h($tytul);
    echo <<<HTML
<!doctype html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>$t · panel DGC</title>
<link rel="stylesheet" href="assets/css/panel.css">
</head><body>
HTML;
}

/**
 * Powloka ekranow logowania — osobna od naglowek(), bo stoi na szablonie
 * Duralux (Bootstrap 5), a pozostale czternascie widokow zostaje przy
 * dotychczasowym stylu. Przenosimy panel na nowy wyglad po kawalku, zaczynajac
 * od ekranu, ktory biuro widzi jako pierwszy, i nie ruszajac niczego, co juz
 * dziala.
 *
 * Z szablonu bierzemy tylko dwa arkusze. Wykresy, kalendarze i tabele
 * z sortowaniem zostaja nietkniete, bo panel ich nie uzywa.
 */
function naglowekLogowania(string $tytul): void {
    $t = h($tytul);
    echo <<<HTML
<!doctype html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>$t · panel DGC</title>
<link rel="stylesheet" href="assets/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/css/theme.min.css">
<link rel="stylesheet" href="assets/css/panel.css">
</head><body class="dgc-logowanie">
HTML;
}

function stopkaLogowania(): void { echo '</body></html>'; }

/** Karta logowania: wspolny szkielet dla obu ekranow wejsciowych. */
function kartaLogowania(string $tytul, string $wstep, string $blad, string $pola, string $przycisk): void {
    $t = h($tytul);
    $w = $wstep !== '' ? '<p class="fs-12 fw-medium text-muted mb-4">' . h($wstep) . '</p>' : '';
    $b = $blad !== '' ? '<div class="dgc-blad rounded p-3 mb-4 fs-13">' . h($blad) . '</div>' : '';
    $p = h($przycisk);
    echo <<<HTML
<main class="auth-minimal-wrapper">
  <div class="auth-minimal-inner">
    <div class="minimal-card-wrapper">
      <div class="card mb-4 mt-5 mx-4 mx-sm-0">
        <div class="card-body p-sm-5">
          <img src="assets/logo.svg" alt="DGC Biuro Rachunkowe" class="dgc-logo mb-4">
          <h1 class="fs-20 fw-bolder mb-4">$t</h1>
          $w
          $b
          <form method="post" class="w-100">
            $pola
            <div class="mt-4">
              <button type="submit" class="btn btn-lg w-100 dgc-przycisk">$p</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>
HTML;
}

function stopka(): void { echo '</body></html>'; }

function widokPierwszeUruchomienie(string $blad): void {
    naglowekLogowania('Pierwsze uruchomienie');
    kartaLogowania(
        'Ustaw hasło do panelu',
        'To okno pojawia się tylko raz. Hasło zapisujemy w postaci nieodwracalnego skrótu, '
        . 'więc nikt, łącznie z osobą, która budowała stronę, nie może go odczytać. '
        . 'Zapisz je w menedżerze haseł, bo nie ma sposobu na jego odzyskanie.',
        $blad,
        '<div class="mb-3"><label for="h1" class="form-label fs-13 fw-semibold">Hasło (co najmniej 12 znaków)</label>'
        . '<input id="h1" type="password" name="nowe_haslo" class="form-control" required autofocus></div>'
        . '<div class="mb-3"><label for="h2" class="form-label fs-13 fw-semibold">Powtórz hasło</label>'
        . '<input id="h2" type="password" name="powtorz" class="form-control" required></div>',
        'Zapisz hasło'
    );
    stopkaLogowania();
}

function widokLogowania(string $blad): void {
    naglowekLogowania('Logowanie');
    kartaLogowania(
        'Panel redakcyjny',
        'Zaloguj się, żeby dodać artykuł albo zmienić teksty na stronie.',
        $blad,
        '<div class="mb-3"><label for="p" class="form-label fs-13 fw-semibold">Hasło</label>'
        . '<input id="p" type="password" name="haslo" class="form-control" required autofocus></div>',
        'Zaloguj'
    );
    stopkaLogowania();
}

function widokListy(array $wpisy, string $komunikat, string $blad): void {
    naglowek('Artykuły');
    $szukaj = trim((string)($_GET['szukaj'] ?? ''));
    $ileSzkicow = count(wczytajSzkice());
    echo '<div class="pas"><strong>Panel DGC</strong><span>'
        . '<a href="?akcja=nowy">Nowy artykuł</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=szkice">Szkice' . ($ileSzkicow ? ' (' . $ileSzkicow . ')' : '') . '</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=cennik">Cennik</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=faq">Pytania</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=konsultacje">Konsultacja</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=kontakt">Kontakt</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=oferta">Oferta</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=wyloguj">Wyloguj</a></span></div>';
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<h1>Artykuły <span class="male">(' . count($wpisy) . ')</span></h1>';
    echo '<form method="get" style="margin:16px 0"><input type="text" name="szukaj" placeholder="Szukaj w tytułach" value="' . h($szukaj) . '"></form>';

    $widoczne = $szukaj === '' ? $wpisy : array_values(array_filter(
        $wpisy,
        static fn($w) => mb_stripos($w['title'], $szukaj) !== false
    ));

    if ($szukaj !== '') echo '<p class="male">Znalezione: ' . count($widoczne) . '</p>';
    $widoczne = array_slice($widoczne, 0, 80);

    echo '<table><tr><th>Tytuł</th><th>Kategoria</th><th>Data</th><th></th></tr>';
    foreach ($widoczne as $w) {
        echo '<tr><td>' . h($w['title']) . '</td><td class="male">' . h($w['tag']) . '</td>'
            . '<td class="male">' . h($w['create_at']) . '</td>'
            . '<td><a href="?akcja=edytuj&amp;slug=' . urlencode($w['slug']) . '">Edytuj</a> &nbsp; '
            . '<a href="/porady/' . h($w['slug']) . '/" target="_blank" rel="noreferrer">Zobacz</a></td></tr>';
    }
    echo '</table>';
    if ($szukaj === '' && count($wpisy) > 80) {
        echo '<p class="male">Pokazane 80 najnowszych. Reszty szukaj polem wyżej.</p>';
    }
    echo '</div>';
    stopka();
}

function widokSzkicow(array $szkice, string $komunikat, string $blad): void {
    naglowek('Szkice');
    echo '<div class="pas"><strong>Panel DGC</strong><span>'
        . '<a href="?">Artykuły</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=nowy">Nowy artykuł</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=wyloguj">Wyloguj</a></span></div>';
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<h1>Szkice <span class="male">(' . count($szkice) . ')</span></h1>';
    echo '<p class="male">Teksty zapisane, ale jeszcze niewidoczne na stronie.'
        . ' Nie ma ich ani na liście porad, ani w mapie strony, ani w Google.'
        . ' Wchodzą dopiero po kliknięciu „Publikuj".</p>';

    if (!$szkice) {
        echo '<p style="margin-top:20px">Nie ma żadnych szkiców.'
            . ' <a href="?akcja=nowy">Napisz artykuł</a> i zapisz go przyciskiem „Zapisz szkic".</p>';
        echo '</div>';
        stopka();
        return;
    }

    echo '<table><tr><th>Tytuł</th><th>Kategoria</th><th>Na kiedy</th><th>Zmieniony</th><th></th></tr>';
    foreach ($szkice as $sz) {
        $id = h((string)($sz['id'] ?? ''));
        $kiedy = (string)($sz['data'] ?? '');
        // Data w szkicu to PLAN, nie publikacja. Nic nie odpala sie samo.
        $opisKiedy = $kiedy !== '' ? h($kiedy) : '<span class="male">bez daty</span>';
        if ($kiedy !== '' && $kiedy <= date('Y-m-d')) {
            $opisKiedy = '<strong>' . h($kiedy) . '</strong> <span class="male">— termin minął</span>';
        }
        echo '<tr><td>' . h((string)($sz['title'] ?? '')) . '</td>'
            . '<td class="male">' . h((string)($sz['tag'] ?? '')) . '</td>'
            . '<td class="male">' . $opisKiedy . '</td>'
            . '<td class="male">' . h((string)($sz['zmieniony'] ?? '')) . '</td>'
            . '<td>'
            . '<a href="?akcja=edytuj-szkic&amp;id=' . $id . '">Edytuj</a> &nbsp; '
            . '<form method="post" style="display:inline" onsubmit="return confirm(\'Opublikować ten artykuł na stronie?\')">'
            . '<input type="hidden" name="co" value="publikuj-szkic">'
            . '<input type="hidden" name="token" value="' . h(token()) . '">'
            . '<input type="hidden" name="id" value="' . $id . '">'
            . '<button class="przycisk akcent" type="submit">Publikuj</button></form> &nbsp; '
            . '<form method="post" style="display:inline" onsubmit="return confirm(\'Usunąć szkic? Tego nie da się cofnąć.\')">'
            . '<input type="hidden" name="co" value="usun-szkic">'
            . '<input type="hidden" name="token" value="' . h(token()) . '">'
            . '<input type="hidden" name="id" value="' . $id . '">'
            . '<button class="przycisk lekki" type="submit">Usuń</button></form>'
            . '</td></tr>';
    }
    echo '</table>';
    echo '</div>';
    stopka();
}

function widokFormularza(?array $wpis, string $tresc, string $blad, ?array $szkic = null): void {
    $nowy = $wpis === null;

    // Jedno zrodlo wartosci dla pol. Formularz obsluguje trzy stany: nowy
    // artykul (pusto), edycje opublikowanego ($wpis) i edycje szkicu
    // ($szkic). Bez tego kazde pole musialoby pytac o stan osobno.
    $pole = [
        'title'   => $szkic['title']   ?? $wpis['title']       ?? '',
        'tag'     => $szkic['tag']     ?? $wpis['tag']         ?? '',
        'opis'    => $szkic['opis']    ?? $wpis['description'] ?? '',
        'obrazek' => $szkic['obrazek'] ?? $wpis['obrazek']     ?? '',
    ];

    // Zapis sie nie udal — pokazujemy to, co biuro WPISALO, a nie to, co
    // lezy w pliku.
    //
    // Bez tego jedno puste pole kasowalo caly napisany artykul: formularz
    // wracal z komunikatem o bledzie, ale pola odtwarzal ze zrodla, czyli
    // przy nowym wpisie PUSTE. Ktos pisal tekst pol godziny, zapominal
    // opisu i zostawal z czysta kartka. Tu kazdy POST oznacza blad, bo
    // udany zapis konczy sie przekierowaniem na liste.
    $zPosta = $blad !== '' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
    if ($zPosta) {
        $pole['title']   = (string)($_POST['tytul'] ?? $pole['title']);
        $pole['tag']     = (string)($_POST['tag'] ?? $pole['tag']);
        $pole['opis']    = (string)($_POST['opis'] ?? $pole['opis']);
        $pole['obrazek'] = (string)($_POST['obrazek_biezacy'] ?? $pole['obrazek']);
        $tresc           = (string)($_POST['tresc'] ?? $tresc);
    }

    $tytulEkranu = $szkic ? 'Szkic' : ($nowy ? 'Nowy artykuł' : 'Edycja artykułu');
    naglowek($tytulEkranu);
    echo '<div class="pas"><strong>Panel DGC</strong><span>'
        . '<a href="?">Wróć do listy</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=szkice">Szkice</a> &nbsp;·&nbsp; '
        . '<a href="?akcja=wyloguj">Wyloguj</a></span></div>';
    echo '<div class="srodek">';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<h1>' . h($tytulEkranu) . '</h1>';
    if ($szkic) {
        echo '<p class="male" style="margin:-6px 0 14px">Ten tekst nie jest jeszcze na stronie.'
            . ' „Zapisz szkic" odkłada go na później, „Zapisz i opublikuj" wystawia go od razu.</p>';
    }

    echo '<form method="post" enctype="multipart/form-data">';
    echo '<input type="hidden" name="token" value="' . h(token()) . '">';
    echo '<input type="hidden" name="slug_stary" value="' . h($wpis['slug'] ?? '') . '">';
    echo '<input type="hidden" name="obrazek_biezacy" value="' . h($pole['obrazek']) . '">';
    echo '<input type="hidden" name="szkic_id" value="' . h($szkic['id'] ?? (string)($_POST['szkic_id'] ?? '')) . '">';

    echo '<label for="tytul">Tytuł</label>';
    echo '<input id="tytul" type="text" name="tytul" maxlength="160" required value="' . h($pole['title']) . '">';

    echo '<div class="rzad">';
    echo '<div><label for="tag">Kategoria</label><select id="tag" name="tag">';
    foreach (KATEGORIE as $k) {
        $wyb = $pole['tag'] === $k ? ' selected' : '';
        echo '<option' . $wyb . '>' . h($k) . '</option>';
    }
    echo '</select></div>';

    $dataIso = date('Y-m-d');
    if ($szkic && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($szkic['data'] ?? ''))) {
        $dataIso = (string)$szkic['data'];
    }
    if ($wpis && preg_match('/^(\d{4})-(\d{2})$/', $wpis['archiveMonth'] ?? '', $m)) {
        if (preg_match('/^(\d{1,2})\s/', $wpis['create_at'] ?? '', $d)) {
            $dataIso = sprintf('%s-%s-%02d', $m[1], $m[2], (int)$d[1]);
        }
    }
    if ($zPosta && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($_POST['data'] ?? ''))) {
        $dataIso = (string)$_POST['data'];
    }
    echo '<div><label for="data">Data publikacji</label><input id="data" type="date" name="data" value="' . h($dataIso) . '"></div>';
    echo '</div>';

    echo '<label for="opis">Krótki opis</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Dwa, trzy zdania. Pokazuje się na liście artykułów i w wynikach Google.</p>';
    echo '<textarea id="opis" name="opis" style="min-height:90px;font-family:inherit;font-size:16px" maxlength="400">' . h($pole['opis']) . '</textarea>';

    echo '<label for="tresc">Treść</label>';
    echo '<div class="pomoc" style="margin-bottom:10px">'
        . '<strong>Jak pisać:</strong><br>'
        . 'Pusta linia zaczyna nowy akapit.<br>'
        . '<code>## Nagłówek</code> robi śródtytuł.<br>'
        . '<code>- punkt</code> na początku linii robi wypunktowanie.<br>'
        . '<code>&gt; Uwaga | treść</code> robi ramkę z ostrzeżeniem.<br>'
        . '<code>! Przykład | treść</code> robi ramkę z przykładem.<br>'
        . '<code>Źródło: ...</code> robi podstawę prawną na końcu.<br>'
        . '<code>**tekst**</code> pogrubia w dowolnym miejscu.'
        . '</div>';
    echo '<textarea id="tresc" name="tresc" required>' . h($tresc) . '</textarea>';

    echo '<label for="zdjecie">Zdjęcie artykułu</label>';
    $biezace = $pole['obrazek'];
    if ($biezace !== '') {
        echo '<p class="male" style="margin:-2px 0 8px">Teraz jest ustawione to zdjęcie. Zostanie, jeśli nie wybierzesz nowego.</p>';
        echo '<img src="' . h($biezace) . '" alt="" style="max-width:280px;border-radius:8px;border:1px solid var(--linia);display:block;margin-bottom:10px">';
    } else {
        echo '<p class="male" style="margin:-2px 0 8px">Jeśli nie wybierzesz zdjęcia, artykuł dostanie okładkę z logo DGC.</p>';
    }
    echo '<input id="zdjecie" type="file" name="zdjecie" accept="image/jpeg,image/png,image/webp">';
    echo '<p class="male">JPG, PNG albo WEBP, do 5 MB. Najlepiej poziome, mniej więcej dwa razy szersze niż wyższe. Większe zdjęcia zmniejszamy automatycznie.</p>';

    // Kolejnosc ma znaczenie: Enter w polu jednoliniowym wysyla formularz
    // PIERWSZYM przyciskiem. "Zapisz i opublikuj" stoi pierwszy, bo tak
    // dziala panel od poczatku — przestawienie zmienialoby po cichu skutek
    // odruchu, ktory biuro juz ma w palcach.
    echo '<p style="margin-top:22px">'
        . '<button class="przycisk akcent" type="submit" name="co" value="zapisz">Zapisz i opublikuj</button> '
        . '<button class="przycisk lekki" type="submit" name="co" value="szkic" formnovalidate>Zapisz szkic</button> '
        . '<a class="przycisk lekki" href="?">Anuluj</a></p>';
    echo '<p class="male">Szkic możesz zapisać niedokończony — pełna kontrola pól włącza się dopiero przy publikacji.</p>';
    echo '</form></div>';
    stopka();
}

// =======================================================================
//  TRESC STRON STALYCH: CENNIK I PYTANIA
// =======================================================================
//
// Te dwa zestawy leza w dane/tresc/*.json i sa czytane przez przegladarke
// (src/api/tresciStron.js) oraz wklejane w gotowe strony przez
// odswiezStroneStale(). Po kazdym zapisie przebudowujemy cztery strony,
// na ktorych te bloki stoja: /, /cennik/, /faq/ i /o-nas/.

/** Zamienia textarea z punktami (jeden na linie) na tablice. */
function liniaNaTablice(string $tekst): array {
    $linie = preg_split('/\r\n|\r|\n/', $tekst) ?: [];
    $wynik = [];
    foreach ($linie as $l) {
        $l = trim($l);
        // Pozwalamy wpisac punkt z myslnikiem albo bez — biuro i tak go dopisze.
        //
        // NIE ltrim($l, "-• \t"). ltrim bierze liste ZNAKOW jako BAJTY, a "•"
        // to trzy bajty E2 80 A2. Linia zaczynajaca sie od polskiego cudzyslowu
        // „ (E2 80 9E) albo od myslnika — (E2 80 94) tracila przez to dwa
        // pierwsze bajty i przestawala byc poprawnym UTF-8. Dalej json_encode
        // zwracal false, (string)false daje pusty napis i zapis KASOWAL plik
        // z trescia. Od 01.11.2026 ta funkcja dostaje takze akapity prozy
        // z zakladki "Teksty stron", wiec trafilo by to na pierwszy cytat.
        $l = preg_replace('/^[-\x{2022}\s]+/u', '', $l) ?? $l;
        if ($l !== '') $wynik[] = $l;
    }
    return $wynik;
}

function zapiszCennik(): array {
    $tytuly = (array)($_POST['title'] ?? []);
    $pakiety = [];

    foreach ($tytuly as $i => $tytul) {
        $tytul = trim((string)$tytul);
        // Pusta nazwa = pakiet skasowany albo nigdy nie wypelniony.
        if ($tytul === '') continue;

        $punkty = liniaNaTablice((string)($_POST['features'][$i] ?? ''));
        if (!$punkty) return ['Pakiet „' . $tytul . '” nie ma ani jednego punktu. Dopisz, co obejmuje.', ''];

        $pakiety[] = [
            'title' => $tytul,
            'krotki' => trim((string)($_POST['krotki'][$i] ?? '')) ?: $tytul,
            'price' => trim((string)($_POST['price'][$i] ?? '')),
            'dlaKogo' => trim((string)($_POST['dlaKogo'][$i] ?? '')),
            'features' => $punkty,
            'featured' => !empty($_POST['featured'][$i]),
            'naStronieGlownej' => !empty($_POST['naGlownej'][$i]),
        ];
    }

    if (!$pakiety) return ['Zostaw przynajmniej jeden pakiet.', ''];

    if (!zapiszTrescStrony('cennik', $pakiety)) {
        return ['Nie udało się zapisać cennika.', ''];
    }

    $bladStron = null;
    $ile = odswiezStroneStale($pakiety, wczytajTrescStrony('faq'), $bladStron);
    if ($bladStron !== null) return ["Cennik zapisany, ale strony się nie przebudowały: $bladStron", ''];

    return ['', "Cennik zapisany. Odświeżono $ile stron."];
}

function zapiszFaq(): array {
    $pytania = (array)($_POST['pytanie'] ?? []);
    $zestaw = [];

    foreach ($pytania as $i => $pytanie) {
        $pytanie = trim((string)$pytanie);
        $odpowiedz = trim((string)($_POST['odpowiedz'][$i] ?? ''));
        // Puste pytanie = pozycja skasowana. Pytanie bez odpowiedzi to blad,
        // bo na stronie powstalby naglowek, ktory po kliknieciu nic nie pokazuje.
        if ($pytanie === '' && $odpowiedz === '') continue;
        if ($pytanie === '' || $odpowiedz === '') {
            return ['Każde pytanie musi mieć odpowiedź, a każda odpowiedź pytanie. Sprawdź pozycję ' . ($i + 1) . '.', ''];
        }
        $zestaw[] = ['title' => $pytanie, 'content' => $odpowiedz];
    }

    if (!$zestaw) return ['Zostaw przynajmniej jedno pytanie.', ''];

    if (!zapiszTrescStrony('faq', $zestaw)) {
        return ['Nie udało się zapisać pytań.', ''];
    }

    $bladStron = null;
    $ile = odswiezStroneStale(wczytajTrescStrony('cennik'), $zestaw, $bladStron);
    if ($bladStron !== null) return ["Pytania zapisane, ale strony się nie przebudowały: $bladStron", ''];

    return ['', "Pytania zapisane. Odświeżono $ile stron."];
}

function pasTresci(string $gdzie): void {
    echo '<div class="pas"><strong>Panel DGC</strong><span>'
        . '<a href="?">Artykuły</a> &nbsp;·&nbsp; '
        . ($gdzie === 'cennik' ? '<strong>Cennik</strong>' : '<a href="?akcja=cennik">Cennik</a>') . ' &nbsp;·&nbsp; '
        . ($gdzie === 'faq' ? '<strong>Pytania</strong>' : '<a href="?akcja=faq">Pytania</a>') . ' &nbsp;·&nbsp; '
        . ($gdzie === 'konsultacje' ? '<strong>Konsultacja</strong>' : '<a href="?akcja=konsultacje">Konsultacja</a>') . ' &nbsp;·&nbsp; '
        . ($gdzie === 'kontakt' ? '<strong>Kontakt</strong>' : '<a href="?akcja=kontakt">Kontakt</a>') . ' &nbsp;·&nbsp; '
        . ($gdzie === 'oferta' ? '<strong>Oferta</strong>' : '<a href="?akcja=oferta">Oferta</a>') . ' &nbsp;·&nbsp; '
        . ($gdzie === 'strony' ? '<strong>Teksty stron</strong>' : '<a href="?akcja=strony">Teksty stron</a>') . ' &nbsp;·&nbsp; '
        . '<a href="?akcja=wyloguj">Wyloguj</a></span></div>';
}

function widokCennika(array $pakiety, string $komunikat, string $blad): void {
    naglowek('Cennik');
    pasTresci('cennik');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<h1>Cennik</h1>';
    echo '<p class="male">Zmiany pojawiają się od razu na stronie głównej i na podstronie Cennik. '
        . 'Żeby usunąć pakiet, wyczyść jego nazwę i zapisz.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-cennik">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    // Jedno puste miejsce na nowy pakiet.
    $doPokazania = $pakiety;
    $doPokazania[] = ['title' => '', 'price' => '', 'dlaKogo' => '', 'features' => [],
                      'featured' => false, 'naStronieGlownej' => false, 'krotki' => ''];

    foreach ($doPokazania as $i => $p) {
        $nowy = ($p['title'] ?? '') === '';
        echo '<fieldset style="border:1px solid var(--linia);border-radius:10px;padding:16px 18px;margin:18px 0">';
        echo '<legend class="male" style="padding:0 6px">' . ($nowy ? 'Nowy pakiet (zostaw puste, jeśli niepotrzebny)' : 'Pakiet ' . ($i + 1)) . '</legend>';

        echo '<label for="t' . $i . '">Nazwa pakietu</label>';
        echo '<input id="t' . $i . '" type="text" name="title[' . $i . ']" value="' . h((string)($p['title'] ?? '')) . '" maxlength="120">';

        echo '<label for="c' . $i . '">Cena</label>';
        echo '<p class="male" style="margin:-2px 0 6px">Tak, jak ma się wyświetlić, na przykład <code>od 200 zł</code>. Pod spodem strona sama dopisuje „netto / miesiąc”.</p>';
        echo '<input id="c' . $i . '" type="text" name="price[' . $i . ']" value="' . h((string)($p['price'] ?? '')) . '" maxlength="40">';

        echo '<label for="d' . $i . '">Dla kogo</label>';
        echo '<p class="male" style="margin:-2px 0 6px">Jedno zdanie. Pokazuje się tylko na stronie głównej.</p>';
        echo '<input id="d' . $i . '" type="text" name="dlaKogo[' . $i . ']" value="' . h((string)($p['dlaKogo'] ?? '')) . '" maxlength="200">';

        echo '<label for="f' . $i . '">Co obejmuje</label>';
        echo '<p class="male" style="margin:-2px 0 6px">Jeden punkt w każdej linii.</p>';
        echo '<textarea id="f' . $i . '" name="features[' . $i . ']" style="min-height:110px;font-family:inherit;font-size:16px">'
            . h(implode("\n", (array)($p['features'] ?? []))) . '</textarea>';

        echo '<p style="margin:12px 0 0">'
            . '<label style="display:inline;font-weight:400"><input type="checkbox" name="naGlownej[' . $i . ']" value="1"'
            . (!empty($p['naStronieGlownej']) ? ' checked' : '') . '> Pokaż na stronie głównej</label>'
            . ' &nbsp;&nbsp; '
            . '<label style="display:inline;font-weight:400"><input type="checkbox" name="featured[' . $i . ']" value="1"'
            . (!empty($p['featured']) ? ' checked' : '') . '> Wyróżnij</label></p>';

        echo '</fieldset>';
    }

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz cennik</button> '
        . '<a class="przycisk lekki" href="/cennik/" target="_blank" rel="noreferrer">Zobacz stronę</a></p>';
    echo '</form></div>';
    stopka();
}

function widokFaq(array $pytania, string $komunikat, string $blad): void {
    naglowek('Pytania');
    pasTresci('faq');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<h1>Najczęstsze pytania <span class="male">(' . count($pytania) . ')</span></h1>';
    echo '<p class="male">Pokazują się na podstronie Pytania, a pierwsze sześć także na stronie O nas. '
        . 'Kolejność jest taka jak tutaj. Żeby usunąć pytanie, wyczyść oba pola i zapisz.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-faq">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    $doPokazania = $pytania;
    for ($i = 0; $i < 3; $i++) $doPokazania[] = ['title' => '', 'content' => ''];

    foreach ($doPokazania as $i => $p) {
        $nowe = ($p['title'] ?? '') === '';
        echo '<fieldset style="border:1px solid var(--linia);border-radius:10px;padding:16px 18px;margin:18px 0">';
        echo '<legend class="male" style="padding:0 6px">' . ($nowe ? 'Nowe pytanie (zostaw puste, jeśli niepotrzebne)' : 'Pytanie ' . ($i + 1)) . '</legend>';
        echo '<label for="p' . $i . '">Pytanie</label>';
        echo '<input id="p' . $i . '" type="text" name="pytanie[' . $i . ']" value="' . h((string)($p['title'] ?? '')) . '" maxlength="200">';
        echo '<label for="o' . $i . '">Odpowiedź</label>';
        echo '<textarea id="o' . $i . '" name="odpowiedz[' . $i . ']" style="min-height:120px;font-family:inherit;font-size:16px" maxlength="1200">'
            . h((string)($p['content'] ?? '')) . '</textarea>';
        echo '</fieldset>';
    }

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz pytania</button> '
        . '<a class="przycisk lekki" href="/faq/" target="_blank" rel="noreferrer">Zobacz stronę</a></p>';
    echo '</form></div>';
    stopka();
}

// --- podstrona "Umow konsultacje" --------------------------------------

function zapiszKonsultacje(): array {
    $kwota = trim((string)($_POST['kwota'] ?? ''));
    $jednostka = trim((string)($_POST['jednostka'] ?? ''));
    $czas = trim((string)($_POST['czas'] ?? ''));

    if ($kwota === '' || $jednostka === '' || $czas === '') {
        return ['Cena, opis ceny i czas trwania nie mogą być puste.', ''];
    }

    $dane = [
        'kwota' => $kwota,
        'jednostka' => $jednostka,
        'uwaga' => trim((string)($_POST['uwaga'] ?? '')),
        'czas' => $czas,
        'zyskujesz' => liniaNaTablice((string)($_POST['zyskujesz'] ?? '')),
        'przygotowanie' => liniaNaTablice((string)($_POST['przygotowanie'] ?? '')),
    ];

    if (!$dane['zyskujesz'] || !$dane['przygotowanie']) {
        return ['Obie listy muszą mieć przynajmniej jedną pozycję.', ''];
    }

    $kat = DANE . '/tresc';
    if (!is_dir($kat)) @mkdir($kat, 0755, true);
    if (!zapiszAtomowo($kat . '/konsultacje.json',
        (string)json_encode($dane, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
        return ['Nie udało się zapisać danych konsultacji.', ''];
    }

    $bladStron = null;
    $ile = odswiezStroneStale(wczytajTrescStrony('cennik'), wczytajTrescStrony('faq'), $bladStron);
    if ($bladStron !== null) return ["Zapisane, ale strony się nie przebudowały: $bladStron", ''];

    return ['', "Zapisane. Odświeżono $ile stron."];
}

function widokKonsultacji(array $k, string $komunikat, string $blad): void {
    naglowek('Konsultacja');
    pasTresci('konsultacje');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<h1>Umów konsultację</h1>';
    echo '<p class="male">Cena i czas trwania płatnej konsultacji. Zmiany widać od razu '
        . 'na podstronie Umów konsultację.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-konsultacje">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    echo '<label for="kwota">Cena</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Tak, jak ma się wyświetlić, na przykład <code>od 250 zł netto</code>.</p>';
    echo '<input id="kwota" type="text" name="kwota" value="' . h((string)($k['kwota'] ?? '')) . '" maxlength="60">';

    echo '<label for="jednostka">Za co</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Napis pod ceną, na przykład <code>za 30 minut konsultacji</code>.</p>';
    echo '<input id="jednostka" type="text" name="jednostka" value="' . h((string)($k['jednostka'] ?? '')) . '" maxlength="80">';

    echo '<label for="uwaga">Zdanie pod ceną</label>';
    echo '<input id="uwaga" type="text" name="uwaga" value="' . h((string)($k['uwaga'] ?? '')) . '" maxlength="200">';

    echo '<label for="czas">Czas trwania</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Na przykład <code>30 minut</code>.</p>';
    echo '<input id="czas" type="text" name="czas" value="' . h((string)($k['czas'] ?? '')) . '" maxlength="40">';

    echo '<label for="zyskujesz">Co z tego masz</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Jeden punkt w każdej linii.</p>';
    echo '<textarea id="zyskujesz" name="zyskujesz" style="min-height:110px;font-family:inherit;font-size:16px">'
        . h(implode("\n", (array)($k['zyskujesz'] ?? []))) . '</textarea>';

    echo '<label for="przygotowanie">Jak się przygotować</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Jeden punkt w każdej linii.</p>';
    echo '<textarea id="przygotowanie" name="przygotowanie" style="min-height:110px;font-family:inherit;font-size:16px">'
        . h(implode("\n", (array)($k['przygotowanie'] ?? []))) . '</textarea>';

    echo '<p class="male" style="margin-top:18px">Kroki „Jak to działa” i opcje w formularzu '
        . 'zgłoszeniowym zostają poza panelem — opcje muszą zgadzać się z listą tematów, '
        . 'którą sprawdza wysyłka zgłoszeń.</p>';

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz</button> '
        . '<a class="przycisk lekki" href="/umow-konsultacje/" target="_blank" rel="noreferrer">Zobacz stronę</a></p>';
    echo '</form></div>';
    stopka();
}

// --- dane kontaktowe ----------------------------------------------------
//
// Telefon, godziny i mail sa w stopce, czyli na kazdej podstronie. Zamiast
// przebudowywac 481 stron z szablonow, podmieniamy sam tekst — patrz
// podmienKontakt() w generator.php.

/**
 * Zapis tekstow strony glownej: hero i sekcja "O nas".
 *
 * Po zapisie przebudowujemy strony stale, bo hero stoi na stronie glownej,
 * a "O nas" na stronie glownej I na /o-nas/ — jeden tekst, dwie strony.
 */
function zapiszTekstyStronZFormularza(): array {
    $heroNad      = trim((string)($_POST['hero_nad'] ?? ''));
    $heroTytul    = trim((string)($_POST['hero_tytul'] ?? ''));
    $heroAkapit   = trim((string)($_POST['hero_akapit'] ?? ''));
    $heroPrzycisk = trim((string)($_POST['hero_przycisk'] ?? ''));
    $onasNaglowek = trim((string)($_POST['onas_naglowek'] ?? ''));
    $onasPodtytul = trim((string)($_POST['onas_podtytul'] ?? ''));
    $onasAkapity  = liniaNaTablice((string)($_POST['onas_akapity'] ?? ''));

    // Hero to jedyny H1 na stronie glownej i pierwsze, co widzi odwiedzajacy.
    // Pusty tytul albo pusty przycisk to nie jest stan, ktory wolno zapisac.
    if ($heroTytul === '')    return ['Nagłówek na stronie głównej nie może być pusty.', ''];
    if ($heroPrzycisk === '') return ['Napis na przycisku nie może być pusty.', ''];
    if ($onasNaglowek === '') return ['Nagłówek sekcji „O nas" nie może być pusty.', ''];
    if (!$onasAkapity)        return ['Sekcja „O nas" musi mieć co najmniej jeden akapit.', ''];

    if (mb_strlen($heroTytul) > 120)  return ['Nagłówek jest za długi (maksimum 120 znaków).', ''];
    if (mb_strlen($heroAkapit) > 600) return ['Akapit pod nagłówkiem jest za długi (maksimum 600 znaków).', ''];

    $dane = [
        'hero' => [
            'nad'      => $heroNad,
            'tytul'    => $heroTytul,
            'akapit'   => $heroAkapit,
            'przycisk' => $heroPrzycisk,
        ],
        'onas' => [
            'naglowek' => $onasNaglowek,
            'podtytul' => $onasPodtytul,
            'akapity'  => $onasAkapity,
        ],
    ];

    // Kroki "Jak to dziala": jeden krok w linii, tytul i opis oddzielone |.
    $kroki = [];
    foreach (preg_split('/\r\n|\r|\n/', (string)($_POST['kons_kroki'] ?? '')) ?: [] as $linia) {
        $linia = trim($linia);
        if ($linia === '') continue;
        $czesci = explode('|', $linia, 2);
        $kroki[] = [
            'tytul' => trim($czesci[0]),
            'opis'  => isset($czesci[1]) ? trim($czesci[1]) : '',
        ];
    }
    if (!$kroki) return ['Lista „Jak to działa" nie może być pusta.', ''];

    $dane['cennik'] = [
        'nad'       => trim((string)($_POST['cen_nad'] ?? '')),
        'tytul'     => trim((string)($_POST['cen_tytul'] ?? '')),
        'wstep'     => trim((string)($_POST['cen_wstep'] ?? '')),
        'uwaga'     => trim((string)($_POST['cen_uwaga'] ?? '')),
        'nad2'      => trim((string)($_POST['cen_nad2'] ?? '')),
        'tytul2'    => trim((string)($_POST['cen_tytul2'] ?? '')),
        'wstep2'    => trim((string)($_POST['cen_wstep2'] ?? '')),
        'formularz' => trim((string)($_POST['cen_formularz'] ?? '')),
    ];
    $dane['konsultacja'] = [
        'tytul'          => trim((string)($_POST['kons_tytul'] ?? '')),
        'wstep'          => trim((string)($_POST['kons_wstep'] ?? '')),
        'krokiTytul'     => trim((string)($_POST['kons_kroki_tytul'] ?? '')),
        'kroki'          => $kroki,
        'formularzTytul' => trim((string)($_POST['kons_form_tytul'] ?? '')),
        'formularzOpis'  => trim((string)($_POST['kons_form_opis'] ?? '')),
    ];

    if ($dane['cennik']['tytul'] === '')      return ['Tytuł sekcji na cenniku nie może być pusty.', ''];
    if ($dane['konsultacja']['tytul'] === '') return ['Tytuł na stronie konsultacji nie może być pusty.', ''];

    $karty = [];
    foreach (KARTY_OFERTY as $slug) {
        $karty[$slug] = trim((string)($_POST['karta_' . str_replace('-', '_', $slug)] ?? ''));
    }
    $dane['ofertaKarty'] = $karty;

    if (!zapiszTekstyStron($dane)) return ['Nie udało się zapisać tekstów.', ''];

    $bladStron = null;
    $ile = odswiezStroneStale(wczytajTrescStrony('cennik'), wczytajTrescStrony('faq'), $bladStron);
    // Czesc stron mogla sie przebudowac mimo klopotu z inna — komunikat musi
    // to mowic, inaczej biuro nie wie, w jakim stanie jest strona.
    if ($bladStron !== null) {
        return ["Przebudowano $ile stron, ale nie wszystkie: $bladStron", ''];
    }

    return ['', "Zapisane. Przebudowano $ile stron."];
}

function zapiszKontakt(): array {
    $telefon = trim((string)($_POST['telefon'] ?? ''));
    $godziny = trim((string)($_POST['godziny'] ?? ''));
    $email = trim((string)($_POST['email'] ?? ''));

    if ($telefon === '' || $godziny === '' || $email === '') {
        return ['Wszystkie trzy pola są wymagane.', ''];
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['To nie wygląda na poprawny adres e-mail.', ''];
    }

    // Odnosnik tel: skladamy sami z cyfr, zeby nie trzeba bylo go wpisywac
    // i zeby nie dalo sie go rozjechac z numerem widocznym na stronie.
    $cyfry = preg_replace('/\D+/', '', $telefon) ?? '';
    if (strlen($cyfry) < 9) return ['Numer telefonu wygląda na zbyt krótki.', ''];
    if (strpos($cyfry, '48') !== 0) $cyfry = '48' . $cyfry;

    $stare = wczytajKontakt();
    $nowe = [
        'telefon' => $telefon,
        'telefonHref' => 'tel:+' . $cyfry,
        'godziny' => $godziny,
        'email' => $email,
    ];

    if (!$stare) {
        return ['Brak pliku dane/tresc/kontakt.json — wgraj aktualną paczkę strony.', ''];
    }
    if ($stare === $nowe) {
        return ['', 'Nic się nie zmieniło.'];
    }

    $kat = DANE . '/tresc';
    if (!is_dir($kat)) @mkdir($kat, 0755, true);
    if (!zapiszAtomowo($kat . '/kontakt.json',
        (string)json_encode($nowe, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
        return ['Nie udało się zapisać danych kontaktowych.', ''];
    }

    $ile = podmienKontakt($stare, $nowe);

    return ['', "Zapisane. Zmienione na $ile stronach."];
}

function widokTekstowStron(array $t, string $komunikat, string $blad): void {
    naglowek('Teksty stron');
    pasTresci('strony');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    $h = (array)($t['hero'] ?? []);
    $o = (array)($t['onas'] ?? []);

    echo '<h1>Teksty stron</h1>';
    echo '<p class="male">Proza ze strony głównej, z cennika i ze strony konsultacji. '
        . '<strong>Sekcja „O nas" stoi w dwóch miejscach naraz</strong> — na stronie głównej '
        . 'i na podstronie /o-nas/. Zmiana przechodzi przez obie.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-strony">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    echo '<h2 style="margin-top:26px">Powitanie na górze strony</h2>';

    echo '<label for="hero_nad">Linijka nad nagłówkiem</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Mała, szara. Teraz: <code>Biuro rachunkowe · Łódź · online</code>.</p>';
    echo '<input id="hero_nad" type="text" name="hero_nad" maxlength="120" value="' . h((string)($h['nad'] ?? '')) . '">';

    echo '<label for="hero_tytul">Nagłówek</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Największy napis na całej stronie i jednocześnie '
        . 'to, po czym Google rozpoznaje, o czym jest strona główna. Nie zostawiajcie go pustego.</p>';
    echo '<input id="hero_tytul" type="text" name="hero_tytul" maxlength="120" required value="' . h((string)($h['tytul'] ?? '')) . '">';

    echo '<label for="hero_akapit">Akapit pod nagłówkiem</label>';
    echo '<textarea id="hero_akapit" name="hero_akapit" maxlength="600" style="min-height:110px;font-family:inherit;font-size:16px">'
        . h((string)($h['akapit'] ?? '')) . '</textarea>';

    echo '<label for="hero_przycisk">Napis na przycisku</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Sam przycisk zawsze prowadzi na stronę '
        . '<code>/umow-konsultacje/</code> — zmieniacie tylko napis.</p>';
    echo '<input id="hero_przycisk" type="text" name="hero_przycisk" maxlength="60" required value="' . h((string)($h['przycisk'] ?? '')) . '">';

    echo '<h2 style="margin-top:34px">Sekcja „O nas"</h2>';

    echo '<label for="onas_naglowek">Nagłówek sekcji</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Mały napis nad tytułem. Teraz: <code>O nas</code>.</p>';
    echo '<input id="onas_naglowek" type="text" name="onas_naglowek" maxlength="80" required value="' . h((string)($o['naglowek'] ?? '')) . '">';

    echo '<label for="onas_podtytul">Tytuł</label>';
    echo '<input id="onas_podtytul" type="text" name="onas_podtytul" maxlength="160" value="' . h((string)($o['podtytul'] ?? '')) . '">';

    echo '<label for="onas_akapity">Akapity</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Jeden akapit w jednej linii. Pusta linia '
        . 'nic nie zmienia — liczy się podział na linie.</p>';
    echo '<textarea id="onas_akapity" name="onas_akapity" style="min-height:190px;font-family:inherit;font-size:16px">'
        . h(implode("\n", array_map('strval', (array)($o['akapity'] ?? [])))) . '</textarea>';

    echo '<p class="male" style="margin-top:18px">Nazwisko i stanowisko pod tekstem idą z danych '
        . 'zespołu, nie stąd — tego panel nie zmienia.</p>';

    $c = (array)($t['cennik'] ?? []);
    $k = (array)($t['konsultacja'] ?? []);

    echo '<h2 style="margin-top:34px">Strona „Cennik"</h2>';
    echo '<p class="male">Same pakiety i ceny zmieniacie w zakładce <a href="?akcja=cennik">Cennik</a>. '
        . 'Tutaj są teksty, które stoją wokół nich.</p>';

    echo '<label for="cen_nad">Mały napis nad tytułem</label>';
    echo '<input id="cen_nad" type="text" name="cen_nad" maxlength="80" value="' . h((string)($c['nad'] ?? '')) . '">';
    echo '<label for="cen_tytul">Tytuł</label>';
    echo '<input id="cen_tytul" type="text" name="cen_tytul" maxlength="160" required value="' . h((string)($c['tytul'] ?? '')) . '">';
    echo '<label for="cen_wstep">Akapit pod tytułem</label>';
    echo '<textarea id="cen_wstep" name="cen_wstep" style="min-height:90px;font-family:inherit;font-size:16px">' . h((string)($c['wstep'] ?? '')) . '</textarea>';
    echo '<label for="cen_uwaga">Zdanie nad pakietami</label>';
    echo '<textarea id="cen_uwaga" name="cen_uwaga" style="min-height:90px;font-family:inherit;font-size:16px">' . h((string)($c['uwaga'] ?? '')) . '</textarea>';

    echo '<label for="cen_nad2">Mały napis nad drugą sekcją</label>';
    echo '<input id="cen_nad2" type="text" name="cen_nad2" maxlength="80" value="' . h((string)($c['nad2'] ?? '')) . '">';
    echo '<label for="cen_tytul2">Tytuł drugiej sekcji</label>';
    echo '<input id="cen_tytul2" type="text" name="cen_tytul2" maxlength="160" value="' . h((string)($c['tytul2'] ?? '')) . '">';
    echo '<label for="cen_wstep2">Akapit drugiej sekcji</label>';
    echo '<textarea id="cen_wstep2" name="cen_wstep2" style="min-height:90px;font-family:inherit;font-size:16px">' . h((string)($c['wstep2'] ?? '')) . '</textarea>';
    echo '<label for="cen_formularz">Zdanie nad formularzem</label>';
    echo '<textarea id="cen_formularz" name="cen_formularz" style="min-height:70px;font-family:inherit;font-size:16px">' . h((string)($c['formularz'] ?? '')) . '</textarea>';

    echo '<h2 style="margin-top:34px">Strona „Umów konsultację"</h2>';
    echo '<p class="male">Cenę, czas trwania i obie listy zmieniacie w zakładce '
        . '<a href="?akcja=konsultacje">Konsultacja</a>. Tutaj są teksty wokół nich.</p>';

    echo '<label for="kons_tytul">Tytuł na górze strony</label>';
    echo '<input id="kons_tytul" type="text" name="kons_tytul" maxlength="160" required value="' . h((string)($k['tytul'] ?? '')) . '">';
    echo '<label for="kons_wstep">Akapit pod tytułem</label>';
    echo '<textarea id="kons_wstep" name="kons_wstep" style="min-height:110px;font-family:inherit;font-size:16px">' . h((string)($k['wstep'] ?? '')) . '</textarea>';

    echo '<label for="kons_kroki_tytul">Nagłówek listy kroków</label>';
    echo '<input id="kons_kroki_tytul" type="text" name="kons_kroki_tytul" maxlength="120" value="' . h((string)($k['krokiTytul'] ?? '')) . '">';
    echo '<label for="kons_kroki">Kroki</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Jeden krok w linii, w postaci '
        . '<code>Tytuł kroku | opis kroku</code>. Numery dopisują się same.</p>';
    $linieKrokow = [];
    foreach ((array)($k['kroki'] ?? []) as $krok) {
        $linieKrokow[] = (string)($krok['tytul'] ?? '') . ' | ' . (string)($krok['opis'] ?? '');
    }
    echo '<textarea id="kons_kroki" name="kons_kroki" style="min-height:170px;font-family:inherit;font-size:16px">'
        . h(implode("\n", $linieKrokow)) . '</textarea>';

    echo '<label for="kons_form_tytul">Nagłówek nad formularzem</label>';
    echo '<input id="kons_form_tytul" type="text" name="kons_form_tytul" maxlength="160" value="' . h((string)($k['formularzTytul'] ?? '')) . '">';
    echo '<label for="kons_form_opis">Zdanie pod tym nagłówkiem</label>';
    echo '<textarea id="kons_form_opis" name="kons_form_opis" style="min-height:70px;font-family:inherit;font-size:16px">' . h((string)($k['formularzOpis'] ?? '')) . '</textarea>';

    $ko = (array)($t['ofertaKarty'] ?? []);
    echo '<h2 style="margin-top:34px">Kafelki oferty</h2>';
    echo '<p class="male">Sześć kafelków ze strony głównej i ze strony '
        . '<a href="/oferta/" target="_blank" rel="noreferrer">Oferta</a>. Zmieniacie sam opis pod '
        . 'tytułem. <strong>Tytułu nie da się tu zmienić</strong> — jest jednocześnie nazwą w menu '
        . 'i częścią adresu podstrony, więc jego zmiana przebudowałaby nawigację.</p>';
    foreach (KARTY_OFERTY as $slug) {
        $poleId = 'karta_' . str_replace('-', '_', $slug);
        echo '<label for="' . $poleId . '">' . h(NAZWY_KART[$slug] ?? $slug) . '</label>';
        echo '<textarea id="' . $poleId . '" name="' . $poleId . '" maxlength="300" '
            . 'style="min-height:70px;font-family:inherit;font-size:16px">'
            . h((string)($ko[$slug] ?? '')) . '</textarea>';
    }

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz</button> '
        . '<a class="przycisk lekki" href="?">Wróć do listy</a></p>';
    echo '</form></div>';
    stopka();
}

function widokKontaktu(array $k, string $komunikat, string $blad): void {
    naglowek('Kontakt');
    pasTresci('kontakt');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<h1>Dane kontaktowe</h1>';
    echo '<p class="male">Telefon, godziny i adres e-mail. Są w stopce, więc zmiana '
        . 'przechodzi przez <strong>wszystkie podstrony naraz</strong> — zapis może potrwać '
        . 'kilkanaście sekund. Nie zamykajcie strony w trakcie.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-kontakt">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    echo '<label for="telefon">Telefon</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Tak, jak ma być widoczny, na przykład '
        . '<code>731 580 184</code>. Odnośnik do dzwonienia składa się sam.</p>';
    echo '<input id="telefon" type="text" name="telefon" value="' . h((string)($k['telefon'] ?? '')) . '" maxlength="40">';

    echo '<label for="godziny">Godziny pracy</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Na przykład <code>pon.–pt. 8:00–16:00</code>.</p>';
    echo '<input id="godziny" type="text" name="godziny" value="' . h((string)($k['godziny'] ?? '')) . '" maxlength="80">';

    echo '<label for="email">Adres e-mail</label>';
    echo '<input id="email" type="email" name="email" value="' . h((string)($k['email'] ?? '')) . '" maxlength="120">';

    echo '<p class="male" style="margin-top:18px"><strong>Uwaga:</strong> zmiana adresu e-mail tutaj '
        . 'zmienia go tylko na stronie. Skrzynka, na którą przychodzą zgłoszenia z formularzy, '
        . 'jest ustawiona osobno — przy zmianie adresu trzeba o tym powiedzieć osobie '
        . 'opiekującej się stroną.</p>';

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz</button> '
        . '<a class="przycisk lekki" href="/kontakt/" target="_blank" rel="noreferrer">Zobacz stronę</a></p>';
    echo '</form></div>';
    stopka();
}

// --- teksty na podstronach oferty --------------------------------------
//
// Szesc podstron, kazda z wstepem i kilkoma sekcjami. Nazwa uslugi NIE jest
// edytowalna: ta sama nazwa stoi w menu, ktore ma wlasna kopie, wiec zmiana
// z panelu rozjechalaby nawigacje na wszystkich stronach.

/** Tekst z pustymi liniami na tablice akapitow. */
function akapityZTekstu(string $tekst): array {
    $czesci = preg_split('/\n\s*\n/', str_replace(["\r\n", "\r"], "\n", $tekst)) ?: [];
    $wynik = [];
    foreach ($czesci as $c) {
        // Zlamania linii wewnatrz akapitu scalamy — w HTML i tak by zniknely.
        $c = trim(preg_replace('/\s*\n\s*/', ' ', $c) ?? '');
        if ($c !== '') $wynik[] = $c;
    }
    return $wynik;
}

function zapiszOferte(): array {
    $slug = (string)($_POST['slug'] ?? '');
    $oferta = wczytajOferte();
    if ($slug === '' || !isset($oferta[$slug])) {
        return ['Nie znam takiej podstrony oferty.', ''];
    }

    $intro = akapityZTekstu((string)($_POST['intro'] ?? ''));
    if (!$intro) return ['Wstęp nie może być pusty.', ''];

    $sekcje = [];
    foreach ((array)($_POST['sek_title'] ?? []) as $i => $tytul) {
        $tytul = trim((string)$tytul);
        $akapity = akapityZTekstu((string)($_POST['sek_paragraphs'][$i] ?? ''));
        $punkty = liniaNaTablice((string)($_POST['sek_items'][$i] ?? ''));
        $konc = akapityZTekstu((string)($_POST['sek_closing'][$i] ?? ''));

        // Pusty tytul = sekcja skasowana albo nigdy nie wypelniona.
        if ($tytul === '') continue;
        if (!$akapity && !$punkty) {
            return ["Sekcja „$tytul” nie ma ani akapitu, ani punktów. Dopisz treść albo wyczyść tytuł.", ''];
        }

        $s = ['title' => $tytul];
        if ($akapity) $s['paragraphs'] = $akapity;
        if ($punkty) $s['items'] = $punkty;
        if ($konc) $s['closing'] = $konc;
        $sekcje[] = $s;
    }

    if (!$sekcje) return ['Zostaw przynajmniej jedną sekcję.', ''];

    $oferta[$slug] = ['intro' => $intro, 'sections' => $sekcje];

    $kat = DANE . '/tresc';
    if (!is_dir($kat)) @mkdir($kat, 0755, true);
    if (!zapiszAtomowo($kat . '/oferta.json',
        (string)json_encode($oferta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
        return ['Nie udało się zapisać treści oferty.', ''];
    }

    $bladStrony = null;
    if (!odswiezOferte($slug, $oferta[$slug], $bladStrony)) {
        return ["Zapisane, ale strona się nie przebudowała: $bladStrony", ''];
    }

    return ['', 'Zapisane. Strona oferty odświeżona.'];
}

function widokListyOferty(array $oferta, string $komunikat, string $blad): void {
    naglowek('Oferta');
    pasTresci('oferta');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<h1>Teksty na podstronach oferty</h1>';
    echo '<p class="male">Wybierzcie podstronę, której tekst chcecie zmienić. '
        . 'Nazwy usług zostają poza panelem — ta sama nazwa stoi w menu na każdej '
        . 'stronie, więc jej zmiana wymaga programisty.</p>';

    if (!$oferta) {
        echo '<div class="blad">Brak pliku dane/tresc/oferta.json — wgraj aktualną paczkę strony.</div>';
        echo '</div>'; stopka(); return;
    }

    echo '<table><tr><th>Podstrona</th><th>Sekcji</th><th></th></tr>';
    foreach ($oferta as $slug => $d) {
        $ile = count((array)($d['sections'] ?? []));
        echo '<tr><td>/oferta/' . h($slug) . '/</td>'
            . '<td class="male">' . $ile . '</td>'
            . '<td><a href="?akcja=oferta&amp;slug=' . urlencode($slug) . '">Edytuj</a> &nbsp; '
            . '<a href="/oferta/' . h($slug) . '/" target="_blank" rel="noreferrer">Zobacz</a></td></tr>';
    }
    echo '</table></div>';
    stopka();
}

function widokOferty(string $slug, array $d, string $komunikat, string $blad): void {
    naglowek('Oferta');
    pasTresci('oferta');
    echo '<div class="srodek">';
    if ($komunikat) echo '<div class="ok">' . h($komunikat) . '</div>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';

    echo '<p><a href="?akcja=oferta">&larr; Wszystkie podstrony oferty</a></p>';
    echo '<h1>/oferta/' . h($slug) . '/</h1>';
    echo '<p class="male">Pusta linia zaczyna nowy akapit. Żeby usunąć sekcję, '
        . 'wyczyśćcie jej tytuł i zapiszcie.</p>';

    echo '<form method="post"><input type="hidden" name="co" value="zapisz-oferte">'
        . '<input type="hidden" name="slug" value="' . h($slug) . '">'
        . '<input type="hidden" name="token" value="' . h(token()) . '">';

    echo '<label for="intro">Wstęp</label>';
    echo '<textarea id="intro" name="intro" style="min-height:130px;font-family:inherit;font-size:16px">'
        . h(implode("\n\n", (array)($d['intro'] ?? []))) . '</textarea>';

    $sekcje = (array)($d['sections'] ?? []);
    $sekcje[] = ['title' => '', 'paragraphs' => [], 'items' => [], 'closing' => []];

    foreach ($sekcje as $i => $sek) {
        $nowa = ($sek['title'] ?? '') === '';
        echo '<fieldset style="border:1px solid var(--linia);border-radius:10px;padding:16px 18px;margin:18px 0">';
        echo '<legend class="male" style="padding:0 6px">'
            . ($nowa ? 'Nowa sekcja (zostaw puste, jeśli niepotrzebna)' : 'Sekcja ' . ($i + 1)) . '</legend>';

        echo '<label for="st' . $i . '">Śródtytuł</label>';
        echo '<input id="st' . $i . '" type="text" name="sek_title[' . $i . ']" value="'
            . h((string)($sek['title'] ?? '')) . '" maxlength="200">';

        echo '<label for="sp' . $i . '">Akapity</label>';
        echo '<textarea id="sp' . $i . '" name="sek_paragraphs[' . $i . ']" style="min-height:130px;font-family:inherit;font-size:16px">'
            . h(implode("\n\n", (array)($sek['paragraphs'] ?? []))) . '</textarea>';

        echo '<label for="si' . $i . '">Wypunktowanie</label>';
        echo '<p class="male" style="margin:-2px 0 6px">Jeden punkt w każdej linii. Zostaw puste, jeśli sekcja go nie ma.</p>';
        echo '<textarea id="si' . $i . '" name="sek_items[' . $i . ']" style="min-height:90px;font-family:inherit;font-size:16px">'
            . h(implode("\n", (array)($sek['items'] ?? []))) . '</textarea>';

        echo '<label for="sc' . $i . '">Akapity po wypunktowaniu</label>';
        echo '<textarea id="sc' . $i . '" name="sek_closing[' . $i . ']" style="min-height:70px;font-family:inherit;font-size:16px">'
            . h(implode("\n\n", (array)($sek['closing'] ?? []))) . '</textarea>';

        echo '</fieldset>';
    }

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz</button> '
        . '<a class="przycisk lekki" href="/oferta/' . h($slug) . '/" target="_blank" rel="noreferrer">Zobacz stronę</a></p>';
    echo '</form></div>';
    stopka();
}
