import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import BlogSidebar from '../BlogSidebar/BlogSidebar.jsx'
import blogs from '../../api/blogs.js'
import { NA_STRONE } from '../../api/stronicowanie.js'

// Ile numerow stron pokazujemy wokol biezacej. Przy 376 wpisach jest 76
// stron i wypisanie wszystkich dawalo scianę cyfr na cala szerokosc,
// nie do uzycia ani myszka, ani palcem. Pokazujemy pierwsza, ostatnia,
// biezaca i po dwie sasiednie, a dziury zaznaczamy wielokropkiem.
const WOKOL = 2;

const numeryStron = (biezaca, stron) => {
    if (stron <= 7) return Array.from({ length: stron }, (_, i) => i + 1);
    const zbior = new Set([1, stron, biezaca]);
    for (let i = 1; i <= WOKOL; i++) {
        if (biezaca - i > 1) zbior.add(biezaca - i);
        if (biezaca + i < stron) zbior.add(biezaca + i);
    }
    const kolejno = [...zbior].sort((a, b) => a - b);
    const wynik = [];
    let poprzedni = 0;
    for (const nr of kolejno) {
        if (poprzedni && nr - poprzedni > 1) wynik.push(`przerwa-${nr}`);
        wynik.push(nr);
        poprzedni = nr;
    }
    return wynik;
};

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogList = (props) => {
    const [wybranyMiesiac, setWybranyMiesiac] = useState('all');
    const [wybranaKategoria, setWybranaKategoria] = useState('all');

    // Numer strony bierze sie z ADRESU, a nie ze stanu komponentu.
    //
    // Wczesniej byl to useState i przyciski, wiec przejscie na strone 2
    // nie zmienialo adresu. Dla robota Google znaczylo to, ze lista porad
    // ma piec artykulow, a pozostale 371 sa osiagalne tylko z mapy strony.
    // Audyt na zywej stronie zmierzyl mediane glebokosci klikniecia na 188.
    //
    // Filtry kategorii i miesiaca zostaja w stanie: one zawezaja widok
    // i nie musza byc indeksowane osobno, a ich wlasne adresy tworzylyby
    // setki stron z ta sama trescia w roznych kombinacjach.
    const { nr: nrZAdresu } = useParams();
    const nawiguj = useNavigate();
    const zAdresu = Number.parseInt(nrZAdresu ?? '1', 10);
    const strona = Number.isFinite(zAdresu) && zAdresu > 0 ? zAdresu : 1;

    const widoczne = blogs.filter((blog) => (
        (wybranyMiesiac === 'all' || blog.archiveMonth === wybranyMiesiac) &&
        (wybranaKategoria === 'all' || blog.tag === wybranaKategoria)
    ));

    const stron = Math.max(1, Math.ceil(widoczne.length / NA_STRONE));
    // Filtr moze skrocic liste tak, ze biezaca strona przestaje istniec
    // (np. z trzeciej strony klikamy kategorie z jednym wpisem). Zamiast
    // pokazac pustke, cofamy sie na ostatnia istniejaca strona.
    const biezaca = Math.min(strona, stron);
    const naStronie = widoczne.slice((biezaca - 1) * NA_STRONE, biezaca * NA_STRONE);

    // Po zmianie filtra zawsze wracamy na pierwsza strone — inaczej po
    // zawezeniu listy uzytkownik ladowalby w jej srodku.
    const zmienFiltr = (ustaw) => (wartosc) => {
        ustaw(wartosc);
        if (strona !== 1) nawiguj('/porady/');
    };

    // Adres strony listy. Pierwsza to /porady/, bo dwa adresy z ta sama
    // trescia bylyby duplikatem.
    const adresStrony = (nr) => (nr <= 1 ? '/porady/' : `/porady/strona/${nr}/`);

    return (
        <section className="wpo-blog-pg-section section-padding">
            <div className="container">
                <div className="row">
                    <div className={`col col-lg-8 col-12 ${props.blRight}`}>
                        <div className="wpo-blog-content">
                            {widoczne.length === 0 && (
                                <p className="blog_pusto">
                                    Brak wpisów dla wybranych filtrów.{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setWybranyMiesiac('all');
                                            setWybranaKategoria('all');
                                            if (strona !== 1) nawiguj('/porady/');
                                        }}
                                    >
                                        Pokaż wszystkie
                                    </button>
                                </p>
                            )}

                            {naStronie.map((blog) => (
                                <div className={`post  ${blog.blClass}`} key={blog.id}>
                                    {/* Bez przycisku odtwarzania. Szablon mial tu
                                        VideoModal w kazdym wpisie, ale do artykulow
                                        nie ma filmow — zostaje samo zdjecie. */}
                                    <div className="entry-media">
                                        <img src={blog.blogSingleImg} alt="" />
                                    </div>
                                    <div className="entry-meta">
                                        <ul>
                                            <li><i className="fi flaticon-user"></i> {blog.author}</li>
                                            <li><i className="fi flaticon-calendar"></i> {blog.create_at}</li>
                                            <li><i className="fi flaticon-tag"></i> {blog.tag}</li>
                                        </ul>
                                    </div>
                                    <div className="entry-details">
                                        <h3><Link onClick={ClickHandler} to={`/porady/${blog.slug}/`} className="karta_klik">{blog.title2 ?? blog.title}</Link></h3>
                                        <p>{blog.description}</p>
                                        <Link onClick={ClickHandler} to={`/porady/${blog.slug}/`} className="read-more">Czytaj dalej</Link>
                                    </div>
                                </div>
                            ))}

                            {/* Stronicowanie liczone z listy, nie wpisane na sztywno.
                                Szablon mial tu zawsze "1 2 3" prowadzace do
                                nieistniejacych podstron /blog-left-sidebar. */}
                            {stron > 1 && (
                                <div className="pagination-wrapper pagination-wrapper-left">
                                    <nav aria-label="Strony wpisów">
                                        <ul className="pg-pagination">
                                            <li>
                                                {biezaca === 1 ? (
                                                    <span className="pg-nieczynne" aria-hidden="true">
                                                        <i className="fi ti-angle-left"></i>
                                                    </span>
                                                ) : (
                                                    <Link
                                                        to={adresStrony(biezaca - 1)}
                                                        onClick={ClickHandler}
                                                        aria-label="Poprzednia strona"
                                                    >
                                                        <i className="fi ti-angle-left"></i>
                                                    </Link>
                                                )}
                                            </li>
                                            {numeryStron(biezaca, stron).map((nr) => (
                                                typeof nr === 'string' ? (
                                                    <li key={nr} className="pg-przerwa" aria-hidden="true">
                                                        <span>…</span>
                                                    </li>
                                                ) : (
                                                    <li key={nr} className={nr === biezaca ? 'active' : undefined}>
                                                        <Link
                                                            to={adresStrony(nr)}
                                                            onClick={ClickHandler}
                                                            aria-label={`Strona ${nr}`}
                                                            aria-current={nr === biezaca ? 'page' : undefined}
                                                        >
                                                            {nr}
                                                        </Link>
                                                    </li>
                                                )
                                            ))}
                                            <li>
                                                {biezaca === stron ? (
                                                    <span className="pg-nieczynne" aria-hidden="true">
                                                        <i className="fi ti-angle-right"></i>
                                                    </span>
                                                ) : (
                                                    <Link
                                                        to={adresStrony(biezaca + 1)}
                                                        onClick={ClickHandler}
                                                        aria-label="Następna strona"
                                                    >
                                                        <i className="fi ti-angle-right"></i>
                                                    </Link>
                                                )}
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                    <BlogSidebar
                        blLeft={props.blLeft}
                        selectedMonth={wybranyMiesiac}
                        onMonthChange={zmienFiltr(setWybranyMiesiac)}
                        selectedCategory={wybranaKategoria}
                        onCategoryChange={zmienFiltr(setWybranaKategoria)}
                    />
                </div>
            </div>
        </section>

    )

}

export default BlogList;
