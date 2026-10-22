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
header("Content-Security-Policy: default-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:");

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

if ($akcja === 'cennik') {
    widokCennika(wczytajTrescStrony('cennik'), $komunikat, $blad);
    exit;
}

if ($akcja === 'faq') {
    widokFaq(wczytajTrescStrony('faq'), $komunikat, $blad);
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
<style>
 :root{--ink:#0d4444;--akcent:#b50b50;--kanwa:#fdfcfc;--linia:rgba(13,68,68,.14)}
 *{box-sizing:border-box}
 body{margin:0;background:var(--kanwa);color:var(--ink);
   font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
 .pas{background:var(--ink);color:var(--kanwa);padding:14px 20px;display:flex;
   justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
 .pas a{color:var(--kanwa)}
 .srodek{max-width:940px;margin:0 auto;padding:24px 20px 60px}
 h1{font-size:26px;margin:0 0 4px}
 h2{font-size:19px;margin:28px 0 8px}
 a{color:var(--akcent)}
 label{display:block;margin:18px 0 6px;font-weight:600}
 input[type=text],input[type=password],input[type=date],select,textarea{
   width:100%;padding:11px 12px;border:1px solid var(--linia);border-radius:8px;
   font:inherit;color:inherit;background:#fff}
 textarea{min-height:420px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.7}
 .przycisk{display:inline-block;background:var(--ink);color:var(--kanwa);border:0;
   padding:12px 22px;border-radius:8px;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
 .przycisk.akcent{background:var(--akcent)}
 .przycisk.lekki{background:transparent;color:var(--ink);border:1px solid var(--linia)}
 .karta{background:#fff;border:1px solid var(--linia);border-radius:12px;padding:20px;margin:14px 0}
 .blad{background:#fdecef;border-left:3px solid var(--akcent);padding:12px 14px;border-radius:6px;margin:14px 0}
 .ok{background:#e8f3f0;border-left:3px solid var(--ink);padding:12px 14px;border-radius:6px;margin:14px 0}
 table{width:100%;border-collapse:collapse;margin-top:10px}
 td,th{text-align:left;padding:10px 8px;border-bottom:1px solid var(--linia);vertical-align:top}
 th{font-size:13px;text-transform:uppercase;letter-spacing:.04em;opacity:.65}
 .male{font-size:14px;opacity:.75}
 .pomoc{background:#fff;border:1px solid var(--linia);border-radius:10px;padding:14px 16px;font-size:14px}
 .pomoc code{background:var(--kanwa);padding:1px 6px;border-radius:4px}
 .rzad{display:flex;gap:14px;flex-wrap:wrap}
 .rzad>*{flex:1 1 220px}
</style></head><body>
HTML;
}

function stopka(): void { echo '</body></html>'; }

function widokPierwszeUruchomienie(string $blad): void {
    naglowek('Pierwsze uruchomienie');
    echo '<div class="srodek"><h1>Ustaw hasło do panelu</h1>';
    echo '<p class="male">To okno pojawia się tylko raz. Hasło zapisujemy w postaci nieodwracalnego skrótu, więc nikt, łącznie z osobą, która budowała stronę, nie może go odczytać. Zapisz je w menedżerze haseł, bo nie ma sposobu na jego odzyskanie.</p>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<form method="post" class="karta">';
    echo '<label for="h1">Hasło (co najmniej 12 znaków)</label><input id="h1" type="password" name="nowe_haslo" required autofocus>';
    echo '<label for="h2">Powtórz hasło</label><input id="h2" type="password" name="powtorz" required>';
    echo '<p><button class="przycisk" type="submit">Zapisz hasło</button></p></form></div>';
    stopka();
}

function widokLogowania(string $blad): void {
    naglowek('Logowanie');
    echo '<div class="srodek" style="max-width:420px"><h1>Panel DGC</h1>';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<form method="post" class="karta">';
    echo '<label for="p">Hasło</label><input id="p" type="password" name="haslo" required autofocus>';
    echo '<p><button class="przycisk" type="submit">Zaloguj</button></p></form></div>';
    stopka();
}

function widokListy(array $wpisy, string $komunikat, string $blad): void {
    naglowek('Artykuły');
    $szukaj = trim((string)($_GET['szukaj'] ?? ''));
    echo '<div class="pas"><strong>Panel DGC</strong><span>'
        . '<a href="?akcja=nowy">Nowy artykuł</a> &nbsp;·&nbsp; '
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

function widokFormularza(?array $wpis, string $tresc, string $blad): void {
    $nowy = $wpis === null;
    naglowek($nowy ? 'Nowy artykuł' : 'Edycja');
    echo '<div class="pas"><strong>Panel DGC</strong><span><a href="?">Wróć do listy</a> &nbsp;·&nbsp; <a href="?akcja=wyloguj">Wyloguj</a></span></div>';
    echo '<div class="srodek">';
    if ($blad) echo '<div class="blad">' . h($blad) . '</div>';
    echo '<h1>' . ($nowy ? 'Nowy artykuł' : 'Edycja artykułu') . '</h1>';

    echo '<form method="post" enctype="multipart/form-data"><input type="hidden" name="co" value="zapisz">';
    echo '<input type="hidden" name="token" value="' . h(token()) . '">';
    echo '<input type="hidden" name="slug_stary" value="' . h($wpis['slug'] ?? '') . '">';
    echo '<input type="hidden" name="obrazek_biezacy" value="' . h($wpis['obrazek'] ?? '') . '">';

    echo '<label for="tytul">Tytuł</label>';
    echo '<input id="tytul" type="text" name="tytul" maxlength="160" required value="' . h($wpis['title'] ?? '') . '">';

    echo '<div class="rzad">';
    echo '<div><label for="tag">Kategoria</label><select id="tag" name="tag">';
    foreach (KATEGORIE as $k) {
        $wyb = ($wpis['tag'] ?? '') === $k ? ' selected' : '';
        echo '<option' . $wyb . '>' . h($k) . '</option>';
    }
    echo '</select></div>';

    $dataIso = date('Y-m-d');
    if ($wpis && preg_match('/^(\d{4})-(\d{2})$/', $wpis['archiveMonth'] ?? '', $m)) {
        if (preg_match('/^(\d{1,2})\s/', $wpis['create_at'] ?? '', $d)) {
            $dataIso = sprintf('%s-%s-%02d', $m[1], $m[2], (int)$d[1]);
        }
    }
    echo '<div><label for="data">Data publikacji</label><input id="data" type="date" name="data" value="' . h($dataIso) . '"></div>';
    echo '</div>';

    echo '<label for="opis">Krótki opis</label>';
    echo '<p class="male" style="margin:-2px 0 6px">Dwa, trzy zdania. Pokazuje się na liście artykułów i w wynikach Google.</p>';
    echo '<textarea id="opis" name="opis" style="min-height:90px;font-family:inherit;font-size:16px" maxlength="400" required>' . h($wpis['description'] ?? '') . '</textarea>';

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
    $biezace = $wpis['obrazek'] ?? '';
    if ($biezace !== '') {
        echo '<p class="male" style="margin:-2px 0 8px">Teraz jest ustawione to zdjęcie. Zostanie, jeśli nie wybierzesz nowego.</p>';
        echo '<img src="' . h($biezace) . '" alt="" style="max-width:280px;border-radius:8px;border:1px solid var(--linia);display:block;margin-bottom:10px">';
    } else {
        echo '<p class="male" style="margin:-2px 0 8px">Jeśli nie wybierzesz zdjęcia, artykuł dostanie okładkę z logo DGC.</p>';
    }
    echo '<input id="zdjecie" type="file" name="zdjecie" accept="image/jpeg,image/png,image/webp">';
    echo '<p class="male">JPG, PNG albo WEBP, do 5 MB. Najlepiej poziome, mniej więcej dwa razy szersze niż wyższe. Większe zdjęcia zmniejszamy automatycznie.</p>';

    echo '<p style="margin-top:22px"><button class="przycisk akcent" type="submit">Zapisz i opublikuj</button> '
        . '<a class="przycisk lekki" href="?">Anuluj</a></p>';
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
        $l = ltrim($l, "-• \t");
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
