import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import BlogSidebar from '../BlogSidebar/BlogSidebar.jsx'
import blogs from '../../api/blogs.js'

// Ile wpisow na jednej stronie. Przy pietnastu artykulach daje trzy strony.
const NA_STRONE = 5;

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogList = (props) => {
    const [wybranyMiesiac, setWybranyMiesiac] = useState('all');
    const [wybranaKategoria, setWybranaKategoria] = useState('all');
    const [strona, setStrona] = useState(1);

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
        setStrona(1);
    };

    const idzDoStrony = (nr) => {
        if (nr < 1 || nr > stron) return;
        setStrona(nr);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                                            setStrona(1);
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
                                        <h3><Link onClick={ClickHandler} to={`/porady/${blog.slug}/`}>{blog.title2}</Link></h3>
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
                                                <button
                                                    type="button"
                                                    onClick={() => idzDoStrony(biezaca - 1)}
                                                    disabled={biezaca === 1}
                                                    aria-label="Poprzednia strona"
                                                >
                                                    <i className="fi ti-angle-left"></i>
                                                </button>
                                            </li>
                                            {Array.from({ length: stron }, (_, i) => i + 1).map((nr) => (
                                                <li key={nr} className={nr === biezaca ? 'active' : undefined}>
                                                    <button
                                                        type="button"
                                                        onClick={() => idzDoStrony(nr)}
                                                        aria-label={`Strona ${nr}`}
                                                        aria-current={nr === biezaca ? 'page' : undefined}
                                                    >
                                                        {nr}
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => idzDoStrony(biezaca + 1)}
                                                    disabled={biezaca === stron}
                                                    aria-label="Następna strona"
                                                >
                                                    <i className="fi ti-angle-right"></i>
                                                </button>
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
