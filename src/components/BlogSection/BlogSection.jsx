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
                                <div className="content">
                                    <ul>
                                        <li>{bloge.create_at}</li>
                                        <li>{bloge.author}</li>
                                    </ul>
                                    {/* Tytul zostaje zwyklym tekstem, a odnosnik siedzi
                                        na strzalce. Wyglada to na drobiazg, ale jest
                                        konieczne: h3 ma -webkit-line-clamp z overflow
                                        hidden dla wielokropka w dlugich tytulach, a to
                                        przycina takze warstwe klikalna ::after. Odnosnik
                                        wewnatrz h3 rozciagalby sie wiec tylko na tekst.
                                        Nazwe dla czytnikow ekranu daje aria-label, bo
                                        sama strzalka nic nie mowi. */}
                                    <h3>{bloge.title}</h3>
                                    <Link
                                        onClick={ClickHandler}
                                        to={`/porady/${bloge.slug}/`}
                                        className="karta_klik"
                                        aria-label={bloge.title}
                                    >
                                        <i className="flaticon-right-arrow" aria-hidden="true"></i>
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



