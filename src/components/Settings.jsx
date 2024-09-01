import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './styles/Settings.css'; // Preverite, ali je pot pravilna

function Settings({ onBackClick }) {
    const [incognitoMode, setIncognitoMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleClick = (setting) => {
        // Tukaj lahko implementirate navigacijo glede na nastavitev
        // Na primer, z uporabo react-router:
        // history.push(`/settings/${setting}`);
        console.log(`Navigating to ${setting}`);
    };

    const toggleIncognitoMode = () => setIncognitoMode(prev => !prev);
    const toggleDarkMode = () => setDarkMode(prev => !prev);

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1 className="settings-title">Settings</h1>
            </header>
            <main className="settings-main">
                <section className="settings-section">
                    <h2 className="settings-section-title">App Settings</h2>
                    <div className="settings-content">
                        <div className="settings-item" onClick={() => handleClick('language')}>
                            <span>Language</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={() => handleClick('connection')}>
                            <span>Change the connection</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={toggleIncognitoMode}>
                            <span>Incognito mode</span>
                            <div className="settings-toggle">
                                <div className={`toggle-thumb ${incognitoMode ? 'on' : 'off'}`}></div>
                            </div>
                        </div>
                        <div className="settings-item" onClick={toggleDarkMode}>
                            <span>Dark mode</span>
                            <div className="settings-toggle">
                                <div className={`toggle-thumb ${darkMode ? 'on' : 'off'}`}></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="settings-section">
                    <h2 className="settings-section-title">More</h2>
                    <div className="settings-content">
                        <div className="settings-item" onClick={() => handleClick('about-us')}>
                            <span>About us</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={() => handleClick('privacy-policy')}>
                            <span>Privacy policy</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={() => handleClick('terms-conditions')}>
                            <span>Terms and conditions</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                    </div>
                </section>
                <div className="back-button-container" onClick={onBackClick}>
                    <img src="./images/back-arrow.svg" alt="Back" className="back-button-icon" />
                    <span className="back-button-text">Back</span>
                </div>
            </main>
        </div>
    );
}

export default Settings;
