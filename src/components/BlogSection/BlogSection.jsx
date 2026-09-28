import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import blogs from '../../api/blogs'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSection = (props) => {

    return (
        <section className={"" + props.tClass}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-12">
                        <SectionTitle title={"Porady"} subtitle={"Ostatnie wpisy"} />
                    </div>
                </div>
                <div className="row">
                    {blogs.slice(0, 3).map((bloge, bkye) => (
                        <div className="col-lg-4 col-md-6 col-12" key={bkye}>
                            <div className="blog_card">
                                <img src={bloge.screens} alt="" />
                                <span>{bloge.tag}</span>
                                {/* Warstwa klikalna na cala karte. Osobny, pusty
                                    odnosnik zamiast rozciagania istniejacego: tamten
                                    siedzi w h3 z overflow hidden albo ma wlasne
                                    pozycjonowanie, wiec w obu przypadkach warstwa
                                    bylaby przycieta. Nazwa dla czytnikow z aria-label. */}
                                <Link
                                    onClick={ClickHandler}
                                    to={`/porady/${bloge.slug}/`}
                                    className="karta_klik"
                                    aria-label={bloge.title}
                                />
                                <div className="content">
                                    <ul>
                                        <li>{bloge.create_at}</li>
                                        <li>{bloge.author}</li>
                                    </ul>
                                    <h3>{bloge.title}</h3>
                                    {/* Strzalka zostaje DOKLADNIE taka, jaka byla.
                                        Ma wlasne pozycjonowanie z szablonu i proba
                                        zrobienia z niej warstwy klikalnej wyrzucala ja
                                        poza karte. Jest teraz ozdoba: aria-hidden
                                        i tabIndex -1, zeby czytniki ekranu i klawiatura
                                        nie trafialy na drugi, nieopisany odnosnik. */}
                                    <Link
                                        onClick={ClickHandler}
                                        to={`/porady/${bloge.slug}/`}
                                        className="karta_strzalka"
                                        aria-hidden="true"
                                        tabIndex={-1}
                                    >
                                        <i className="flaticon-right-arrow"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BlogSection;



