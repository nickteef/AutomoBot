import React, { useState } from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Settings from './Settings.jsx';
import { LanguageProvider } from './LanguageContext.jsx';

function App() {
    const [currentPage, setCurrentPage] = useState('main'); // Nastavi začetno stran na 'main'

    const handleSettingsClick = () => {
        setCurrentPage('settings');
    };

    const handleBackToMainClick = () => {
        setCurrentPage('main');
    };

    return (
        <LanguageProvider>
            <div>
                <Header 
                    currentPage={currentPage} 
                    onSettingsClick={handleSettingsClick} 
                    onHomeClick={handleBackToMainClick} 
                />
                {currentPage === 'main' ? (
                    <Main />
                ) : (
                    <Settings onBackClick={handleBackToMainClick} />
                )}
            </div>
        </LanguageProvider>
    );
}

export default App;
