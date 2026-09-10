import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import About from '../../components/about/about';
import ProcessSection from '../../components/ProcessSection/ProcessSection';
import FunFact from '../../components/FunFact/FunFact';
import TeamSection from '../../components/TeamSection/TeamSection';
import ZespolSection from '../../components/ZespolSection/ZespolSection.jsx';
import FaqSection from '../../components/FaqSection/FaqSection.jsx';
import OpinieCta from '../../components/OpinieCta/OpinieCta.jsx';
import { FAQ_OGOLNE } from '../../api/faq';
import CtaSection from '../../components/CtaSection/CtaSection.jsx';
import LogoDGC from '../../images/logo.jpg';
import BlogSection from '../../components/BlogSection/BlogSection';
import CtafromSection from '../../components/CtafromSection/CtafromSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'


const AboutPage = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header wpo-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'O nas'} pagesub={'O nas'} />
            <About hclass={'about_section section-padding s4'} />
            <ProcessSection hclass={"work_section_s2 section-padding"} />
            <FunFact hclass={'funfact_section'} />
            {/* Zespol tuz nad "Nadzorem merytorycznym" — obie sekcje mowia
                o ludziach, a przy samej gorze dwa zdjecia pod rzad (prezes
                i zespol) konkurowaly ze soba. */}
            <ZespolSection />
            <TeamSection hclass={'team_section_s2 section-padding'} />
            {/* Prosba o opinie kierowana do obecnych klientow. Stoi NAD pytaniami,
                bo pas kontaktowy nizej ma zdjecie wystajace ~195px ponad swoj
                gorny brzeg — miedzy nimi musi zostac sekcja z wlasnym
                paddingiem, inaczej zdjecie wchodzi na blok. */}
            <OpinieCta />
            {/* Skrocony zestaw pytan — szesc najczestszych. Pelna lista
                zostaje na /faq, zeby podstrona "O nas" nie zrobila sie
                dluzsza od strony glownej. */}
            <FaqSection
                items={FAQ_OGOLNE.slice(0, 6)}
                title={'Pytania, które słyszymy najczęściej'}
            />
            {/* Ten sam pas co na stronie glownej, z tym samym znakiem DGC. */}
            <CtaSection tClass={'cta_section'} image={LogoDGC} />
            <BlogSection tClass={'blog_section section-padding'} />
            <CtafromSection hclass={'ctafrom_section'} />
            <Footer hclass={'wpo-site-footer'} />
            <Scrollbar />

        </Fragment>
    )
};
export default AboutPage;
