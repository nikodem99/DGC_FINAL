# GTM: import i dokończenie konfiguracji

Plik: `gtm-dgc-import.json`. Kontener: **GTM-5Z98MN2**.

## 1. Import (2 minuty)

GTM → **Administrator** → **Importuj kontener** → wybierz plik.

- Obszar roboczy: **Istniejący** → `Default Workspace`
- Opcja scalania: **Scal** (Merge), nie „Zastąp"
- Konflikty: **Zmień nazwy konfliktujących** (Rename), nie „Nadpisz"

Zobaczysz podgląd zmian: 3 zmienne, 3 reguły, 3 tagi, 10 zmiennych wbudowanych.
Nic nie zostanie usunięte ani nadpisane.

## 2. Co plik wnosi

| Element | Co robi |
|---|---|
| `DGC - CE - lead_form_submit` | łapie wysłanie dowolnego z 4 formularzy |
| `DGC - CE - newsletter_signup` | łapie zapis na newsletter |
| `DGC - Klik w numer telefonu` | łapie kliknięcie w odnośnik `tel:` |
| `DGC - GA4 - Lead z formularza` | wysyła do GA4 zdarzenie `generate_lead` |
| `DGC - GA4 - Zapis na newsletter` | wysyła `newsletter_signup` |
| `DGC - GA4 - Klik w telefon` | wysyła `klik_telefon` |
| `DGC - DLV - form_type` / `form_topic` | wyciągają dane z warstwy danych |

Zmienne wbudowane **Click URL** i **Click Element** są włączane celowo.
Bez nich warunek „Click URL zaczyna się od tel:" rozwiązuje się do pustej
wartości i konwersja z telefonu nie zadziała ani razu, bez żadnego błędu.

## 3. Dwie rzeczy do dodania ręcznie

Nie ma ich w pliku, bo nie znalazłem ich kształtu w żadnym prawdziwym
eksporcie, a zgadywanie kończy się tagiem, który się importuje i nie działa.

**Parametry zdarzenia.** Otwórz tag `DGC - GA4 - Lead z formularza` →
rozwiń **Parametry zdarzenia** → dodaj dwa wiersze:

    form_type   →  {{DGC - DLV - form_type}}
    form_topic  →  {{DGC - DLV - form_topic}}

Bez tego konwersja liczy się poprawnie, ale w raportach nie rozbijesz jej
na formularze.

**Sprawdź, nie dodawaj: wirtualne odsłony.** W GA4 → Administrator →
Strumienie danych → Ulepszone pomiary sprawdź, czy „Zmiany strony na
podstawie zdarzeń historii przeglądarki" jest włączone. Domyślnie jest.
Jeśli tak, przejścia po menu są już liczone i **nie dokładaj reguły
History Change w GTM**, bo zdublujesz odsłony.

## 4. Test przed publikacją

**Podgląd** w GTM → wejdź na biurodgc.pl → **zaakceptuj zgody**
(bez tego kontener się nie załaduje, to zamierzone).

Sprawdź, że odpalają się:
- wyślij formularz → `DGC - GA4 - Lead z formularza`
- kliknij numer telefonu → `DGC - GA4 - Klik w telefon`
- zapisz się na newsletter → `DGC - GA4 - Zapis na newsletter`

Przy okazji zerknij, czy `page_view` nie leci dwa razy. W kontenerze są
trzy tagi typu „Google tag" i to klasyczne źródło podwójnych odsłon.

## 5. Publikacja i konwersje

Po udanym teście: **Prześlij** → nazwij wersję → Opublikuj.

**GA4** → Administrator → Zdarzenia: oznacz jako kluczowe `generate_lead`
i `klik_telefon`. Newsletter **zostaw nieoznaczony**.

**Google Ads** → Cele → Konwersje → Nowa konwersja → Import → GA4 →
zaznacz `generate_lead` i `klik_telefon` → obie jako **główne**.

Newsletter świadomie nie jest konwersją: to najsłabszy sygnał intencji
i najtańsze zdarzenie. Wrzucony do tej samej konwersji co formularze
sprawi, że Smart Bidding zacznie optymalizować pod zapisy do newslettera.
