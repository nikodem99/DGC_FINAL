import React from 'react';
import CountUp from 'react-countup';

const FunFact = (props) => {

    return (
        <section className={"" + props.hclass} >
            <div className="container">
                <div className="row">
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-medall-alt"></i>
                            <h3><CountUp end={15} enableScrollSpy /></h3>
                            <p>Lat na rynku</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-user"></i>
                            <h3><CountUp end={10} enableScrollSpy /></h3>
                            <p>Form prawnych w obsłudze</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-cup"></i>
                            <h3><CountUp end={4} enableScrollSpy /></h3>
                            <p>Organizacje branżowe</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-headphone-alt"></i>
                            <h3><CountUp end={100} enableScrollSpy />%</h3>
                            <p>Zdalnej obsługi kadr i płac</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default FunFact;