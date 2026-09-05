import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
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


const AllRoute = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <DocumentTitle />
        {/* Baner musi siedziec w drzewie routera — uzywa <Link> do polityki
            prywatnosci, a poza routerem <Link> wywala cala aplikacje. */}
        <BanerZgod />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="home-2" element={<HomePage2 />} />
          <Route path="home-3" element={<HomePage3 />} />
          <Route path="about" element={<AboutPage />} />
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
          <Route path='blog' element={<BlogPage/>} />
          <Route path='blog-left-sidebar' element={<BlogPageLeft />} />
          <Route path='blog-fullwidth' element={<BlogPageFullwidth />} />
          <Route path='blog-single/:slug' element={<BlogDetails />} />
          <Route path='blog-single-left-sidebar/:slug' element={<BlogDetailsLeftSiide />} />
          <Route path='blog-single-fullwidth/:slug' element={<BlogDetailsFull />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='cennik' element={<PricingPage />} />
          {/* Podstrona spoza menu — prowadzi do niej przycisk z hero
              i docelowo reklamy. Indeksowalna, bo ma byc strona
              docelowa kampanii. */}
          <Route path='umow-konsultacje' element={<KonsultacjaPage />} />
          <Route path='polityka-prywatnosci' element={<PolitykaPrywatnosciPage />} />
          <Route path='404' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
