# Panel do artykułów — instrukcja

Dla osób, które będą dodawać i poprawiać artykuły na stronie biurodgc.pl.
Nie trzeba nic umieć poza pisaniem w okienku.

---

## Logowanie

Adres panelu i hasło dostajecie osobno, od osoby, która przekazywała stronę.
Zapiszcie je w bezpiecznym miejscu.

**Hasła nie da się odzyskać.** Jest zapisane w sposób, który uniemożliwia
jego odczytanie komukolwiek, łącznie z osobą, która budowała stronę. Jeśli
zginie, trzeba będzie zlecić programiście zresetowanie panelu.

Po zalogowaniu widzicie listę wszystkich artykułów, od najnowszego.

---

## Dodanie nowego artykułu

Kliknijcie **Nowy artykuł** w prawym górnym rogu i wypełnijcie cztery pola.

**Tytuł** — to, co zobaczy czytelnik i Google. Adres artykułu powstaje z niego
automatycznie.

**Kategoria** — jedna z ośmiu z listy. Decyduje o tym, gdzie artykuł trafi
w bocznym menu „Kategorie".

**Data publikacji** — ustawia kolejność na liście. Najnowsze są na górze.

**Krótki opis** — dwa, trzy zdania. Pokazują się pod tytułem na liście
artykułów oraz w wynikach wyszukiwania Google. To często jedyne, co ktoś
przeczyta, zanim zdecyduje, czy kliknąć. Warto, żeby mówił, czego się
dowie, a nie zapowiadał, że „w artykule omówimy".

**Treść** — opisana niżej.

**Zdjęcie** — nieobowiązkowe. Jeśli nic nie wybierzecie, artykuł dostanie
okładkę z logo DGC, taką samą jak większość pozostałych.

Na końcu **Zapisz i opublikuj**. Artykuł jest na stronie od razu, nie trzeba
niczego zatwierdzać.

---

## Jak pisać treść

W polu treści piszecie zwykłym tekstem. Pięć znaków zmienia sposób
wyświetlania. Ściągawka jest zawsze widoczna nad polem w panelu.

### Akapit

Piszcie normalnie. **Pusta linia zaczyna nowy akapit.** To wszystko.

```
To jest pierwszy akapit.

A to jest drugi.
```

### Śródtytuł

Dwa znaki `#`, spacja, tekst:

```
## Kiedy trzeba mieć kasę fiskalną
```

Śródtytuły są ważne. Dzielą tekst na części, dzięki czemu czyta się go na
telefonie, i pomagają Google zrozumieć, o czym jest artykuł. W dłuższym
tekście warto dać jeden co kilka akapitów.

### Wypunktowanie

Myślnik, spacja, tekst. Kolejne linie łączą się w jedną listę:

```
- pierwsza rzecz
- druga rzecz
- trzecia rzecz
```

### Ramka z ostrzeżeniem

Znak `>`, spacja, tytuł ramki, pionowa kreska, treść:

```
> Uwaga | Zwolnienie z VAT nie zwalnia z kasy fiskalnej.
```

Tytuł można pominąć, wtedy wystarczy `> sama treść`.

### Ramka z przykładem

Tak samo, ale ze znakiem `!`:

```
! Przykład | Salon wykonał usługi za 18 000 zł i sprzedał kosmetyki za 2 000 zł.
```

Te dwie ramki wyglądają inaczej i to jest celowe. Ostrzeżenie mówi „uważaj",
przykład pokazuje, jak coś działa. Gdyby wyglądały tak samo, artykuł z trzema
ramkami rozpływałby się w jedną plamę.

### Podstawa prawna

Linia zaczynająca się od `Źródło:` trafia na koniec artykułu jako podstawa
prawna:

```
Źródło: Ustawa z 11 marca 2004 r. o podatku od towarów i usług.
```

### Pogrubienie

Dwie gwiazdki z każdej strony, w dowolnym miejscu zdania:

```
Kasa jest obowiązkowa **od pierwszej sprzedaży**.
```

Pogrubienie działa też w punktach listy i w ramkach.

---

## Zdjęcia

Wybierzcie plik z komputera. Przyjmowane formaty to JPG, PNG i WEBP, do 5 MB.

Najlepiej wyglądają zdjęcia **poziome, mniej więcej dwa razy szersze niż
wyższe**. Zdjęcie pionowe albo kwadratowe zostanie przycięte.

Duże zdjęcia z telefonu są automatycznie zmniejszane, więc nie trzeba niczego
przygotowywać wcześniej.

Przy edycji istniejącego artykułu widać miniaturę obecnego zdjęcia. Zostanie
ono na miejscu, dopóki nie wybierzecie nowego.

---

## Poprawianie istniejącego artykułu

Na liście kliknijcie **Edytuj** przy wybranym wpisie. Formularz otworzy się
z wypełnioną treścią. Po zapisaniu zmiana jest widoczna na stronie od razu.

Przy każdej zmianie panel zapisuje kopię poprzedniej wersji, więc da się
wrócić do tego, co było. Odzyskanie takiej kopii wymaga jednak programisty,
więc nie jest to przycisk „cofnij" — raczej siatka bezpieczeństwa.

Obok każdego wpisu jest też **Zobacz**, który otwiera artykuł na stronie
w nowej karcie. Warto po zapisaniu rzucić okiem.

---

## Czego nie da się zrobić w panelu

Panel obsługuje wyłącznie artykuły. **Nie zmienia się w nim** treści na
stronie głównej, w ofercie, w cenniku ani w kontakcie. Do tego potrzebny
jest programista.

Nie da się też zrobić tabeli. Artykuły, które już ją mają, zachowają ją przy
edycji, ale nowej nie dodacie.

Nie ma kont dla wielu osób. Wszyscy logują się tym samym hasłem.

---

## Gdy coś pójdzie nie tak

**Po zapisaniu panel pisze, ile stron odświeżył.** Jeśli zamiast tego pojawi
się czerwony komunikat, przeczytajcie go, bo zwykle mówi wprost, co jest nie
tak: za długi tytuł, pusta treść, zdjęcie w złym formacie.

Jeden komunikat wymaga programisty: **„szablon jest starszy niż wgrana
strona"**. Oznacza, że ktoś wgrał nową wersję strony bez kompletu plików.
Panel wtedy celowo odmawia zapisu, żeby nie wyprodukować stron bez stylów.
Nic się nie zepsuło, trzeba tylko wgrać poprawną paczkę.

**Jeśli po zapisaniu artykuł wygląda dziwnie**, na przykład cały tekst jest
w jednym bloku, to prawie zawsze znaczy, że zabrakło pustych linii między
akapitami. Wejdźcie w edycję i dodajcie je.

---

## Cennik

Zakładka **Cennik** w pasku na górze. Zmiany widać od razu na stronie głównej
i na podstronie Cennik — nie trzeba nikogo prosić o wgranie czegokolwiek.

Każdy pakiet ma:

- **Nazwę** — tak, jak ma się wyświetlić.
- **Cenę** — wpisujecie dokładnie to, co ma być widoczne, na przykład
  `od 200 zł`. Strona sama dopisuje pod spodem „netto / miesiąc".
- **Dla kogo** — jedno zdanie. Pokazuje się **tylko na stronie głównej**.
- **Co obejmuje** — jeden punkt w każdej linii. Myślnika na początku nie
  trzeba dopisywać, strona stawia go sama.
- **Pokaż na stronie głównej** — na stronie głównej mieszczą się trzy pakiety.
  Zaznaczcie te, które mają tam stać.
- **Wyróżnij** — pakiet dostaje ramkę i plakietkę „Pełna księgowość".

Na dole formularza jest jedno puste miejsce na **nowy pakiet**. Jeśli go nie
wypełnicie, nic się nie stanie.

**Żeby usunąć pakiet, wyczyśćcie jego nazwę i zapiszcie.**

Pakiet musi mieć przynajmniej jeden punkt w „Co obejmuje" — bez tego panel
nie zapisze i powie o tym.

---

## Pytania (FAQ)

Zakładka **Pytania**. Pokazują się na podstronie Pytania, a **pierwsze sześć
także na stronie O nas**. Kolejność na stronie jest taka jak w panelu.

Każda pozycja to pytanie i odpowiedź. Na dole są **trzy puste miejsca** na
nowe pytania.

**Żeby usunąć pytanie, wyczyśćcie oba pola i zapiszcie.**

Panel nie pozwoli zapisać pytania bez odpowiedzi ani odpowiedzi bez pytania —
na stronie powstałby wtedy nagłówek, który po kliknięciu nic nie pokazuje.

> **Dlaczego to jest ważne dla Google**
> Pytania i odpowiedzi z tej zakładki trafiają też do danych, które czyta
> wyszukiwarka. Dzięki nim odpowiedzi potrafią pokazać się bezpośrednio
> w wynikach. Dlatego warto, żeby odpowiedź była pełnym zdaniem, a nie
> jednym słowem.

---

## Umów konsultację

Zakładka **Konsultacja**. Cena, czas trwania i dwie listy z podstrony
„Umów konsultację".

- **Cena** — tak, jak ma się wyświetlić, na przykład `od 250 zł netto`.
- **Za co** — napis pod ceną, na przykład `za 30 minut konsultacji`.
- **Czas trwania** — pojawia się w tabelce obok.
- **Co z tego masz** i **Jak się przygotować** — jeden punkt w każdej linii.

Kroki „Jak to działa" i opcje w formularzu zgłoszeniowym zostają poza
panelem. Opcje muszą zgadzać się z listą tematów, którą sprawdza wysyłka
zgłoszeń — zmiana z panelu mogłaby popsuć odbieranie zapytań.

---

## Dane kontaktowe

Zakładka **Kontakt**. Telefon, godziny pracy i adres e-mail.

Te trzy rzeczy są w stopce, czyli **na każdej podstronie**. Zapis zmienia
je wszystkie naraz i może potrwać kilkanaście sekund — nie zamykajcie
wtedy strony. Panel na końcu napisze, ile stron zmienił.

Numer wpisujecie tak, jak ma być widoczny (`731 580 184`). Odnośnik do
dzwonienia z telefonu składa się sam.

> **Uwaga przy zmianie adresu e-mail**
> Zmiana tutaj zmienia adres **tylko na stronie**. Skrzynka, na którą
> przychodzą zgłoszenia z formularzy, jest ustawiona osobno, w innym pliku.
> Jeśli zmieniacie adres na dobre, powiedzcie o tym osobie opiekującej się
> stroną, inaczej zgłoszenia dalej będą szły na stary.

---

## Teksty na podstronach oferty

Zakładka **Oferta**. Jest sześć podstron, każdą edytuje się osobno.

Każda składa się z **wstępu** i kilku **sekcji**. Sekcja ma śródtytuł,
akapity, opcjonalne wypunktowanie i opcjonalne akapity pod nim.

- **Pusta linia zaczyna nowy akapit** — tak samo jak w artykułach.
- **Wypunktowanie** — jeden punkt w każdej linii. Zostawcie puste, jeśli
  sekcja go nie ma.
- Na dole jest jedno puste miejsce na **nową sekcję**.
- **Żeby usunąć sekcję, wyczyśćcie jej śródtytuł i zapiszcie.**

> **Czego tu nie ma: nazwy usługi**
> Nazwa („Biuro rachunkowe Łódź" i pozostałe) jest jednocześnie pozycją
> w menu, a menu jest na każdej stronie serwisu. Gdyby dało się ją zmienić
> tutaj, menu zostałoby ze starą nazwą i nikt by nie wiedział dlaczego.
> Zmiana nazwy usługi wymaga programisty — zadzwońcie.

---

## Czego panel NIE zmienia

Żeby nie było nieporozumień — te rzeczy wymagają programisty:

- układ stron, kolory, nowe sekcje i nowe podstrony,
- nazwy usług i pozycje w menu,
- skład zespołu i zdjęcia na stronie,
- polityka prywatności,
- menu i stopka.

Przy zmianie składu zespołu albo zdjęć **zadzwońcie do osoby opiekującej się
stroną**. To świadoma decyzja: te fragmenty są zbudowane tak, że łatwo je
zepsuć, a trudno naprawić bez dostępu do kodu.

---

## Jedna rzecz do zapamiętania przy zmianie wykonawcy

Artykuły dodane przez panel **oraz cennik, pytania, konsultacja, dane
kontaktowe i teksty oferty** żyją na serwerze, a nie
w materiałach, które dostał wykonawca strony. Jeśli kiedyś ktoś będzie wgrywał
nową wersję strony, **musi najpierw pobrać te dane z serwera**, inaczej je
nadpisze — razem z każdą zmianą ceny, którą zrobiliście w panelu.

Powiedzcie to osobie, która będzie to robić, i pokażcie jej plik
`dokumenty/przekazanie-techniczne.md` z materiałów strony. Jest tam opisane
dokładnie, co trzeba zrobić.
