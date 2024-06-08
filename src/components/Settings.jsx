import React from 'react';
import './styles/Settings.css';

function Settings({ onBackClick }) {
    return (
        <div className="settings">
            <header className="settings-header">
                <img src="./images/settings-icon.svg" alt="Settings Icon" className="settings-icon" />
                <h1>Settings</h1>
            </header>
            <main className="settings-content">
                <section className="settings-section">
                <h2>App Settings</h2>
                <div className="settings-item">Language</div>
                <div className="settings-item">Change the connection</div>
                <div className="settings-item">Incognito mode</div>
                <div className="settings-item">Dark mode</div>
                </section>
                <section className="settings-section">
                <h2>More</h2>
                <div className="settings-item">About us</div>
                <div className="settings-item">Privacy policy</div>
                <div className="settings-item">Terms and conditions</div>
                </section>
                <div>
                    <img src="./images/back-arrow.svg" alt="Back" className="back-button" onClick={onBackClick} />
                    Back
                </div>
            </main>
        </div>
    );
};

export default Settings;

