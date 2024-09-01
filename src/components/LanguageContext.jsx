import React, { createContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ENG');

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'ENG' ? 'SLO' : 'ENG'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
