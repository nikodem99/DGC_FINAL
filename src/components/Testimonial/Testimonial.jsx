import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from '../../images/testimonial/1.jpg'
import Img2 from '../../images/testimonial/2.jpg'
import Img3 from '../../images/testimonial/3.jpg'
import SectionTitle from '../SectionTitle/SectionTitle';


const testimonials = [
    {
        id: '01',
        img: Img1,
        Des: "Purus egeto consectur massa amert. Hactor bodiam suspendie faucibus posuere dignissim amet to atthe. Vitaer of sollicitudin mauris erat odio maecenas mattis praesent.Eget vitaoe.",
        title: 'Kristin Watson',
        sub: "Content Writer",
    },
    {
        id: '02',
        img: Img2,
        Des: "Purus egeto consectur massa amert. Hactor bodiam suspendie faucibus posuere dignissim amet to atthe. Vitaer of sollicitudin mauris erat odio maecenas mattis praesent.Eget vitaoe.",
        title: 'Armani Fisher',
        sub: "Content Writer",
    },
    {
        id: '03',
        img: Img3,
        Des: "Purus egeto consectur massa amert. Hactor bodiam suspendie faucibus posuere dignissim amet to atthe. Vitaer of sollicitudin mauris erat odio maecenas mattis praesent.Eget vitaoe.",
        title: 'Rebeca Connelly',
        sub: "Content Writer",
    },


]




const Testimonial = (props) => {

    const settings = {
        dots: false,
        autoplay: true,
        infinite: true,
        arrows: false,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                }
            },

        ]
    };


    return (

        <section className={"" + props.tClass}>
            <div className="container">
                <div className="row justify-content-left">
                    <div className="col-12">
                        <SectionTitle title='Testimonial' subtitle="Our Patients Say About Us" />
                    </div>
                </div>
                <div className="row testimonial_slider">
                    <Slider {...settings}>
                        {testimonials.map((testitem, titem) => (
                            <div className="testimonial_card" key={titem}>
                                <div className="icon">
                                    <i className="flaticon-quote"></i>
                                </div>
                                <ul>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                    <li><i className="flaticon-star"></i></li>
                                </ul>
                                <p>{testitem.Des}</p>
                                <div className="ath">
                                    <div className="image">
                                        <img src={testitem.img} alt="" />
                                    </div>
                                    <div className="text">
                                        <h3>{testitem.title}</h3>
                                        <span>{testitem.sub}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default Testimonial;







