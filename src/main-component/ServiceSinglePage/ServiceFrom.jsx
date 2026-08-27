import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        doctor: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({
        nameError: '',
        emailError: '',
        departmentError: '',
        doctorError: '',
        messageError: ''
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            nameError: '',
            emailError: '',
            departmentError: '',
            doctorError: '',
            messageError: ''
        };

        if (formData.name.trim() === '') {
            errors.nameError = 'Please enter your name';
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            errors.emailError = 'Please enter a valid email';
            isValid = false;
        }

        if (formData.department.trim() === '') {
            errors.departmentError = 'Please select a department';
            isValid = false;
        }

        if (formData.doctor.trim() === '') {
            errors.doctorError = 'Please choose a doctor';
            isValid = false;
        }

        if (formData.message.trim() === '') {
            errors.messageError = 'Please describe your problem';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            // Handle form submission logic here
            console.log('Form submitted:', formData);
            // Reset form after submission if needed
            setFormData({
                name: '',
                email: '',
                department: '',
                doctor: '',
                message: ''
            });
        }
    };

    return (
        <form id="myForm" onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label>Your Name</label>
                    <input
                        className="input-fild"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                    <span className="error">{formErrors.nameError}</span>
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label>Your Email</label>
                    <input
                        className="input-fild"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                    />
                    <span className="error">{formErrors.emailError}</span>
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label>Select Department</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-fild"
                    >
                        <option value="">Department</option>
                        <option value="Subject 1">Subject 1</option>
                        <option value="Subject 2">Subject 2</option>
                        <option value="Subject 3">Subject 3</option>
                    </select>
                    <span className="error">{formErrors.departmentError}</span>
                </div>
                <div className="col-lg-6 col-md-6 col-12 form_item">
                    <label>Choose Doctor</label>
                    <select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleInputChange}
                        className="input-fild"
                    >
                        <option value="">Choose Doctor</option>
                        <option value="Doctor 1">Doctor 1</option>
                        <option value="Doctor 2">Doctor 2</option>
                        <option value="Doctor 3">Doctor 3</option>
                    </select>
                    <span className="error">{formErrors.doctorError}</span>
                </div>
                <div className="col-12 form_item">
                    <label>Say Details About Your Problem</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="input-fild"
                        placeholder="Message.."
                    ></textarea>
                    <span className="error s2">{formErrors.messageError}</span>
                </div>
                <div className="col-12">
                    <input type="submit" className="theme-btn" value="Send Message" />
                </div>
            </div>
        </form>
    );
};

export default ContactForm;
