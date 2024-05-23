import React, { useState } from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Settings from './Settings-builder.jsx';
import { LanguageProvider } from './LanguageContext.jsx';

function App() {
    const [currentPage, setCurrentPage] = useState('main');

    const handleSettingsClick = () => {
        setCurrentPage('settings');
    };

    const handleBackToMainClick = () => {
        setCurrentPage('main');
    };

    return (
        <LanguageProvider>
            <div>
                {currentPage === 'main' ? (
                    <>
                        <Header onSettingsClick={handleSettingsClick} />
                        <Main />
                    </>
                ) : (
                    <Settings onBackClick={handleBackToMainClick} />
                )}
            </div>
        </LanguageProvider>
    );
}

export default App;
