import React, { useState } from 'react';
import './styles/Feedback.css';

const Feedback = ({ onSubmit }) => {
    const [selectedRating, setSelectedRating] = useState(null);
    const [additionalFeedback, setAdditionalFeedback] = useState('');

    const ratings = [
        { value: 1, label: 'Terrible', emoji: '😠' },
        { value: 2, label: 'Bad', emoji: '😞' },
        { value: 3, label: 'Okay', emoji: '😐' },
        { value: 4, label: 'Good', emoji: '😊' },
        { value: 5, label: 'Great', emoji: '😁' },
    ];

    const handleRatingClick = (value) => {
        setSelectedRating(value);
    };

    const handleSubmit = () => {
        if (selectedRating !== null) {
            onSubmit({ rating: selectedRating, feedback: additionalFeedback });
        }
    };

    return (
        <div className="feedback-container">
            <h2>How helpful was I? Let me know!</h2>
            <div className="ratings">
                {ratings.map((rating) => (
                    <div
                        key={rating.value}
                        className={`rating-box ${selectedRating === rating.value ? 'selected' : ''}`}
                        onClick={() => handleRatingClick(rating.value)}
                    >
                        <span className="emoji">{rating.emoji}</span>
                        <span>{rating.label}</span>
                    </div>
                ))}
            </div>
            <div className="additional-feedback">
                <label htmlFor="feedback">What are the main reasons for your rating?</label>
                <input
                    type="text"
                    id="feedback"
                    placeholder="Optional"
                    value={additionalFeedback}
                    onChange={(e) => setAdditionalFeedback(e.target.value)}
                />
            </div>
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            <div className="logo">
                <img src="path/to/automobot-logo.png" alt="AutomoBot Logo" />
            </div>
        </div>
    );
};

export default Feedback;
