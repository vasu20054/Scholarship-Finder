import React from 'react';

const ScholarshipCard = ({ scholarship }) => {
    return (
        <div className="scholarship-card">
            <h3 className="scholarship-title">{scholarship.title}</h3>
            <p className="scholarship-provider">By: {scholarship.provider}</p>
            <div className="scholarship-details">
                <p><strong>Amount:</strong> ${scholarship.amount}</p>
                <p><strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}</p>
                <p><strong>CGPI Criteria:</strong> {scholarship.cgpiCriteria}</p>
                <p><strong>Location:</strong> {scholarship.location}</p>
                <p><strong>Specialisation:</strong> {scholarship.specialisation}</p>
            </div>
        </div>
    );
};

export default ScholarshipCard;