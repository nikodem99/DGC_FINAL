import React, { useState } from 'react';

const accordionData = [
    {
        title: 'What types of cases does your firm handle?',
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime.'
    },
    {
        title: 'Before hiring a counsel, what kind of questions should I ask?',
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime.'
    },
    {
        title: 'Before hiring a counsel, what kind of questions should I ask?',
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime.'
    },
    {
        title: 'Before hiring a counsel, what kind of questions should I ask?',
        content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime.'
    }
];

const FaqSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    return (
        <section className="wpo-faq-section section-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8 offset-lg-2">
                        <div className="section_title">
                            <h3>Frequently Asked Questions</h3>
                        </div>
                    </div>
                    <div className="col-lg-8 offset-lg-2">
                        <div className="wpo-faq-wrap">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className="wpo-benefits-item">
                                        {accordionData.map((accordion, index) => (
                                            <div
                                                className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                                                key={index}
                                            >
                                                <h3 className="accordion-header">
                                                    <button onClick={() => handleToggle(index)}>
                                                        {accordion.title}
                                                    </button>
                                                </h3>
                                                {activeIndex === index && (
                                                    <div className="accordion-body">
                                                        <p>{accordion.content}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
