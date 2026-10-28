import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import About from '../../components/about/about';
import ProcessSection from '../../components/ProcessSection/ProcessSection';
import FunFact from '../../components/FunFact/FunFact';
import TeamSection from '../../components/TeamSection/TeamSection';
import { ZESPOL_BIURA } from '../../api/team';
import ZespolSection from '../../components/ZespolSection/ZespolSection.jsx';
import WMediach from '../../components/WMediach/WMediach.jsx';
import FaqSection from '../../components/FaqSection/FaqSection.jsx';
import OpinieCta from '../../components/OpinieCta/OpinieCta.jsx';
import CtaSection from '../../components/CtaSection/CtaSection.jsx';
import BlogSection from '../../components/BlogSection/BlogSection';
import CtafromSection from '../../components/CtafromSection/CtafromSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'


const AboutPage = () => {
    return (
        <Fragment>
            <Navbar hclass={'dgc-site-header dgc-site-header-s2'} Logo={Logo} />
            <PageTitle pageTitle={'O nas'} pagesub={'O nas'} />
            <About hclass={'about_section section-padding s4'} />
            <ProcessSection hclass={"work_section_s2 section-padding"} />
            <FunFact hclass={'funfact_section'} />
            {/* Zespol tuz nad "Nadzorem merytorycznym" — obie sekcje mowia
                o ludziach, a przy samej gorze dwa zdjecia pod rzad (prezes
                i zespol) konkurowaly ze soba. */}
            <ZespolSection />
            {/* Ta sama kafelka i ten sam uklad co dotad — zmienila sie tylko
                zawartosc i to, ze trzy widoczne karty da sie przeciagnac,
                zeby pokazac pozostale trzy osoby. */}
            <TeamSection
                hclass={'team_section_s2 section-padding'}
                osoby={ZESPOL_BIURA}
                sliceEnd={ZESPOL_BIURA.length}
                title={'Zespół'}
                subtitle={'Poznaj osoby, z którymi pracujesz na co dzień'}
                suwak={true}
            />
            {/* Prosba o opinie kierowana do obecnych klientow, nad pytaniami. */}
            {/* Rozmowa prezes w radiu stoi po zespole i przed prosba o opinie:
                najpierw czytelnik poznaje ludzi, potem widzi ich na antenie,
                a dopiero wtedy prosimy go o cokolwiek. */}
            <WMediach />

            <OpinieCta />
            {/* Skrocony zestaw pytan — szesc najczestszych. Pelna lista
                zostaje na /faq, zeby podstrona "O nas" nie zrobila sie
                dluzsza od strony glownej. */}
            <FaqSection
                ile={6}
                title={'Pytania, które słyszymy najczęściej'}
            />
            {/* Ten sam pas co na stronie glownej. */}
            <CtaSection tClass={'cta_section'} />
            <BlogSection tClass={'blog_section section-padding'} />
            <CtafromSection hclass={'ctafrom_section'} />
            <Footer hclass={'dgc-site-footer'} />
            <Scrollbar />

        </Fragment>
    )
};
export default AboutPage;
