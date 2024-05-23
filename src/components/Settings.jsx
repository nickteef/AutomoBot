import React from 'react';
import './styles/Settings.css';

const Settings = ({ onBackClick }) => {
    return (
        <div className="settings">
            <button onClick={onBackClick}>Back</button>
            <h1>Settings Page</h1>
            {/* Settings content */}
        </div>
    );
};

export default Settings;

