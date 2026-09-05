import React from 'react';
import { Link } from 'react-router-dom'
import offerMenu from '../../api/offerMenu'
import NewsletterForm from '../../components/Newsletter/NewsletterForm'

const ServiceSidebar = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="service_sidebar">
            <div className="services_widget widget">
                <h2>Oferta</h2>
                <ul>
                    {offerMenu.map((item) => (
                        <li key={item.link}>
                            <Link onClick={ClickHandler} to={item.link}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="newsletter_widget widget">
                <h2>Newsletter</h2>
                {/* Szablon obiecywal tu "Join 20,000 Sabscribers!" — wymyslona
                    liczba subskrybentow (i literowka). Zamiast tego mowimy,
                    co realnie przychodzi na skrzynke. */}
                <span>Napiszemy, gdy zmienią się przepisy dotyczące Twoich rozliczeń.</span>
                <NewsletterForm zrodlo="newsletter-oferta" />
            </div>
        </div>

    )
}

export default ServiceSidebar;
