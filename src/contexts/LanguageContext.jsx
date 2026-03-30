import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '@/lib/translations';

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

    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);