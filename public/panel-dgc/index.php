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
    $bezNiego = array_values(array_filter($wpisy, static fn($w) => $w['slug'] !== $slug));
    $bezNiego[] = $nowy;
    usort($bezNiego, static fn($a, $b) => strcmp($b['archiveMonth'] . $b['create_at'], $a['archiveMonth'] . $a['create_at']));
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
    echo '<div class="pas"><strong>Panel DGC</strong><span><a href="?akcja=nowy">Nowy artykuł</a> &nbsp;·&nbsp; <a href="?akcja=wyloguj">Wyloguj</a></span></div>';
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
