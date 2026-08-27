import React from 'react';
import AppointmentForm from './AppointmentForm';



const AppointmentSection = (props) => {
    return (
        <section className={"" + props.hclass} >
            <h1 className="d-none">title</h1>
            <div className="container">
                <AppointmentForm/>
            </div>
        </section>
    );
};

export default AppointmentSection;