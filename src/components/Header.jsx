import React, { useContext } from 'react';
import LanguageContext from './LanguageContext.jsx';
import './styles/Header.css';

function Header({ onSettingsClick }) {
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <header className="header">
            <img src="./images/logo-text.png" alt="AutomoBot Logo" className="logo-text" />
            <div className="language-toggle">
                <span className={`language ${language === 'SLO' ? 'selected' : ''}`}>SLO</span>
                <div className="toggle" onClick={toggleLanguage}>
                    <div className={`thumb ${language === 'ENG' ? 'right' : 'left'}`}></div>
                </div>
                <span className={`language ${language === 'ENG' ? 'selected' : ''}`}>ENG</span>
            </div>
            <img src="./images/settings-icon.svg" alt="Settings Icon" className="settings-icon" onClick={onSettingsClick} />
        </header>
    );
};

export default Header;

