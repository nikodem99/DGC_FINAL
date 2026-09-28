# GTM: naprawa konwersji z formularza

Kontener **GTM-5Z98MN2**. Plik: `gtm-dgc-naprawa.json`.

## Co było zepsute

Trigger „klik wyślij" (id 8) wymaga klasy `wpcf7-form-control wpcf7-submit`.
To jest Contact Form 7, wtyczka WordPressa. Na nowej stronie przyciski mają
klasę `theme-btn`, a ciąg `wpcf7` nie występuje w żadnym z 33 plików.

Na tym martwym triggerze wisiały trzy tagi:
- konwersja Google Ads „przesłanie formularza kontaktowego"
- Enhanced conversions
- zdarzenie GA4 `przesłanie_form`

Od uruchomienia nowej strony 22.09.2026 nie policzyła się ani jedna
konwersja z formularza.

Reszta kontenera działa: telefon (`Click URL zawiera tel:`), mail
(`mailto:`) i zaangażowanie (80% + 1 min) pasują do nowej strony.

## Co robi plik

Bierze Twój eksport obszaru roboczego 15 i zmienia w nim dokładnie tyle:

1. dodaje regułę **`lead_form_submit`** — zdarzenie, które strona wysyła
   po POTWIERDZONEJ wysyłce formularza, nie po kliknięciu przycisku,
2. przepina te same trzy tagi z martwego triggera 8 na nową regułę,
3. dodaje regułę `newsletter_signup` i tag GA4 dla niej,
4. dodaje zmienne `DLV - form_type` i `DLV - form_topic` do raportów.

**Etykieta konwersji Ads zostaje ta sama** (`9lACCOjq6N8DEKuC8tEC`).
Konwersja w Google Ads już istnieje i zachowa swoją historię.
W panelu Ads nie trzeba tworzyć niczego nowego.

## Wariant A: import (jeśli masz opcję)

Administracja → **Pokaż więcej** → Importuj kontener. Jeśli tej pozycji
nie widzisz, nie masz uprawnień do publikowania i wtedy patrz wariant B.

- Obszar roboczy: **Istniejący** → Default Workspace
- Opcja: **Zastąp** (Overwrite) — plik zawiera CAŁY Twój kontener
  plus poprawkę, więc nadpisanie jest tu właściwe
- Sprawdź podgląd: 13 tagów, 8 reguł, 4 zmienne

## Wariant B: ręcznie, około 5 minut

**1. Nowa reguła**
Obszar roboczy → Reguły → Nowa → Konfiguracja → Inne →
**Zdarzenie niestandardowe**
- Nazwa zdarzenia: `lead_form_submit`
- „Reguła uruchamia się przy": Wszystkie zdarzenia niestandardowe
- Nazwa reguły: `lead_form_submit (wysyłka potwierdzona)`

**2. Przepnij trzy tagi**
Dla każdego z nich: Tagi → otwórz → sekcja Reguły → usuń „klik wyślij" →
dodaj regułę z punktu 1 → Zapisz.
- `przesłanie formularza kontaktowego`
- `Enhanced conersions`
- `przesłanie_form - GA4`

Trigger „klik wyślij" zostaje bez żadnego tagu. Możesz go zostawić.

## Test przed publikacją

**Podgląd** → wejdź na biurodgc.pl → **zaakceptuj zgody** (bez tego
kontener się nie załaduje) → wyślij formularz.

Mają odpalić się trzy tagi na zdarzeniu `lead_form_submit`. Kliknij też
w numer telefonu i sprawdź, czy dalej odpala się „kontakt telefoniczny".

Dopiero potem **Prześlij** i publikuj.

---

## Wynik: wdrożone 28.09.2026

Opublikowane jako **wersja 15** kontenera GTM-5Z98MN2, o 15:03.
Zawartość wersji: 13 tagów, 8 reguł, 33 zmienne.

Potwierdzone w Tag Assistant przed publikacją: na zdarzeniu
`lead_form_submit` odpalają się wszystkie trzy tagi, każdy raz:
- `przesłanie formularza kontaktowego` (konwersja Google Ads)
- `Enhanced conersions`
- `przesłanie_form - GA4`

Potwierdzone po publikacji, odczytem żywego kontenera z serwerów Google:
- `lead_form_submit`, `newsletter_signup`, `form_type`, `form_topic` obecne
- `wpcf7` — **0 wystąpień**, martwy warunek Contact Form 7 zniknął
  z opublikowanej wersji, bo nie wisi na nim już żaden tag

Konwersje trafiają do Google Ads bezpośrednio, tagami z etykietami.
Nie trzeba niczego importować z GA4 ani tworzyć w panelu Ads.

### Okres bez pomiaru

Od 22.09.2026 (uruchomienie nowej strony) do 28.09.2026 (ta poprawka)
konwersje z formularzy NIE były zliczane. Telefon, mail i zaangażowanie
działały przez cały czas. Przy ocenie wyników kampanii z tego tygodnia
trzeba to uwzględnić.
