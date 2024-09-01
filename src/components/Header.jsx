import React, { useContext } from 'react';
import LanguageContext from './LanguageContext.jsx';
import './styles/Header.css';
import { FaHome, FaCog } from "react-icons/fa";

function Header({ currentPage, onSettingsClick, onHomeClick }) {
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
            <div className="header-actions">
                {currentPage === 'main' ? (
                     <FaCog className="header-icon" onClick={onSettingsClick} />
                ) : (
                    <FaHome className="header-icon" onClick={onHomeClick} />
                )}
            </div>
        </header>
    );
}

export default Header;
