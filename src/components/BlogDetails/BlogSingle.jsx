import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import { uzyjWpisow } from '../../api/uzyjWpisow.js';
import { zPamieci, wczytaj } from '../../api/tresci.js';
import BlogSidebar from '../BlogSidebar/BlogSidebar.jsx'

// Strona pojedynczego wpisu.
//
// Szablon mial tu wszystko wpisane na sztywno: dwa akapity lorem ipsum
// niezaleznie od artykulu, cytat po lacinie, galerie z dwoma przypadkowymi
// zdjeciami, zmyslony biogram autora, cztery linki "share" prowadzace
// donikad, sekcje komentarzy z trzema wymyslonymi wpisami i formularzem,
// ktory nic nie robil, oraz "Previous / Next Post" z lorem ipsum zamiast
// tytulow. Nic z tego nie zostalo.
//
// Tresc leci z api/tresci.js, a sasiednie wpisy z kolejnosci w blogs.js.
// Tresci NIE ma w paczce JavaScriptu, powod opisany w api/tresci.js.

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

// Pogrubienia w tresci zapisujemy jako **tekst**. Skladamy je na elementy
// Reacta, a nie przez wstrzykiwanie HTML: tresc artykulu nie ma jak wykonac
// kodu, nawet gdyby kiedys trafiala tu z panelu albo z cudzego pliku.
const Tekst = ({ x }) => {
    if (typeof x !== 'string' || !x.includes('**')) return x;
    // split z grupa przechwytujaca zwraca na przemian: tekst, pogrubienie,
    // tekst, pogrubienie... wiec nieparzyste pozycje sa pogrubione.
    return x.split(/\*\*(.+?)\*\*/g).map((czesc, i) =>
        i % 2 ? <strong key={i}>{czesc}</strong> : czesc
    );
};

// Jeden blok tresci. Typy opisane w api/tresci.js.
const Blok = ({ blok }) => {
    if (blok.t === 'h') return <h3>{blok.x}</h3>;
    if (blok.t === 'p') return <p><Tekst x={blok.x} /></p>;
    if (blok.t === 'ul') return (
        <ul className="wpis_lista">
            {blok.x.map((poz) => <li key={poz}><Tekst x={poz} /></li>)}
        </ul>
    );
    if (blok.t === 'tabela') return (
        // Ramka z wlasnym przewijaniem. Bez niej szeroka tabela rozpycha
        // cala strone w bok na telefonie.
        <div className="wpis_tabela_ramka">
            <table className="wpis_tabela">
                {blok.h && (
                    <thead>
                        <tr>{blok.h.map((kol) => <th key={kol}>{kol}</th>)}</tr>
                    </thead>
                )}
                <tbody>
                    {blok.x.map((wiersz, i) => (
                        <tr key={i}>
                            {wiersz.map((kom, j) => <td key={j}><Tekst x={kom} /></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    // Przyklad z praktyki. Osobny typ, a nie 'uwaga', bo to co innego:
    // uwaga ostrzega, przyklad pokazuje. Gdyby oba wygladaly tak samo,
    // artykul z trzema ramkami rozplywalby sie w jedna plame.
    if (blok.t === 'przyklad') return (
        <aside className="wpis_przyklad">
            {blok.h && <strong>{blok.h}</strong>}
            <p><Tekst x={blok.x} /></p>
        </aside>
    );
    if (blok.t === 'uwaga') return (
        <aside className="wpis_uwaga">
            {blok.h && <strong>{blok.h}</strong>}
            <p><Tekst x={blok.x} /></p>
        </aside>
    );
    if (blok.t === 'zrodlo') return (
        <p className="wpis_zrodlo"><strong>Podstawa prawna:</strong> {blok.x}</p>
    );
    return null;
};

const BlogSingle = (props) => {
    const blogs = uzyjWpisow();
    const { slug } = useParams()
    const wpis = blogs.find(item => item.slug === slug)

    // Haki musza stac przed jakimkolwiek wyjsciem z komponentu, inaczej
    // przy wejsciu na nieistniejacy adres React zobaczy inna liczbe hakow
    // niz przy poprzednim rysowaniu i przerwie renderowanie.
    //
    // Przy pierwszym wejsciu tresc jest juz w pamieci, bo prerender wstawil
    // ja do HTML-a. Zapytanie leci dopiero przy przeskoku na inny artykul
    // wewnatrz serwisu.
    const [bloki, setBloki] = useState(() => zPamieci(slug) ?? null);

    useEffect(() => {
        const gotowe = zPamieci(slug);
        if (gotowe) { setBloki(gotowe); return; }
        let aktualny = true;
        setBloki(null);
        wczytaj(slug)
            .then((b) => { if (aktualny) setBloki(b); })
            .catch(() => { if (aktualny) setBloki([]); });
        return () => { aktualny = false; };
    }, [slug]);

    // Wejscie na nieistniejacy adres nie moze wywalic calej strony bialym
    // ekranem — szablon czytal tu wprost .blogSingleImg z undefined.
    if (!wpis) {
        return (
            <section className="wpo-blog-single-section section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col col-lg-8 col-12">
                            <p className="blog_pusto">
                                Nie znaleźliśmy takiego wpisu.{' '}
                                <Link onClick={ClickHandler} to="/porady/">Wróć do porad</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const nr = blogs.findIndex(item => item.slug === slug);
    const poprzedni = blogs[nr - 1];
    const nastepny = blogs[nr + 1];

    return (
        <section className="wpo-blog-single-section section-padding">
            <div className="container">
                <div className="row">
                    <div className={`col col-lg-8 col-12 ${props.blRight}`}>
                        <div className="wpo-blog-content">
                            <article className="post format-standard-image">
                                <div className="entry-media">
                                    <img src={wpis.blogSingleImg} alt="" />
                                </div>
                                <div className="entry-meta">
                                    <ul>
                                        <li><i className="fi flaticon-user"></i> {wpis.author}</li>
                                        <li><i className="fi flaticon-calendar"></i> {wpis.create_at}</li>
                                        <li><i className="fi flaticon-tag"></i> {wpis.tag}</li>
                                    </ul>
                                </div>
                                <h2>{wpis.title2 ?? wpis.title}</h2>

                                {bloki === null
                                    ? <p className="wpis_ladowanie">Wczytywanie tresci artykulu…</p>
                                    : bloki.map((blok, i) => <Blok blok={blok} key={i} />)}
                            </article>

                            {(poprzedni || nastepny) && (
                                <div className="more-posts">
                                    <div className="previous-post">
                                        {poprzedni && (
                                            <Link onClick={ClickHandler} to={`/porady/${poprzedni.slug}/`}>
                                                <span className="post-control-link">Poprzedni wpis</span>
                                                <span className="post-name">{poprzedni.title2 ?? poprzedni.title}</span>
                                            </Link>
                                        )}
                                    </div>
                                    <div className="next-post">
                                        {nastepny && (
                                            <Link onClick={ClickHandler} to={`/porady/${nastepny.slug}/`}>
                                                <span className="post-control-link">Następny wpis</span>
                                                <span className="post-name">{nastepny.title2 ?? nastepny.title}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <BlogSidebar blLeft={props.blLeft} slug={slug} />
                </div>
            </div>
        </section>
    )
}

export default BlogSingle;
