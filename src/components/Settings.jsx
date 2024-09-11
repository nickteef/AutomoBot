import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import LanguageModal from './modals/LanguageModal.jsx';
import AboutUsModal from './modals/AboutUsModal.jsx';
import PrivacyPolicyModal from './modals/PrivacyPolicyModal.jsx';
import TermsConditionsModal from './modals/TermsConditionsModal.jsx';
import './styles/Settings.css'; 

function Settings({ onBackClick }) {
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showAboutUsModal, setShowAboutUsModal] = useState(false);
    const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
    const [showTermsConditionsModal, setShowTermsConditionsModal] = useState(false);

    const [incognitoMode, setIncognitoMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Initialize theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

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
                        <div className="settings-item" onClick={() => setShowLanguageModal(true)}>
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
                        <div className="settings-item" onClick={() => setShowAboutUsModal(true)}>
                            <span>About us</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={() => setShowPrivacyPolicyModal(true)}>
                            <span>Privacy policy</span>
                            <FaArrowRight className="settings-arrow" />
                        </div>
                        <div className="settings-item" onClick={() => setShowTermsConditionsModal(true)}>
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

            <LanguageModal show={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
            <AboutUsModal show={showAboutUsModal} onClose={() => setShowAboutUsModal(false)} />
            <PrivacyPolicyModal show={showPrivacyPolicyModal} onClose={() => setShowPrivacyPolicyModal(false)} />
            <TermsConditionsModal show={showTermsConditionsModal} onClose={() => setShowTermsConditionsModal(false)} />
        </div>
    );
}

export default Settings;
