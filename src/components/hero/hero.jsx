import React from 'react';
import { Link } from 'react-router-dom';
import VideoModal from '../ModalVideo/VideoModal';
import HeroWideo from '../HeroWideo/HeroWideo';

// image
import Hshape from '../../images/slider/shape.svg'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const hero = () => {
    return (
        <section className="hero_section">
            <div className="bg_shape">
                <svg viewBox="0 0 1920 1075" fill="none">
                    <path d="M0 0H1920V1000C1920 1000 1632 619 962 917C292 1215 0 1000 0 1000V0Z" fill="#EBFFFF" />
                </svg>
            </div>
            <div className="content">
                <h2>Biuro rachunkowe · Łódź · online</h2>
                <h3>Twoja księgowość
                    w dobrych rękach</h3>
                <p>Obsługujemy jednoosobowe działalności, spółki i organizacje z całej Polski.
                    W pełni online, bez dojazdów do biura, z ubezpieczeniem OC.
                    Prowadzimy księgi nieprzerwanie od 2011 roku.</p>
                <Link onClick={ClickHandler} className="theme-btn theme-btn-gold" to="/umow-konsultacje">Umów konsultację</Link>
            </div>
            <div className="image_content">
                <div className="video">
                    <VideoModal />
                </div>
                <div className="image">
                    {/* Zapetlony film zamiast statycznego zdjecia. Przycisk
                        "Obejrzyj film" obok otwiera pelna wersje z dzwiekiem
                        w modalu — dokladnie jak wczesniej. */}
                    <HeroWideo />
                    <div className="bg_shape_2">
                        <img src={Hshape} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default hero;