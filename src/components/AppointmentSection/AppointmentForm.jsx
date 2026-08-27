
import React, { useState } from 'react';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        doctor: '',
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        validate({ [name]: value });
    };

    const validate = (fieldValues = formData) => {
        let tempErrors = { ...errors };

        if ('name' in fieldValues)
            tempErrors.name = fieldValues.name ? '' : 'Name is required';
        if ('email' in fieldValues) {
            tempErrors.email = fieldValues.email ? '' : 'Email is required';
            if (fieldValues.email)
                tempErrors.email = /\S+@\S+\.\S+/.test(fieldValues.email)
                    ? ''
                    : 'Email address is invalid';
        }
        if ('department' in fieldValues)
            tempErrors.department = fieldValues.department
                ? ''
                : 'Department is required';
        if ('doctor' in fieldValues)
            tempErrors.doctor = fieldValues.doctor ? '' : 'Doctor is required';

        setErrors(tempErrors);

        if (fieldValues === formData)
            return Object.values(tempErrors).every((x) => x === '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(false);
        setSubmissionError(null);
        if (validate()) {
            setIsSubmitting(true);
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    setSubmitted(true);
                    setIsSubmitting(false);
                    handleReset();
                } else {
                    setSubmissionError('Submission failed. Please try again.');
                    setIsSubmitting(false);
                }
            }, 2000);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            department: '',
            doctor: '',
        });
        setErrors({});
        setSubmitted(false);
        setSubmissionError(null);
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="wrapper">
                <div className="form_item">
                    <label>Your Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form_control"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => validate({ name: formData.name })}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div className="form_item">
                    <label>Your Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form_control"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => validate({ email: formData.email })}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="form_item">
                    <label>Select Department</label>
                    <select
                        name="department"
                        className="form_control"
                        value={formData.department}
                        onChange={handleChange}
                        onBlur={() => validate({ department: formData.department })}
                    >
                        <option value="">Department</option>
                        <option value="subject1">Subject 1</option>
                        <option value="subject2">Subject 2</option>
                        <option value="subject3">Subject 3</option>
                    </select>
                    {errors.department && <p className="error">{errors.department}</p>}
                </div>
                <div className="form_item">
                    <label>Choose Doctor</label>
                    <select
                        name="doctor"
                        className="form_control"
                        value={formData.doctor}
                        onChange={handleChange}
                        onBlur={() => validate({ doctor: formData.doctor })}
                    >
                        <option value="">Doctor</option>
                        <option value="subject1">Subject 1</option>
                        <option value="subject2">Subject 2</option>
                        <option value="subject3">Subject 3</option>
                    </select>
                    {errors.doctor && <p className="error">{errors.doctor}</p>}
                </div>
                <div className="form_item">
                    <input className="form_btn" type="submit" value="Send" disabled={isSubmitting} />
                </div>
                {isSubmitting && <div className="loading_message">Submitting...</div>}
                {submitted && <div className="success_message">Form submitted successfully!</div>}
                {submissionError && <div className="error_message">{submissionError}</div>}
            </div>
        </form>
    );
};

export default AppointmentForm;