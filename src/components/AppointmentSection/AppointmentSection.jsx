import React from 'react';
import AppointmentForm from './AppointmentForm';



const AppointmentSection = (props) => {
    return (
        <section className={"" + props.hclass} >
            <div className="container">
                <AppointmentForm/>
            </div>
        </section>
    );
};

export default AppointmentSection;