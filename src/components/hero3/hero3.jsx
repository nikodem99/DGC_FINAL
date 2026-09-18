import { Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom'
import VideoModal from "../ModalVideo/VideoModal";


/* images */
import Slider1 from '../../images/slider/slide-1.jpg'
import Slider2 from '../../images/slider/slide-2.jpg'
import Slider3 from '../../images/slider/slide-3.jpg'

const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
};
const Hero3 = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <section className="hero-slider">
            <Swiper
                // install Swiper modules
                modules={[Pagination, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={1800}
                pagination={pagination}
                parallax={true}
            >
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${Slider1})` }}>
                        <div className="container-fluid">
                            <div className="slide-content">
                                <div className="slide-title">
                                    <h2>Your Smile & Happiness is Our Mission</h2>
                                </div>
                                <div className="slide-btns">
                                    <Link onClick={ClickHandler} to="/o-nas/" className="theme-btn-s2">Make Appointment <i
                                        className="flaticon-right-arrow"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="video">
                            <VideoModal />
                        </div>
                        <div className="shape">
                            <svg viewBox="0 0 1921 1037" fill="none">
                                <path
                                    d="M327.5 772L0.5 719.5V1037H1921V0L1915.5 181L1905 550.5L1900 717L1897 810.5C1897 821.7 1895.67 831.167 1895 834.5C1892.2 870.1 1871.5 905 1861.5 918C1841.9 944 1817 960.833 1807 966C1780.6 982 1750 988 1738 989C1713.2 991.8 1691.33 988.833 1683.5 987L1635.5 979.5L1269 921L799 847L327.5 772Z"
                                    fill="white" />
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${Slider2})` }}>
                        <div className="container-fluid">
                            <div className="slide-content">
                                <div className="slide-title">
                                    <h2>Your Smile & Happiness is Our Mission</h2>
                                </div>
                                <div className="slide-btns">
                                    <Link onClick={ClickHandler} to="/o-nas/" className="theme-btn-s2">Make Appointment <i
                                        className="flaticon-right-arrow"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="video">
                            <VideoModal />
                        </div>
                        <div className="shape">
                            <svg viewBox="0 0 1921 1037" fill="none">
                                <path
                                    d="M327.5 772L0.5 719.5V1037H1921V0L1915.5 181L1905 550.5L1900 717L1897 810.5C1897 821.7 1895.67 831.167 1895 834.5C1892.2 870.1 1871.5 905 1861.5 918C1841.9 944 1817 960.833 1807 966C1780.6 982 1750 988 1738 989C1713.2 991.8 1691.33 988.833 1683.5 987L1635.5 979.5L1269 921L799 847L327.5 772Z"
                                    fill="white" />
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${Slider3})` }}>
                        <div className="container-fluid">
                            <div className="slide-content">
                                <div className="slide-title">
                                    <h2>Your Smile & Happiness is Our Mission</h2>
                                </div>
                                <div className="slide-btns">
                                    <Link onClick={ClickHandler} to="/o-nas/" className="theme-btn-s2">Make Appointment <i
                                        className="flaticon-right-arrow"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="video">
                            <VideoModal />
                        </div>
                        <div className="shape">
                            <svg viewBox="0 0 1921 1037" fill="none">
                                <path
                                    d="M327.5 772L0.5 719.5V1037H1921V0L1915.5 181L1905 550.5L1900 717L1897 810.5C1897 821.7 1895.67 831.167 1895 834.5C1892.2 870.1 1871.5 905 1861.5 918C1841.9 944 1817 960.833 1807 966C1780.6 982 1750 988 1738 989C1713.2 991.8 1691.33 988.833 1683.5 987L1635.5 979.5L1269 921L799 847L327.5 772Z"
                                    fill="white" />
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>


                ...
            </Swiper>
        </section>
    )
}

export default Hero3;

