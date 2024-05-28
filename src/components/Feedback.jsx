import React, { useState, useEffect, forwardRef } from 'react';
import './styles/Feedback.css';

function Feedback({ onSubmit }, ref) {
    const [selectedRating, setSelectedRating] = useState(null);
    const [additionalFeedback, setAdditionalFeedback] = useState('');
    const [suggestedFeedback, setSuggestedFeedback] = useState([]);

    const ratings = [
        { value: 1, label: 'Terrible', emoji: '😠' },
        { value: 2, label: 'Bad', emoji: '😞' },
        { value: 3, label: 'Okay', emoji: '😐' },
        { value: 4, label: 'Good', emoji: '😊' },
        { value: 5, label: 'Great', emoji: '😁' },
    ];

    const suggestions = [
        "Missing data",
        "Incorrect data",
        "Troubles with autofill",
        "Very helpful",
        "Simple to use"
    ];

    const handleRatingClick = (value) => {
        setSelectedRating(value);
    };

    const handleSuggestionClick = (text) => {
        setSuggestedFeedback((prev) => {
            if (prev.includes(text)) {
                return prev.filter((item) => item !== text);
            } else {
                return [...prev, text];
            }
        });
    };

    useEffect(() => {
        setAdditionalFeedback(suggestedFeedback.join(", "));
    }, [suggestedFeedback]);

    const handleSubmit = () => {
        if (selectedRating !== null) {
            onSubmit({ rating: selectedRating, feedback: additionalFeedback });
        }
    };

    return (
        <div className="feedback-container" ref={ref}>
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
                <label htmlFor="feedback-text">What are the main reasons for your rating?</label>
                <input
                    type="text"
                    id="feedback-text"
                    placeholder="Optional"
                    value={additionalFeedback}
                    onChange={(e) => setAdditionalFeedback(e.target.value)}
                />
            </div>
            <div className="suggestions">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        className={`suggestion-button ${suggestedFeedback.includes(suggestion) ? 'selected' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
            <button className="submit-button" disabled={!selectedRating} onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default forwardRef(Feedback);
