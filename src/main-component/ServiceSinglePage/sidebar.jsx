import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import ins1 from '../../images/instagram/1.jpg'
import ins2 from '../../images/instagram/2.jpg'
import ins3 from '../../images/instagram/3.jpg'
import ins4 from '../../images/instagram/4.jpg'
import ins5 from '../../images/instagram/5.jpg'
import ins6 from '../../images/instagram/6.jpg'

const insData = [
    {
        id: 1,
        img: ins1,
    },
    {
        id: 2,
        img: ins2,
    },
    {
        id: 3,
        img: ins3,
    },
    {
        id: 4,
        img: ins4,
    },
    {
        id: 5,
        img: ins5,
    },
    {
        id: 6,
        img: ins6,
    },
]

const ServiceSidebar = (props) => {



    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [showError, setShowError] = useState(false);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        if (showError) {
            setShowError(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim() === '') {
            setShowError(true);
        } else {
            setShowError(false);
            console.log('Searching for:', searchTerm);
        }
    };









    return (
        <div className="service_sidebar">
            <div className="search_widget widget">
                <form className="searchForm" onSubmit={handleSubmit}>
                    <input
                        className="fild"
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search..."
                    />
                    <button type="submit">
                        <i className="flaticon-search"></i>
                    </button>
                </form>
                {showError && <p style={{ color: 'red' }}>Please enter a search term.</p>}
            </div>
            <div className="services_widget widget">
                <h2>Services</h2>
                <ul>
                    <li><Link onClick={ClickHandler} to="/services">Dental Care <span>2</span></Link></li>
                    <li><Link onClick={ClickHandler} to="/services">Orthopedic <span>5</span></Link></li>
                    <li><Link onClick={ClickHandler} to="/services">Pharmacology <span>3</span></Link></li>
                    <li><Link onClick={ClickHandler} to="/services">Genealogy <span>7</span></Link></li>
                    <li><Link onClick={ClickHandler} to="/services">Rehabilitation <span>8</span></Link></li>
                    <li><Link onClick={ClickHandler} to="/services">Heart Surgery <span>4</span></Link></li>
                </ul>
            </div>
            <div className="newsletter_widget widget">
                <h2>Newsletter</h2>
                <span>Join 20,000 Sabscribers!</span>
                <form className="emailForm" id="emailForm">
                    <input className="fild" type="email" name="email" id="email2"
                        placeholder="Email Address" />
                    <button type="submit">Sign Up</button>
                </form>
                <p>By signing up you agree to our Privacy Policy</p>
            </div>
            <div className="instagram_widget widget">
                <h2>Instagram</h2>
                <ul>
                    {insData.map((instag, iky) => (
                        <li key={iky}><img src={instag.img} alt="" /></li>
                    ))}
                </ul>
            </div>
        </div>

    )
}

export default ServiceSidebar;