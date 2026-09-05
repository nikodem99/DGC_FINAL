import React from 'react';

const SectionTitle = ({ title, subtitle, subtitleId }) => {
    return (
        <div className="section_title">
            <h2>{title}</h2>
            <h3 id={subtitleId}>{subtitle}</h3>
        </div>
    );
};

export default SectionTitle;
