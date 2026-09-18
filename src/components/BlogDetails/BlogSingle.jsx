import React from 'react';
import { Link, useParams } from 'react-router-dom'
import blogs from '../../api/blogs.js';
import tresci from '../../api/blogContent.js';
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
// Tresc leci z blogContent.js, a sasiednie wpisy z kolejnosci w blogs.js.

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

// Jeden blok tresci. Typy opisane w blogContent.js.
const Blok = ({ blok }) => {
    if (blok.t === 'h') return <h3>{blok.x}</h3>;
    if (blok.t === 'p') return <p>{blok.x}</p>;
    if (blok.t === 'ul') return (
        <ul className="wpis_lista">
            {blok.x.map((poz) => <li key={poz}>{poz}</li>)}
        </ul>
    );
    if (blok.t === 'uwaga') return (
        <aside className="wpis_uwaga">
            {blok.h && <strong>{blok.h}</strong>}
            <p>{blok.x}</p>
        </aside>
    );
    if (blok.t === 'zrodlo') return (
        <p className="wpis_zrodlo"><strong>Podstawa prawna:</strong> {blok.x}</p>
    );
    return null;
};

const BlogSingle = (props) => {
    const { slug } = useParams()
    const wpis = blogs.find(item => item.slug === slug)

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

    const bloki = tresci[wpis.slug] ?? [];
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
                                <h2>{wpis.title2}</h2>

                                {bloki.map((blok, i) => <Blok blok={blok} key={i} />)}
                            </article>

                            {(poprzedni || nastepny) && (
                                <div className="more-posts">
                                    <div className="previous-post">
                                        {poprzedni && (
                                            <Link onClick={ClickHandler} to={`/porady/${poprzedni.slug}/`}>
                                                <span className="post-control-link">Poprzedni wpis</span>
                                                <span className="post-name">{poprzedni.title2}</span>
                                            </Link>
                                        )}
                                    </div>
                                    <div className="next-post">
                                        {nastepny && (
                                            <Link onClick={ClickHandler} to={`/porady/${nastepny.slug}/`}>
                                                <span className="post-control-link">Następny wpis</span>
                                                <span className="post-name">{nastepny.title2}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <BlogSidebar blLeft={props.blLeft} />
                </div>
            </div>
        </section>
    )
}

export default BlogSingle;
