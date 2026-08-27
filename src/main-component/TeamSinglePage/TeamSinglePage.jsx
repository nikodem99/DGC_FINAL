import React, { Fragment } from 'react';
import {Link, useParams } from 'react-router-dom'
import Teams from '../../api/team';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import ContactForm from '../ServiceSinglePage/ServiceFrom';
import logo from '../../images/logo-2.svg'
import Arrow from '../../images/team-single/arrow.svg'


const progressData = [
    { label: 'Successful Surgery', value: 85 },
    { label: 'Satisfied Patients', value: 50 },
    { label: 'Infection Prevention', value: 95 },
    { label: 'Client Rating', value: 70 },
];



const TeamSinglePage = (props) => {

    const { slug } = useParams()
    const TeamSingles = Teams.find(item => item.slug === slug)

    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={TeamSingles.title} pagesub={'Doctor Single'} />
            <section className="team_single_page section-padding">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-6 col-12">
                            <div className="doctor_profile">
                                <img src={TeamSingles.Sime} alt="" />
                                <div className="content">
                                    <h3>{TeamSingles.title}</h3>
                                    <span>Professional Surgeon & Expert Doctor . Love to care People & solve their
                                        Problems</span>
                                    <ul>
                                        <li><Link to="#"><i className="flaticon-facebook-app-symbol"></i></Link></li>
                                        <li><Link to="#"><i className="flaticon-twitter"></i></Link></li>
                                        <li><Link to="#"><i className="flaticon-linkedin"></i></Link></li>
                                        <li><Link to="#"><i className="flaticon-instagram"></i></Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6  col-12">
                            <div className="doctor_info">
                                <h2>Personal Info</h2>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Position:</th>
                                            <td>Senior Surgeon</td>
                                        </tr>
                                        <tr>
                                            <th>Practice Area:</th>
                                            <td>Cardiothoracic Surgeon Specialist</td>
                                        </tr>
                                        <tr>
                                            <th>Experience:</th>
                                            <td>10 years, New York Urgent Medical Care.</td>
                                        </tr>
                                        <tr>
                                            <th>Address:</th>
                                            <td>6391 Elgin St. Celina, Delaware 10299</td>
                                        </tr>
                                        <tr>
                                            <th>Phone:</th>
                                            <td>(603) 555-0123</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>youremail@gmail.com</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="doctor_info s2">
                                <h2>Education</h2>
                                <ul>
                                    <li><img src={Arrow} alt="" />MBBS University of California
                                    </li>
                                    <li><img src={Arrow} alt="" />Medify Institute of Medicine
                                        Juzment School of Management,Cambridge</li>
                                    <li><img src={Arrow} alt="" />The Syntify High School Of New
                                        York</li>
                                    <li><img src={Arrow} alt="" />Education &Medical Admissions
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="experience_wrap">
                        <div className="top_content">
                            <h2>Personal Experience</h2>
                            <p>There are many variations of passages of Lorem Ipsum available, but the majority have
                                suffered alteration in some form, by injected humour, or randomised words which don’t look
                                even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be
                                sure there isn’t anything embarrassing hidden in the middle of text.</p>

                            <p>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as
                                necessary, making this the first true generator on the Internet. It uses a dictionary of
                                over 200 Latin words,</p>
                        </div>
                        <div className="skill_wrap">
                            <div className="skill">
                                <h2>Professional Skills</h2>
                                {progressData.map((item, index) => (
                                    <div className="progress_item" key={index}>
                                        <span>{item.label}</span>
                                        <div className="progres">
                                            <div className="progress-value" style={{ width: `${item.value}%` }}>
                                                <span>{item.value}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="achievements">
                                <h2>Achievements</h2>
                                <ul>
                                    <li><span>2018 - 2019 : </span>William Allan Award</li>
                                    <li><span>2020 - 2021 : </span>Top Medical Resigning Star Award </li>
                                    <li><span>2022 - 2023 : </span>Mother Philips Award</li>
                                    <li><span>2026 - 2025 : </span>Institute of Top Medication Award</li>
                                    <li><span>2017 - 2018 : </span>Harvard University Award</li>
                                    <li><span>2016 - 2017 : </span>Best Doctor Award</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="AppointmentFrom">
                    <div className="container">
                        <div className="cta_form_s2">
                            <div className="title s2">
                                <h3>Make An Appointment</h3>
                                <p>Get in touch with us to see how we can help you with your Problems.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
            <Footer hclass={'wpo-site-footer_s2'} />
            <Scrollbar />
        </Fragment>
    )
};
export default TeamSinglePage;
