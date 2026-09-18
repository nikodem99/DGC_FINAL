import React from 'react';
// StaticRouter bierzemy z "react-router-dom", a NIE z "react-router".
// Dwa powody: (1) w v7 sciezka "react-router-dom/server" zostala usunieta
// z pola exports, wiec stare przyklady nie dzialaja; (2) doinstalowanie
// osobnego pakietu "react-router" tworzy druga kopie modulu (mielismy
// 7.18.3 na wierzchu i 7.18.2 zagniezdzony w react-router-dom), przez co
// Routes i StaticRouter trafiaja do dwoch roznych kontekstow Reacta
// i build wywala sie na invariancie. Jeden import, jedna kopia.
import { BrowserRouter, StaticRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Homepage from '../HomePage/HomePage'
import HomePage2 from '../HomePage2/HomePage2';
import HomePage3 from '../HomePage3/HomePage3';
import AboutPage from '../AboutPage/AboutPage';
import TeamPage from '../TeamPage/TeamPage';
import TeamSinglePage from '../TeamSinglePage/TeamSinglePage';
import ShopPage from '../ShopPage'
import ProductSinglePage from '../ProductSinglePage';
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import OrderRecived from '../OrderRecived';
import FaqPage from '../FaqPage/FaqPage';
import ProjectPage from '../ProjectPage/ProjectPage';
import ProjectSingle from '../ProjectSingle/ProjectSingle';
import ServicePages from '../ServicePage/ServicePage';
import ServiceSinglePage from '../ServiceSinglePage/ServiceSinglePage';
import BlogPage from '../BlogPage/BlogPage'
import BlogPageLeft from '../BlogPageLeft/BlogPageLeft'
import BlogPageFullwidth from '../BlogPageFullwidth/BlogPageFullwidth'
import BlogDetails from '../BlogDetails/BlogDetails'
import BlogDetailsLeftSiide from '../BlogDetailsLeftSiide/BlogDetailsLeftSiide'
import BlogDetailsFull from '../BlogDetailsFull/BlogDetailsFull'
import ContactPage from '../ContactPage/ContactPage';
import PricingPage from '../PricingPage/PricingPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import DocumentTitle from '../../components/DocumentTitle/DocumentTitle';
import KonsultacjaPage from '../KonsultacjaPage/KonsultacjaPage';
import PolitykaPrywatnosciPage from '../PolitykaPrywatnosciPage/PolitykaPrywatnosciPage';
import BanerZgod from '../../components/Zgody/BanerZgod';


// Przenosi /blog-single/<slug> na /porady/<slug> zachowujac nazwe artykulu.
const PrzeniesArtykul = () => {
  const { slug } = useParams();
  return <Navigate to={`/porady/${slug}/`} replace />;
};

// Przy prerenderowaniu dostajemy sciezke w propsie i montujemy StaticRouter,
// bo BrowserRouter potrzebuje window.history, ktorego w Node nie ma.
const AllRoute = ({ sciezka }) => {
  const Router = sciezka ? StaticRouter : BrowserRouter;
  const propsRoutera = sciezka ? { location: sciezka } : {};

  return (
    <div className="App">
      <Router {...propsRoutera}>
        <DocumentTitle />
        {/* Baner musi siedziec w drzewie routera — uzywa <Link> do polityki
            prywatnosci, a poza routerem <Link> wywala cala aplikacje. */}
        <BanerZgod />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="home-2" element={<HomePage2 />} />
          <Route path="home-3" element={<HomePage3 />} />
          <Route path="o-nas" element={<AboutPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="team-single/:slug" element={<TeamSinglePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path='shop-single/:slug' element={<ProductSinglePage />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='order_received' element={<OrderRecived />} />
          <Route path="faq" element={<FaqPage/>} />
          <Route path="services" element={<ServicePages/>} />
          <Route path="service-single/:slug" element={<ServiceSinglePage />} />
          <Route path="oferta" element={<ServicePages/>} />
          <Route path="oferta/:slug" element={<ServiceSinglePage />} />
          <Route path="project" element={<ProjectPage/>} />
          <Route path="project-single/:slug" element={<ProjectSingle />} />
          <Route path='porady' element={<BlogPage/>} />
          <Route path='blog-left-sidebar' element={<BlogPageLeft />} />
          <Route path='blog-fullwidth' element={<BlogPageFullwidth />} />
          <Route path='porady/:slug' element={<BlogDetails />} />
          <Route path='blog-single-left-sidebar/:slug' element={<BlogDetailsLeftSiide />} />
          <Route path='blog-single-fullwidth/:slug' element={<BlogDetailsFull />} />
          <Route path='kontakt' element={<ContactPage />} />
          <Route path='cennik' element={<PricingPage />} />
          {/* Podstrona spoza menu — prowadzi do niej przycisk z hero
              i docelowo reklamy. Indeksowalna, bo ma byc strona
              docelowa kampanii. */}
          <Route path='umow-konsultacje' element={<KonsultacjaPage />} />
          <Route path='polityka-prywatnosci' element={<PolitykaPrywatnosciPage />} />
          {/* Stare adresy z czasu budowy serwisu. Serwer robi na nie 301
              (public/_redirects), ale gdyby ktos trafil tu nawigacja
              wewnatrz aplikacji, ma zostac przeniesiony, a nie zobaczyc 404. */}
          <Route path="about" element={<Navigate to="/o-nas/" replace />} />
          <Route path="contact" element={<Navigate to="/kontakt/" replace />} />
          <Route path="blog" element={<Navigate to="/porady/" replace />} />
          <Route path="blog-single/:slug" element={<PrzeniesArtykul />} />

          <Route path='404' element={<ErrorPage />} />
        </Routes>
      </Router>

    </div>
  );
}

export default AllRoute;
