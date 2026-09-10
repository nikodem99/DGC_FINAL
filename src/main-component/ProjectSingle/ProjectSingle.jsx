import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Projects from '../../api/projects';
import ContactForm from '../ServiceSinglePage/ServiceFrom';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import logo from '../../images/logo.svg'
import Psing1 from '../../images/project-single/img-1.jpg'
import Psing2 from '../../images/project-single/img-2.jpg'



const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const ProjectSingle = (props) => {
    const { slug } = useParams()
    const ProjectSingle = Projects.find(item => item.slug === slug)



    return (
        <Fragment>
            <Navbar Logo={logo} hclass={'wpo-site-header wpo-site-header-s2'} />
            <PageTitle pageTitle={ProjectSingle.title} pagesub={'Portfolio'} />
            <section className="project_single section-padding">
                <div className="container">
                    <img src={ProjectSingle.pSimg} alt="" />
                    <div className="row">
                        <div className="col-lg-7 col-12">
                            <h2>{ProjectSingle.title}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus dis posuere amet tincidunt
                                commodo, velit. Ipsum, hac nibh fermentum nisi, platea condimentum cursus velit dui. Massa
                                volutpat odio facilisis purus sit elementum. Non, sed velit dictum quam. Id risus pharetra
                                est, at rhoncus, nec ullamcorper tincidunt. Id aliquet duis sollicitudin diam, elit sit. Et
                                nisi in libero facilisis sed est. Elit curabitur amet risus bibendum. Posuere et eget orci,
                                tempor enim.Non, sed velit dictum quam. Id risus pharetra est, at rhoncus, nec ullamcorper
                                tincidunt.</p>
                            <p>Hac nibh fermentum nisi, platea condimentum cursus velit dui. Massa voluat odio facilisis
                                purus sit elementum. Non, sed velit dictum quam. Id risus pharetra est, at rhoncus, nec
                                ullamcorper tincidunt. Id aliquet duis sollicitudin diam, elit sit.</p>
                        </div>
                        <div className="col-lg-5 col-12">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Location :</th>
                                        <td>{ProjectSingle.location}</td>
                                    </tr>
                                    <tr>
                                        <th>Client :</th>
                                        <td>Robert William</td>
                                    </tr>
                                    <tr>
                                        <th>Surgeon:</th>
                                        <td>Harry Johnson</td>
                                    </tr>
                                    <tr>
                                        <th>Category :</th>
                                        <td>Surgery</td>
                                    </tr>
                                    <tr>
                                        <th>Tag :</th>
                                        <td>Pediatric, Pain</td>
                                    </tr>
                                    <tr>
                                        <th>Date :</th>
                                        <td>{ProjectSingle.date}</td>
                                    </tr>
                                    <tr>
                                        <th>Share :</th>
                                        <td>
                                            <ul>
                                                <li><Link to="#"><i className="flaticon-facebook-app-symbol"></i></Link></li>
                                                <li><Link to="#"><i className="flaticon-twitter"></i></Link></li>
                                                <li><Link to="#"><i className="flaticon-linkedin"></i></Link></li>
                                                <li><Link to="#"><i className="flaticon-instagram"></i></Link></li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="quote">
                        <h4>"Amazing looking theme and instantly turns your application into a great looking one. Really
                            shows that pro_ fissional built this theme up. Very happy with the way the theme looks ."</h4>
                        <p>Robert - <span>Yellow Theme</span></p>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12 strategies s2">
                            <h2>Our Strategies</h2>
                            <p>Massa volutpat odio facilisis purus sit elementum. Nonsed velit dictum quam. Id risus
                                pharetra est, at rhoncus, nec ullamcorper tincidunt. Id aliquet duis sollicitudin diam.</p>
                            <ul>
                                <li>Non saed velit dictum quam risus pharetra esta.</li>
                                <li>Id risus pharetra est, at rhoncus, nec ullamcorper tincidunt.</li>
                                <li>Hac nibh fermentum nisi, platea condimentum cursus.</li>
                                <li>Massa volutpat odio facilisis purus sit elementum.</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-12 strategies">
                            <h2>Our approach</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat suspendisse aenean tellus
                                augue morbi risus. Sit morbi vitae morbi sed urna sed purus. Orci facilisi eros sed
                                pellentesque. Risus id sed tortor sed scelerisque. Vestibulum elit elementum, magna id
                                viverra non, velit. Pretium, eros, porttitor fusce auctor. Phasellus scelerisque nibh
                                eleifend vel enim mauris purus. Rutrum vel sem adipiscing nisi vulputate molestie
                                scelerisque molestie ultrices.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <img src={Psing1} alt="" />
                        </div>
                        <div className="col-lg-6 col-12">
                            <img src={Psing2} alt="" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-12 strategies s3">
                            <h2>Received Goals</h2>
                            <p>Tristique donec pellentesque malesuada enim viverra. Aliquam tortor id fringilla in tincidunt
                                ipsum non molestie. Mattis vitae nulla in nulla habitant purus lacus nibh.</p>
                            <ul>
                                <li>Feugiat tincidunt arcu blandit et maecenas est. </li>
                                <li>Eget a in massa scelerisque ut etiam pharetra nascetur</li>
                                <li>Integer laoreet vive nunc aliquam commodo integer arcu.</li>
                                <li>Fermentum feugiat varius faucibus habitasse.</li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-12 strategies s3 ">
                            <h2>Result</h2>
                            <p>Nibh arcu enim amet pellentesque. Nisi quam enim re nec amet in. Leo pretium dolor sed erat
                                dignissim. Integer laoreet viverra nunc aliquam commodo integer arcu.</p>
                            <ul>
                                <li>Mattis vitae nulla in nulla habitant purus.</li>
                                <li>Amet nunc augue nisi consectetur ac laoreet elit vulputate.</li>
                                <li>Hac nibh fermentum platea condimentum cursus.</li>
                                <li>Massa volutpat odio facilisis purus sit elementum.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="related_project">
                        <h5>Related Portfolio</h5>
                        <div className="row">
                            {Projects.slice(0, 3).map((project, pitem) => (
                                <div className="col-lg-4 col-md-6 col-12" key={pitem}>
                                    <div className="project_card">
                                        <img src={project.pimg1} alt="" />
                                        <div className="text">
                                            <h2><Link onClick={ClickHandler} to={`/project-single/${project.slug}`}>{project.title}</Link></h2>
                                            <span>{project.subtitle}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
export default ProjectSingle;
