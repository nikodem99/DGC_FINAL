import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { uzyjWpisow } from '../../api/uzyjWpisow.js'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

// Kategorie i miesiace licza sie z wpisow, a nie sa wpisane recznie.
// Szablon mial tu siedem kategorii przychodni (Neurology, Urology, HIV/AIDS…)
// z liczbami wzietymi z sufitu — po dodaniu wpisu nikt by ich nie poprawil.
const policz = (blogs, klucz, etykieta) => Object.values(blogs.reduce((zebrane, blog) => {
    const wartosc = blog[klucz];
    if (!wartosc) return zebrane;

    if (!zebrane[wartosc]) {
        zebrane[wartosc] = { value: wartosc, label: etykieta(blog), count: 0 };
    }
    zebrane[wartosc].count += 1;
    return zebrane;
}, {}));

const BlogSidebar = (props) => {
    // Liczniki musza siedziec W komponencie, a nie na poziomie modulu.
    // Po dodaniu artykulu z panelu lista doczytuje sie z serwera i wtedy
    // liczby maja sie przeliczyc, a nie zostac z chwili budowania.
    const blogs = uzyjWpisow();
    const kategorie = policz(blogs, 'tag', (blog) => blog.tag);
    const miesiace = policz(blogs, 'archiveMonth', (blog) => blog.archiveLabel);

    // Trzy wpisy w pasku bocznym.
    //
    // Na liscie porad pokazujemy najnowsze. Na stronie artykulu dobieramy
    // z TEJ SAMEJ kategorii, i to nie trzy najnowsze, a trzy nastepne po
    // biezacym — z zawinieciem na poczatek kategorii.
    //
    // Dlaczego nie najnowsze trzy: wczesniej na wszystkich 377 stronach
    // wisialy te same trzy wpisy. Przy "trzech najnowszych w kategorii"
    // bylyby te same w obrebie kategorii, czyli 96 stron Plac wskazywaloby
    // jeden i ten sam artykul. Przesuwane okno daje kazdemu wpisowi inna
    // trojke, a kazdy artykul dostaje odnosniki z trzech innych stron.
    // Sasiedzi w kategorii sa tez zwykle z tego samego okresu, a w podatkach
    // to znaczy: z tych samych przepisow.
    //
    // Kolejnosc jest wyliczana, a nie losowa — ta sama zasada siedzi
    // w panelu (podobneHtml w panel-dgc/generator.php), zeby artykul
    // dodany z panelu mial dokladnie to samo, co przyslalby React.
    const polecane = (() => {
        if (!props.slug) return blogs.slice(0, 3);

        const biezacy = blogs.find((b) => b.slug === props.slug);
        if (!biezacy) return blogs.slice(0, 3);

        // Poprzedni i nastepny wpis stoja juz pod artykulem, w bloku
        // "Poprzedni / Nastepny wpis". Gdyby weszly tu drugi raz, ten sam
        // artykul widnialby na stronie dwa razy i jedno z trzech miejsc
        // w pasku bocznym przepadaloby. Przy ulozeniu wpisow zdarzalo sie
        // to na stu stronach z 377.
        const nr = blogs.indexOf(biezacy);
        const pominiete = new Set([blogs[nr - 1]?.slug, blogs[nr + 1]?.slug]);

        const wKategorii = blogs.filter((b) => b.tag === biezacy.tag);
        const start = wKategorii.findIndex((b) => b.slug === props.slug);

        const okno = [];
        for (let i = 1; i < wKategorii.length && okno.length < 3; i += 1) {
            const kandydat = wKategorii[(start + i) % wKategorii.length];
            if (!pominiete.has(kandydat.slug)) okno.push(kandydat);
        }
        if (okno.length === 3) return okno;

        // Kategoria liczy mniej niz cztery wpisy — dokladamy najnowszymi,
        // zeby blok nigdy nie byl krotszy ani pusty.
        const dolozone = blogs.filter((b) => b.slug !== props.slug && !okno.includes(b));
        return [...okno, ...dolozone].slice(0, 3);
    })();

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
                    <h3>{props.slug ? 'Podobne wpisy' : 'Ostatnie wpisy'}</h3>
                    <div className="posts">
                        {polecane.map((blog) => (
                            <div className="post" key={blog.id}>
                                <div className="img-holder">
                                    <img src={blog.screens} alt="" />
                                </div>
                                <div className="details">
                                    <h4><Link onClick={ClickHandler} to={`/porady/${blog.slug}/`}>{blog.title2 ?? blog.title}</Link></h4>
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
