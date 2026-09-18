import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/hero/hero';
import AppointmentSection from '../../components/AppointmentSection/AppointmentSection';
import ServiceSection2 from '../../components/ServiceSection2/ServiceSection2';
import About from '../../components/about/about';
import ProcessSection from '../../components/ProcessSection/ProcessSection';
import PricingSection from '../../components/PricingSection/PricingSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import CtaSection from '../../components/CtaSection/CtaSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import { ZESPOL_BIURA } from '../../api/team';
import FunFact from '../../components/FunFact/FunFact';
import BlogSection from '../../components/BlogSection/BlogSection';
import NewsletterSection from '../../components/Newsletter/NewsletterSection';
import CtafromSection from '../../components/CtafromSection/CtafromSection';
import PartnersCarousel from '../../components/PartnersCarousel/PartnersCarousel';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'

const HomePage = () => {
    return (
        <Fragment>
            <Navbar hclass={'wpo-site-header'}  Logo={Logo} />
            <Hero hclass={'static-hero'} />
            <AppointmentSection hclass={'appointment_section'}/>
            <ServiceSection2 hclass={'service_section_s2 section-padding'} />
            <About hclass={'about_section section-padding'}/>
            <PartnersCarousel />
            <ProcessSection hclass={"work_section section-padding"}/>
            <PricingSection hclass={'pricing_section section-padding'}/>
            <Testimonial tClass={'testimonial_section testimonial_section_slider'} />
            <CtaSection tClass={'cta_section'} />
            {/* Zespol biura zamiast nadzoru merytorycznego. Uklad bez zmian:
                trzy karty widoczne, reszta po przeciagnieciu. */}
            <TeamSection
                hclass={'team_section section-padding'}
                osoby={ZESPOL_BIURA}
                sliceEnd={ZESPOL_BIURA.length}
                title={'Zespół'}
                subtitle={'Poznaj osoby, z którymi pracujesz na co dzień'}
                suwak={true}
            />
            <FunFact hclass={'funfact_section'} />
            <BlogSection tClass={'blog_section section-padding'}/>
            {/* Newsletter tuz po poradach: kto doczytal do artykulow, ten
                chce dostawac kolejne. Nizej juz nie moze byc, bo
                ctafrom_section ma margin-bottom -180px i celowo wchodzi
                na stopke — musi zostac ostatnia. */}
            <NewsletterSection zrodlo="newsletter-home" />
            <CtafromSection hclass={'ctafrom_section'}/>
            <Footer hclass={'wpo-site-footer'}/>
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage;
