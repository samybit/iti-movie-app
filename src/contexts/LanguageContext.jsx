import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(localStorage.getItem('app-language') || 'en');

    const setLanguage = (newLang) => {
        localStorage.setItem('app-language', newLang);
        setLanguageState(newLang);
    };

    useEffect(() => {
        // Update the document language and text direction 
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);