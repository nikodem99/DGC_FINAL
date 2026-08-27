import React, { useState } from 'react';

const CtaForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        company: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
  
    const validate = () => {
        let formIsValid = true;
        let errors = {};
        if (!formData.name) {
            formIsValid = false;
            errors.name = 'Name is requierd';
        }

        if (!formData.email) {
            formIsValid = false;
            errors.email = 'Email is requierd';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formIsValid = false;
            errors.email = "Email is invalid";
        }
   
        if (!formData.company) {
            formIsValid = false;
            errors.company = 'Company is required';
        }

        setErrors(errors);
        return formIsValid;

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted successfully:',);
        }
    };

    return (
        <form className="cta_form" onSubmit={handleSubmit}>
            <div className="input_filled">
                <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder="Your Name*" />
                {errors.name && <span className='error'>{errors.name}</span>}
            </div>
            <div className="input_filled">
                <input type="text" name="email" placeholder="Your Email*" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="input_filled">
                <input type="text" name="company" placeholder="Your Company*" value={formData.company} onChange={handleChange} />
                {errors.company && <span className="error">{errors.company}</span>}
            </div>
            <div className="input_filled">
                <button type="submit" >Free Consultancy</button>
            </div>
        </form>
    );
};

export default CtaForm;