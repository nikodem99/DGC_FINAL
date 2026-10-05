import React from 'react';
import Licznik from '../Licznik/Licznik';

const FunFact = (props) => {

    return (
        <section className={"" + props.hclass} >
            <div className="container">
                <div className="row">
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-medall-alt"></i>
                            <h3><Licznik ile={15} /></h3>
                            <p>Lat na rynku</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-user"></i>
                            <h3><Licznik ile={10} /></h3>
                            <p>Form prawnych w obsłudze</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-cup"></i>
                            <h3><Licznik ile={4} /></h3>
                            <p>Organizacje branżowe</p>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="item">
                            <i className="ti-headphone-alt"></i>
                            <h3><Licznik ile={100} />%</h3>
                            <p>Zdalnej obsługi kadr i płac</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default FunFact;