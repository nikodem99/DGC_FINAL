// Ile artykulow na jednej stronie listy porad.
//
// Osobny plik, bo ta liczba jest potrzebna w dwoch miejscach, ktore nie moga
// sie nawzajem importowac: w komponencie listy (przegladarka) i w src/seo/meta.js,
// ktory jest wczytywany przez vite.config.js w czystym Node. meta.js nie moze
// siegnac do blogs.js, bo blogs.js importuje pliki .jpg i .svg.
//
// Gdy ta liczba sie zmieni, zmieni sie tez liczba adresow /porady/strona/N.
// Oba miejsca licza ja z tej samej stalej, wiec nie rozjada sie po cichu.
export const NA_STRONE = 5;

/** Ile stron da lista przy podanej liczbie wpisow. Zawsze co najmniej jedna. */
export const ileStron = (ileWpisow) => Math.max(1, Math.ceil(ileWpisow / NA_STRONE));

export default NA_STRONE;
