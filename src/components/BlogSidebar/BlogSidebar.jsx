import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import blogs from '../../api/blogs'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

// Kategorie i miesiace licza sie z wpisow, a nie sa wpisane recznie.
// Szablon mial tu siedem kategorii przychodni (Neurology, Urology, HIV/AIDS…)
// z liczbami wzietymi z sufitu — po dodaniu wpisu nikt by ich nie poprawil.
const policz = (klucz, etykieta) => Object.values(blogs.reduce((zebrane, blog) => {
    const wartosc = blog[klucz];
    if (!wartosc) return zebrane;

    if (!zebrane[wartosc]) {
        zebrane[wartosc] = { value: wartosc, label: etykieta(blog), count: 0 };
    }
    zebrane[wartosc].count += 1;
    return zebrane;
}, {}));

const kategorie = policz('tag', (blog) => blog.tag);
const miesiace = policz('archiveMonth', (blog) => blog.archiveLabel);

const BlogSidebar = (props) => {
    const [lokalnyMiesiac, setLokalnyMiesiac] = useState('all');
    const selectedMonth = props.selectedMonth ?? lokalnyMiesiac;
    const wybranaKategoria = props.selectedCategory ?? 'all';

    const zmienMiesiac = (event) => {
        const miesiac = event.target.value;
        setLokalnyMiesiac(miesiac);
        props.onMonthChange?.(miesiac);
    };

    return (
        <div className={`col col-lg-4 col-12 ${props.blLeft}`}>
            <div className="blog-sidebar">
                <div className="widget category-widget">
                    <h3>Kategorie</h3>
                    <ul>
                        {/* Kategorie filtruja liste obok — tak samo jak wybor
                            miesiaca nizej. Wczesniej kazda prowadzila do tego
                            samego, nieistniejacego wpisu. */}
                        <li className={wybranaKategoria === 'all' ? 'aktywna' : undefined}>
                            <button type="button" onClick={() => props.onCategoryChange?.('all')}>
                                Wszystkie<span>{blogs.length}</span>
                            </button>
                        </li>
                        {kategorie.map((k) => (
                            <li key={k.value} className={wybranaKategoria === k.value ? 'aktywna' : undefined}>
                                <button type="button" onClick={() => props.onCategoryChange?.(k.value)}>
                                    {k.label}<span>{k.count}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="widget recent-post-widget">
                    <h3>Ostatnie wpisy</h3>
                    <div className="posts">
                        {blogs.slice(0, 3).map((blog) => (
                            <div className="post" key={blog.id}>
                                <div className="img-holder">
                                    <img src={blog.screens} alt="" />
                                </div>
                                <div className="details">
                                    <h4><Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.title2}</Link></h4>
                                    <span className="date">{blog.create_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="widget month-widget">
                    <h3>Miesiąc</h3>
                    <label className="visually-hidden" htmlFor="blog-month-filter">Wybierz miesiąc</label>
                    <div className="month-select-wrapper">
                        <select
                            id="blog-month-filter"
                            value={selectedMonth}
                            onChange={zmienMiesiac}
                        >
                            <option value="all">Wszystkie miesiące</option>
                            {miesiace.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.label} ({option.count})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BlogSidebar;
