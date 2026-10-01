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

## Jedna rzecz do zapamiętania przy zmianie wykonawcy

Artykuły dodane przez panel żyją na serwerze, a nie w materiałach, które
dostał wykonawca strony. Jeśli kiedyś ktoś będzie wgrywał nową wersję strony,
**musi najpierw pobrać artykuły z serwera**, inaczej je nadpisze.

Powiedzcie to osobie, która będzie to robić, i pokażcie jej plik
`dokumenty/przekazanie-techniczne.md` z materiałów strony. Jest tam opisane
dokładnie, co trzeba zrobić.
