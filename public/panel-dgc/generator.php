<?php
declare(strict_types=1);

/**
 * Generator stron dla panelu redakcyjnego DGC.
 *
 * Panel stoi na hostingu, gdzie nie ma Node'a, wiec nie przebuduje aplikacji
 * Reacta. Sklada wiec strone artykulu sam, z szablonu, ktory wypadl
 * z ostatniego budowania (scripts/szablon.mjs).
 *
 * Zasada: ten plik NIE opisuje wygladu. Wyglad siedzi w szablonach
 * dane/szablon/*.html, a tutaj sa tylko podstawienia. Dzieki temu zmiana
 * stylu strony nie wymaga dotykania PHP — wystarczy wgrac nowa paczke.
 *
 * Jedyne miejsce, ktore MUSI byc zgodne z Reactem, to zamiana blokow tresci
 * na HTML (funkcja blokiNaHtml). Odpowiada jeden do jednego komponentowi
 * Blok z src/components/BlogDetails/BlogSingle.jsx. Gdy tam dojdzie nowy
 * typ bloku, trzeba go dopisac takze tutaj.
 */

// Funkcje wprowadzone w PHP 8.0. Hosting prawdopodobnie ma nowsza wersje,
// ale gdyby kiedys zjechal na 7.4, panel ma dzialac dalej, a nie wywalac
// sie bledem o nieznanej funkcji przy pierwszym zapisie.
if (!function_exists('str_starts_with')) {
    function str_starts_with(string $h, string $i): bool {
        return $i === '' || strncmp($h, $i, strlen($i)) === 0;
    }
}
if (!function_exists('str_contains')) {
    function str_contains(string $h, string $i): bool {
        return $i === '' || strpos($h, $i) !== false;
    }
}

// --- sciezki ------------------------------------------------------------
// Wszystko liczone od katalogu panelu, zeby dalo sie go nazwac dowolnie.

define('KORZEN', dirname(__DIR__));
define('DANE', KORZEN . '/dane');
define('SZABLONY', DANE . '/szablon');
define('PORADY', KORZEN . '/porady');
define('DOMENA', 'https://biurodgc.pl');

/** Kategorie ze starego bloga. Zamknieta lista, zeby nie powstawaly literowki. */
const KATEGORIE = ['VAT', 'CIT', 'PIT', 'Podatki', 'Księgowość', 'Rachunkowość', 'Kadry', 'Płace'];

const MIESIACE = [1 => 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const MIESIACE_ET = [1 => 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

/** Ile wpisow na stronie listy. MUSI zgadzac sie z src/api/stronicowanie.js. */
const NA_STRONE = 5;

// --- drobne pomocnicze --------------------------------------------------

function h(string $t): string {
    return htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Tekst bloku: uciekamy znaki HTML, a potem **pogrubienie** na <strong>. */
function tekstBloku(string $t): string {
    $bezpieczny = h($t);
    return preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $bezpieczny) ?? $bezpieczny;
}

/**
 * Zapis atomowy: najpierw plik tymczasowy, potem podmiana nazwy.
 * Bez tego przerwany zapis zostawialby polowe strony albo polowe JSON-a,
 * a to jest plik, z ktorego czyta cala reszta serwisu.
 */
function zapiszAtomowo(string $sciezka, string $tresc): bool {
    $katalog = dirname($sciezka);
    if (!is_dir($katalog) && !@mkdir($katalog, 0755, true)) return false;
    $tymczasowy = $sciezka . '.tmp-' . bin2hex(random_bytes(6));
    if (@file_put_contents($tymczasowy, $tresc) === false) return false;
    if (!@rename($tymczasowy, $sciezka)) { @unlink($tymczasowy); return false; }
    return true;
}

/** "30 wrzesnia 2026" -> "2026-09-30". Dane strukturalne wymagaja ISO. */
function isoZDaty(string $polska): string {
    if (!preg_match('/^(\d{1,2})\s+(\S+)\s+(\d{4})$/u', trim($polska), $m)) return '';
    $nr = array_search(mb_strtolower($m[2], 'UTF-8'), MIESIACE, true);
    if ($nr === false) return '';
    return sprintf('%04d-%02d-%02d', (int)$m[3], (int)$nr, (int)$m[1]);
}

/** Nazwa adresowa z tytulu: same male litery, cyfry i myslniki. */
function naSlug(string $t): string {
    $od = ['ą','ć','ę','ł','ń','ó','ś','ź','ż','Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż'];
    $na = ['a','c','e','l','n','o','s','z','z','a','c','e','l','n','o','s','z','z'];
    $t = str_replace($od, $na, $t);
    $t = mb_strtolower($t, 'UTF-8');
    $t = preg_replace('/[^a-z0-9]+/u', '-', $t) ?? '';
    return trim($t, '-');
}

// --- tresc: prosty zapis tekstowy na bloki ------------------------------

/**
 * Zamienia tekst wpisany w panelu na bloki tresci.
 *
 * Format jest celowo ubogi, bo pisza w nim ksiegowe, a nie programisci:
 *
 *   zwykly akapit                    -> akapit
 *   ## Naglowek                      -> naglowek sekcji
 *   - punkt                          -> lista (kolejne linie sie skleja)
 *   > Tytul | tresc                  -> ramka z uwaga
 *   ! Tytul | tresc                  -> ramka z przykladem
 *   zrodlo: tekst                    -> podstawa prawna na koncu
 *   **pogrubienie**                  -> pogrubienie w dowolnym miejscu
 *
 * Pusta linia konczy akapit. Czego nie da sie rozpoznac, to akapit —
 * zasada jest taka, ze zle wpisany znacznik ma dac brzydki tekst,
 * a nie pusta strone.
 */
function blokiZTekstu(string $tekst): array {
    $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
    $linie = explode("\n", $tekst);

    $bloki = [];
    $akapit = [];
    $lista = [];

    $domknijAkapit = function () use (&$akapit, &$bloki) {
        $t = trim(implode(' ', $akapit));
        if ($t !== '') $bloki[] = ['t' => 'p', 'x' => $t];
        $akapit = [];
    };
    $domknijListe = function () use (&$lista, &$bloki) {
        if ($lista) $bloki[] = ['t' => 'ul', 'x' => $lista];
        $lista = [];
    };

    foreach ($linie as $linia) {
        $l = trim($linia);

        if ($l === '') { $domknijAkapit(); $domknijListe(); continue; }

        if (str_starts_with($l, '## ')) {
            $domknijAkapit(); $domknijListe();
            $bloki[] = ['t' => 'h', 'x' => trim(substr($l, 3))];
            continue;
        }
        if (str_starts_with($l, '- ')) {
            $domknijAkapit();
            $lista[] = trim(substr($l, 2));
            continue;
        }
        if (str_starts_with($l, '> ') || str_starts_with($l, '! ')) {
            $domknijAkapit(); $domknijListe();
            $typ = $l[0] === '>' ? 'uwaga' : 'przyklad';
            $reszta = trim(substr($l, 2));
            $czesci = explode('|', $reszta, 2);
            if (count($czesci) === 2) {
                $bloki[] = ['t' => $typ, 'h' => trim($czesci[0]), 'x' => trim($czesci[1])];
            } else {
                $bloki[] = ['t' => $typ, 'x' => $reszta];
            }
            continue;
        }
        if (preg_match('/^(zrodlo|źródło|podstawa prawna)\s*:\s*(.+)$/ui', $l, $m)) {
            $domknijAkapit(); $domknijListe();
            $bloki[] = ['t' => 'zrodlo', 'x' => trim($m[2])];
            continue;
        }

        $domknijListe();
        $akapit[] = $l;
    }
    $domknijAkapit();
    $domknijListe();

    return $bloki;
}

/** Droga powrotna: bloki na tekst do pola edycji. */
function tekstZBlokow(array $bloki): string {
    $czesci = [];
    foreach ($bloki as $b) {
        $t = $b['t'] ?? 'p';
        if ($t === 'h') { $czesci[] = '## ' . ($b['x'] ?? ''); continue; }
        if ($t === 'ul') {
            $linie = [];
            foreach (($b['x'] ?? []) as $poz) $linie[] = '- ' . $poz;
            $czesci[] = implode("\n", $linie);
            continue;
        }
        if ($t === 'uwaga' || $t === 'przyklad') {
            $znak = $t === 'uwaga' ? '>' : '!';
            $czesci[] = isset($b['h']) && $b['h'] !== ''
                ? "$znak {$b['h']} | {$b['x']}"
                : "$znak {$b['x']}";
            continue;
        }
        if ($t === 'zrodlo') { $czesci[] = 'Źródło: ' . ($b['x'] ?? ''); continue; }
        if ($t === 'tabela') {
            // Tabel panel nie tworzy, ale gdy wpis ja ma, nie wolno jej zgubic
            // przy edycji. Zostaje jako znacznik, ktory przy zapisie odtwarzamy.
            $czesci[] = '[tabela zachowana z poprzedniej wersji]';
            continue;
        }
        $czesci[] = $b['x'] ?? '';
    }
    return implode("\n\n", $czesci);
}

// --- bloki na HTML ------------------------------------------------------
//
// Odpowiednik komponentu Blok z BlogSingle.jsx. Kazda zmiana tam wymaga
// zmiany tutaj, inaczej artykul dodany z panelu bedzie wygladal inaczej
// niz artykul z paczki.

function blokiNaHtml(array $bloki): string {
    $out = '';
    foreach ($bloki as $b) {
        $t = $b['t'] ?? 'p';

        if ($t === 'h') {
            $out .= '<h3>' . h((string)($b['x'] ?? '')) . '</h3>';
        } elseif ($t === 'p') {
            $out .= '<p>' . tekstBloku((string)($b['x'] ?? '')) . '</p>';
        } elseif ($t === 'ul') {
            $out .= '<ul class="wpis_lista">';
            foreach (($b['x'] ?? []) as $poz) $out .= '<li>' . tekstBloku((string)$poz) . '</li>';
            $out .= '</ul>';
        } elseif ($t === 'tabela') {
            $out .= '<div class="wpis_tabela_ramka"><table class="wpis_tabela">';
            if (!empty($b['h'])) {
                $out .= '<thead><tr>';
                foreach ($b['h'] as $kol) $out .= '<th>' . h((string)$kol) . '</th>';
                $out .= '</tr></thead>';
            }
            $out .= '<tbody>';
            foreach (($b['x'] ?? []) as $wiersz) {
                $out .= '<tr>';
                foreach ($wiersz as $kom) $out .= '<td>' . tekstBloku((string)$kom) . '</td>';
                $out .= '</tr>';
            }
            $out .= '</tbody></table></div>';
        } elseif ($t === 'przyklad' || $t === 'uwaga') {
            $klasa = $t === 'uwaga' ? 'wpis_uwaga' : 'wpis_przyklad';
            $out .= '<aside class="' . $klasa . '">';
            if (!empty($b['h'])) $out .= '<strong>' . h((string)$b['h']) . '</strong>';
            $out .= '<p>' . tekstBloku((string)($b['x'] ?? '')) . '</p></aside>';
        } elseif ($t === 'zrodlo') {
            $out .= '<p class="wpis_zrodlo"><strong>Podstawa prawna:</strong> ' . h((string)($b['x'] ?? '')) . '</p>';
        }
    }
    return $out;
}

// --- dane ---------------------------------------------------------------

function wczytajWpisy(): array {
    $plik = DANE . '/wpisy.json';
    if (!is_file($plik)) return [];
    $d = json_decode((string)file_get_contents($plik), true);
    return is_array($d) && isset($d['wpisy']) && is_array($d['wpisy']) ? $d['wpisy'] : [];
}

function zapiszWpisy(array $wpisy): bool {
    return zapiszAtomowo(
        DANE . '/wpisy.json',
        (string)json_encode(['wersja' => count($wpisy) . '-' . time(), 'wpisy' => $wpisy], JSON_UNESCAPED_UNICODE)
    );
}

function wczytajTresc(string $slug): array {
    $plik = DANE . '/tresci/' . $slug . '.json';
    if (!is_file($plik)) return [];
    $d = json_decode((string)file_get_contents($plik), true);
    return is_array($d) ? $d : [];
}

// --- skladanie stron ----------------------------------------------------

function szablon(string $nazwa): ?string {
    $plik = SZABLONY . '/' . $nazwa;
    return is_file($plik) ? (string)file_get_contents($plik) : null;
}

/**
 * Kontrola aktualnosci szablonu. Szablon niesie odwolania do plikow
 * /assets/... z odciskiem. Jesli ktoregos nie ma na dysku, znaczy, ze
 * wgrano nowa wersje strony, a szablon zostal stary — wtedy generowana
 * strona ladowalaby nieistniejace style i wygladala jak goly tekst.
 */
function szablonAktualny(string $html, ?string &$powod = null): bool {
    if (!preg_match_all('#/assets/([A-Za-z0-9_.\-]+)#', $html, $m)) return true;
    foreach (array_unique($m[1]) as $plik) {
        if (!is_file(KORZEN . '/assets/' . $plik)) {
            $powod = $plik;
            return false;
        }
    }
    return true;
}

/**
 * Czy w gotowej stronie zostal niepodmieniony znacznik @@...@@.
 *
 * To strazik na wypadek, gdy paczka strony bedzie nowsza niz panel: ktos
 * doda do szablonu nowe pole (jak @@PODOBNE@@), a panel go nie zna i wpisze
 * na zywa strone goly napis @@PODOBNE@@. Lepiej nie zapisac strony i o tym
 * powiedziec, niz opublikowac taka strone.
 */
function zostalZnacznik(string $html): ?string {
    return preg_match('/@@[A-Z_]+@@/', $html, $t) ? $t[0] : null;
}

function podstaw(string $szablon, array $pola): string {
    return str_replace(
        array_map(static fn($k) => '@@' . $k . '@@', array_keys($pola)),
        array_values($pola),
        $szablon
    );
}

/** Blok "poprzedni / nastepny wpis" pod artykulem. */
function sasiedziHtml(array $wpisy, int $nr): string {
    $poprzedni = $wpisy[$nr - 1] ?? null;
    $nastepny = $wpisy[$nr + 1] ?? null;
    if (!$poprzedni && !$nastepny) return '';

    $out = '<div class="more-posts">';
    $out .= '<div class="previous-post">';
    if ($poprzedni) {
        $out .= '<a href="/porady/' . h($poprzedni['slug']) . '/">'
            . '<span class="post-control-link">Poprzedni wpis</span>'
            . '<span class="post-name">' . h($poprzedni['title']) . '</span></a>';
    }
    $out .= '</div><div class="next-post">';
    if ($nastepny) {
        $out .= '<a href="/porady/' . h($nastepny['slug']) . '/">'
            . '<span class="post-control-link">Następny wpis</span>'
            . '<span class="post-name">' . h($nastepny['title']) . '</span></a>';
    }
    $out .= '</div></div>';
    return $out;
}

/**
 * Wymiary zdjecia z pliku. Przegladarka rezerwuje dzieki nim miejsce,
 * zanim plik sie pobierze, wiec uklad strony nie przeskakuje.
 */
function wymiaryZdjecia(string $adres): array {
    $plik = KORZEN . '/' . ltrim($adres, '/');
    if (is_file($plik)) {
        $info = @getimagesize($plik);
        if ($info !== false) return [(int)$info[0], (int)$info[1]];
    }
    // getimagesize nie czyta SVG, a okladka firmowa jest w SVG — i ma
    // dokladnie te proporcje. Ten sam zapas sluzy zdjeciom nieczytelnym.
    return [868, 514];
}

/**
 * Trzy "podobne wpisy" w pasku bocznym.
 *
 * Zasada jest ta sama co w src/components/BlogSidebar/BlogSidebar.jsx:
 * bierzemy trzy wpisy NASTEPNE po biezacym w jego kategorii, zawijajac na
 * poczatek kategorii, a gdy kategoria liczy mniej niz cztery wpisy,
 * dokladamy najnowszymi. Przesuwane okno zamiast trzech najnowszych, bo
 * inaczej wszystkie strony w kategorii wskazywalyby jeden i ten sam wpis.
 * Pomijamy przy tym poprzedni i nastepny wpis, bo te stoja juz w bloku
 * pod artykulem (sasiedziHtml wyzej).
 *
 * Jesli zasada zmieni sie w komponencie, trzeba ja zmienic rowniez tutaj —
 * inaczej artykul dodany z panelu bedzie jedynym w serwisie, ktory po
 * wczytaniu Reacta podmieni ten blok na inny.
 */
function podobneHtml(array $wpisy, int $nr): string {
    $biezacy = $wpisy[$nr] ?? null;
    if ($biezacy === null) return '';

    $tag = (string)($biezacy['tag'] ?? '');
    $slug = (string)($biezacy['slug'] ?? '');

    $wKategorii = [];
    foreach ($wpisy as $w) {
        if ((string)($w['tag'] ?? '') === $tag) $wKategorii[] = $w;
    }

    $start = 0;
    foreach ($wKategorii as $i => $w) {
        if ((string)($w['slug'] ?? '') === $slug) { $start = $i; break; }
    }

    $pominiete = [];
    foreach ([$nr - 1, $nr + 1] as $sasiad) {
        if (isset($wpisy[$sasiad])) $pominiete[] = (string)($wpisy[$sasiad]['slug'] ?? '');
    }

    $ile = count($wKategorii);
    $okno = [];
    for ($i = 1; $i < $ile && count($okno) < 3; $i++) {
        $kandydat = $wKategorii[($start + $i) % $ile];
        if (in_array((string)($kandydat['slug'] ?? ''), $pominiete, true)) continue;
        $okno[] = $kandydat;
    }

    if (count($okno) < 3) {
        $uzyte = [$slug];
        foreach ($okno as $w) $uzyte[] = (string)($w['slug'] ?? '');
        foreach ($wpisy as $w) {
            if (count($okno) >= 3) break;
            if (in_array((string)($w['slug'] ?? ''), $uzyte, true)) continue;
            $okno[] = $w;
        }
    }

    $out = '';
    foreach ($okno as $w) {
        $obrazek = (string)($w['obrazek'] ?? '');
        [$szer, $wys] = wymiaryZdjecia($obrazek);
        // data-discover to atrybut, ktory React Router dokleja do odnosnikow.
        // Bez niego przegladarka dostalaby inny HTML, niz React oczekuje przy
        // podlaczaniu sie do gotowej strony.
        $out .= '<div class="post">'
            . '<div class="img-holder"><img width="' . $szer . '" height="' . $wys . '"'
            . ' loading="lazy" decoding="async" src="' . h($obrazek) . '" alt=""></div>'
            . '<div class="details">'
            . '<h4><a href="/porady/' . h((string)($w['slug'] ?? '')) . '/" data-discover="true">'
            . h((string)($w['title'] ?? '')) . '</a></h4>'
            . '<span class="date">' . h((string)($w['create_at'] ?? '')) . '</span>'
            . '</div></div>';
    }
    return $out;
}

/** Sklada i zapisuje strone jednego artykulu. */
function zapiszStroneArtykulu(array $wpis, array $bloki, array $wpisy, int $nr, ?string &$blad = null): bool {
    $szab = szablon('artykul.html');
    if ($szab === null) { $blad = 'brak szablonu artykulu — wgraj aktualna paczke strony'; return false; }
    if (!szablonAktualny($szab, $czego)) {
        $blad = "szablon jest starszy niz wgrana strona (brakuje /assets/$czego) — popros opiekuna o nowa paczke";
        return false;
    }

    $adres = DOMENA . '/porady/' . $wpis['slug'] . '/';

    // Dane strukturalne. Odpowiednik tego, co prerender wstawia przy
    // budowaniu strony (src/main.jsx). Bez nich artykul dodany z panelu
    // bylby jedynym w serwisie, ktory nie mowi Google, ze jest artykulem.
    $isoData = isoZDaty($wpis['create_at']);

    // Wymiary zdjecia czytamy z pliku, bo kazde wgrane zdjecie ma inne.
    $wymiaryObrazka = wymiaryZdjecia((string)$wpis['obrazek']);
    $schemat = '<script type="application/ld+json">' . json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Article',
        'headline' => $wpis['title'],
        'description' => $wpis['description'],
        'image' => DOMENA . $wpis['obrazek'],
        'datePublished' => $isoData,
        'dateModified' => $isoData,
        'inLanguage' => 'pl-PL',
        'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $adres],
        'author' => ['@type' => 'Organization', 'name' => 'DGC Biuro Rachunkowe', 'url' => DOMENA],
        'publisher' => ['@id' => DOMENA . '/#organizacja'],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>';

    $schemat .= '<script type="application/ld+json">' . json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Strona główna', 'item' => DOMENA . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Porady', 'item' => DOMENA . '/porady/'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $wpis['title'], 'item' => $adres],
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>';

    $html = podstaw($szab, [
        'SCHEMAT'      => $schemat,
        'TYTUL_STRONY' => h($wpis['title'] . ' · DGC'),
        'OPIS'         => h($wpis['description']),
        'KANONICZNY'   => h($adres),
        'SLUG'         => h($wpis['slug']),
        'ZIARNO'       => str_replace('<', '\\u003c', (string)json_encode($bloki, JSON_UNESCAPED_UNICODE)),
        'TYTUL'        => h($wpis['title']),
        'OBRAZEK'      => h($wpis['obrazek']),
        'OBRAZEK_W'    => (string)$wymiaryObrazka[0],
        'OBRAZEK_H'    => (string)$wymiaryObrazka[1],
        'AUTOR'        => h($wpis['author']),
        'DATA'         => h($wpis['create_at']),
        'TAG'          => h($wpis['tag']),
        'TRESC'        => blokiNaHtml($bloki),
        'SASIEDZI'     => sasiedziHtml($wpisy, $nr),
        'PODOBNE'      => podobneHtml($wpisy, $nr),
    ]);

    $znacznik = zostalZnacznik($html);
    if ($znacznik !== null) {
        $blad = "szablon artykulu ma pole $znacznik, ktorego ten panel nie zna"
            . ' — wgrana paczka strony jest nowsza niz panel, popros opiekuna'
            . ' o aktualizacje plikow panelu';
        return false;
    }

    if (!zapiszAtomowo(PORADY . '/' . $wpis['slug'] . '/index.html', $html)) {
        $blad = 'nie udalo sie zapisac strony artykulu';
        return false;
    }
    return true;
}

/** Przebudowa wszystkich stron listy porad. */
function odswiezListy(array $wpisy, ?string &$blad = null): int {
    $szabLista = szablon('lista.html');
    $szabKarta = szablon('karta.html');
    if ($szabLista === null || $szabKarta === null) { $blad = 'brak szablonu listy'; return 0; }

    $stron = max(1, (int)ceil(count($wpisy) / NA_STRONE));
    $zapisane = 0;

    for ($nr = 1; $nr <= $stron; $nr++) {
        $naStronie = array_slice($wpisy, ($nr - 1) * NA_STRONE, NA_STRONE);

        $karty = '';
        foreach ($naStronie as $w) {
            $karty .= podstaw($szabKarta, [
                'OBRAZEK' => h($w['obrazek']),
                'ADRES'   => '/porady/' . h($w['slug']) . '/',
                'TYTUL'   => h($w['title']),
                'OPIS'    => h($w['description']),
                'DATA'    => h($w['create_at']),
                'TAG'     => h($w['tag']),
                'AUTOR'   => h($w['author']),
            ]);
        }

        $adres = $nr === 1 ? DOMENA . '/porady/' : DOMENA . "/porady/strona/$nr/";
        $tytul = $nr === 1
            ? 'Porady księgowe i podatkowe · DGC Biuro Rachunkowe'
            : "Porady księgowe i podatkowe, strona $nr · DGC";
        $opis = $nr === 1
            ? 'Artykuły o księgowości, podatkach i kadrach od biura rachunkowego DGC z Łodzi.'
            : "Artykuły o księgowości, podatkach i kadrach, strona $nr z $stron. Biuro rachunkowe DGC z Łodzi.";

        $html = podstaw($szabLista, [
            'TYTUL_STRONY'   => h($tytul),
            'OPIS'           => h($opis),
            'KANONICZNY'     => h($adres),
            'KARTY'          => $karty,
            'STRONICOWANIE'  => stronicowanieHtml($nr, $stron),
        ]);

        $znacznik = zostalZnacznik($html);
        if ($znacznik !== null) {
            $blad = "szablon listy ma pole $znacznik, ktorego ten panel nie zna"
                . ' — popros opiekuna o aktualizacje plikow panelu';
            return $zapisane;
        }

        $cel = $nr === 1 ? PORADY . '/index.html' : PORADY . "/strona/$nr/index.html";
        if (zapiszAtomowo($cel, $html)) $zapisane++;
    }

    // Strony, ktorych juz nie ma (bo wpisow ubylo), trzeba usunac.
    $katStron = PORADY . '/strona';
    if (is_dir($katStron)) {
        foreach (scandir($katStron) ?: [] as $poz) {
            if (!ctype_digit($poz)) continue;
            if ((int)$poz > $stron) {
                @unlink("$katStron/$poz/index.html");
                @rmdir("$katStron/$poz");
            }
        }
    }

    return $zapisane;
}

/** Stronicowanie: pierwsza, ostatnia, biezaca i po dwie sasiednie. */
function stronicowanieHtml(int $biezaca, int $stron): string {
    if ($stron <= 1) return '';

    $numery = [];
    if ($stron <= 7) {
        $numery = range(1, $stron);
    } else {
        $zbior = [1, $stron, $biezaca];
        for ($i = 1; $i <= 2; $i++) {
            if ($biezaca - $i > 1) $zbior[] = $biezaca - $i;
            if ($biezaca + $i < $stron) $zbior[] = $biezaca + $i;
        }
        $zbior = array_unique($zbior);
        sort($zbior);
        $poprzedni = 0;
        foreach ($zbior as $n) {
            if ($poprzedni && $n - $poprzedni > 1) $numery[] = '...';
            $numery[] = $n;
            $poprzedni = $n;
        }
    }

    $adres = static fn(int $n): string => $n <= 1 ? '/porady/' : "/porady/strona/$n/";

    $out = '<div class="pagination-wrapper pagination-wrapper-left"><nav aria-label="Strony wpisów"><ul class="pg-pagination">';
    $out .= '<li>' . ($biezaca === 1
        ? '<span class="pg-nieczynne" aria-hidden="true"><i class="fi ti-angle-left"></i></span>'
        : '<a href="' . $adres($biezaca - 1) . '" aria-label="Poprzednia strona"><i class="fi ti-angle-left"></i></a>') . '</li>';

    foreach ($numery as $n) {
        if ($n === '...') {
            $out .= '<li class="pg-przerwa" aria-hidden="true"><span>…</span></li>';
            continue;
        }
        $klasa = $n === $biezaca ? ' class="active"' : '';
        $biezacyAtr = $n === $biezaca ? ' aria-current="page"' : '';
        $out .= "<li$klasa><a href=\"{$adres($n)}\" aria-label=\"Strona $n\"$biezacyAtr>$n</a></li>";
    }

    $out .= '<li>' . ($biezaca === $stron
        ? '<span class="pg-nieczynne" aria-hidden="true"><i class="fi ti-angle-right"></i></span>'
        : '<a href="' . $adres($biezaca + 1) . '" aria-label="Następna strona"><i class="fi ti-angle-right"></i></a>') . '</li>';

    return $out . '</ul></nav></div>';
}

/** Mapa strony: adresy stale z ostatniego budowania plus wszystkie artykuly. */
function odswiezMape(array $wpisy): bool {
    $plik = KORZEN . '/sitemap.xml';
    if (!is_file($plik)) return false;

    $stary = (string)file_get_contents($plik);
    // Zostawiamy wszystko, co NIE jest artykulem ani strona listy,
    // a artykuly i strony listy budujemy od nowa z aktualnych danych.
    preg_match_all('#<url>\s*<loc>([^<]+)</loc>.*?</url>#s', $stary, $m, PREG_SET_ORDER);
    $stale = [];
    foreach ($m as $wpis) {
        $loc = $wpis[1];
        if (str_contains($loc, '/porady/') && $loc !== DOMENA . '/porady/') continue;
        if ($loc === DOMENA . '/porady/') continue;
        $stale[] = $wpis[0];
    }

    $dzis = date('Y-m-d');
    $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    foreach ($stale as $u) $xml .= $u . "\n";
    $xml .= "<url><loc>" . DOMENA . "/porady/</loc><lastmod>$dzis</lastmod></url>\n";
    $stron = max(1, (int)ceil(count($wpisy) / NA_STRONE));
    for ($nr = 2; $nr <= $stron; $nr++) {
        $xml .= "<url><loc>" . DOMENA . "/porady/strona/$nr/</loc><lastmod>$dzis</lastmod></url>\n";
    }
    foreach ($wpisy as $w) {
        $xml .= "<url><loc>" . DOMENA . "/porady/" . h($w['slug']) . "/</loc><lastmod>$dzis</lastmod></url>\n";
    }
    $xml .= "</urlset>\n";

    return zapiszAtomowo($plik, $xml);
}

// --- wgrywanie zdjec ----------------------------------------------------

const MAX_OBRAZEK = 5 * 1024 * 1024;
const DOZWOLONE_TYPY = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];

/**
 * Przyjmuje wgrane zdjecie i zwraca jego adres, albo null przy bledzie.
 *
 * O typie pliku decyduje JEGO ZAWARTOSC (getimagesize), a nie rozszerzenie
 * ani naglowek przyslany przez przegladarke — oba da sie podrobic w minute.
 * Nazwa pliku jest losowa, zeby nie dalo sie nadpisac cudzego zdjecia ani
 * przemycic nazwy ze sciezka w srodku.
 *
 * Dodatkowa warstwa, niezalezna od tego kodu: .htaccess serwisu odmawia
 * uruchomienia PHP wszedzie poza katalogiem panelu, wiec plik .php wgrany
 * tu jako "zdjecie" i tak nie ma jak sie wykonac.
 */
function zapiszObrazek(array $plik, ?string &$blad = null): ?string {
    if (($plik['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return null;

    if (($plik['error'] ?? 1) !== UPLOAD_ERR_OK) {
        $blad = 'Nie udało się wgrać pliku. Spróbuj ponownie.';
        return null;
    }
    if (!is_uploaded_file($plik['tmp_name'])) {
        $blad = 'Nieprawidłowy plik.';
        return null;
    }
    if (($plik['size'] ?? 0) > MAX_OBRAZEK) {
        $blad = 'Zdjęcie jest za duże. Maksimum to 5 MB.';
        return null;
    }

    $info = @getimagesize($plik['tmp_name']);
    if ($info === false || !isset(DOZWOLONE_TYPY[$info[2]])) {
        $blad = 'To nie jest zdjęcie. Dozwolone formaty: JPG, PNG i WEBP.';
        return null;
    }

    [$szer, $wys] = $info;
    if ($szer < 400 || $wys < 200) {
        $blad = "Zdjęcie jest za małe ($szer na $wys pikseli). Potrzebne co najmniej 400 na 200.";
        return null;
    }

    $rozszerzenie = DOZWOLONE_TYPY[$info[2]];
    $nazwa = date('Y-m') . '-' . bin2hex(random_bytes(8)) . '.' . $rozszerzenie;
    $katalog = DANE . '/obrazki';
    if (!is_dir($katalog) && !@mkdir($katalog, 0755, true)) {
        $blad = 'Nie udało się utworzyć katalogu na zdjęcia.';
        return null;
    }

    // Zdjecia z telefonu potrafia miec 4000 pikseli szerokosci i kilka MB.
    // Na stronie i tak wyswietla sie najwyzej 868, wiec zmniejszamy — bez
    // tego kazdy odwiedzajacy artykul ciagnalby kilka megabajtow.
    $cel = $katalog . '/' . $nazwa;
    if ($szer > 1400 && function_exists('imagecreatetruecolor') && $rozszerzenie !== 'webp') {
        if (zmniejsz($plik['tmp_name'], $cel, $info[2], $szer, $wys, 1400)) {
            @chmod($cel, 0644);
            return '/dane/obrazki/' . $nazwa;
        }
    }

    if (!@move_uploaded_file($plik['tmp_name'], $cel)) {
        $blad = 'Nie udało się zapisać zdjęcia.';
        return null;
    }
    @chmod($cel, 0644);
    return '/dane/obrazki/' . $nazwa;
}

/** Zmniejszenie do zadanej szerokosci. Gdy biblioteki brak, wraca false. */
function zmniejsz(string $zrodlo, string $cel, int $typ, int $szer, int $wys, int $doSzerokosci): bool {
    // Swiadomie bez konstrukcji match: jest dopiero w PHP 8.0, a przy
    // starszej wersji plik nie sparsowalby sie w ogole i padlby caly panel,
    // nie tylko zmniejszanie zdjec.
    if ($typ === IMAGETYPE_JPEG) {
        $obraz = @imagecreatefromjpeg($zrodlo);
    } elseif ($typ === IMAGETYPE_PNG) {
        $obraz = @imagecreatefrompng($zrodlo);
    } else {
        $obraz = false;
    }
    if (!$obraz) return false;

    $nowaSzer = $doSzerokosci;
    $nowaWys = (int)round($wys * ($doSzerokosci / $szer));
    $maly = imagecreatetruecolor($nowaSzer, $nowaWys);
    if ($typ === IMAGETYPE_PNG) {
        imagealphablending($maly, false);
        imagesavealpha($maly, true);
    }
    imagecopyresampled($maly, $obraz, 0, 0, 0, 0, $nowaSzer, $nowaWys, $szer, $wys);

    $ok = $typ === IMAGETYPE_PNG ? imagepng($maly, $cel, 6) : imagejpeg($maly, $cel, 82);
    imagedestroy($obraz);
    imagedestroy($maly);
    return (bool)$ok;
}
