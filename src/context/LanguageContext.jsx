/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';
import { translations } from '../constants/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved === 'en' || saved === 'ta' ? saved : 'ta'; // Default to Tamil
    } catch {
      return 'ta';
    }
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ta') {
      setLanguageState(lang);
      try {
        localStorage.setItem('app_language', lang);
      } catch (err) {
        console.error('Failed to save language to localStorage:', err);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const t = (key, fallback = '') => {
    if (!key) return '';
    const localized = translations[language]?.[key];
    return localized !== undefined ? localized : (translations.en?.[key] || fallback || key);
  };

  const tField = (obj, fieldName) => {
    if (!obj) return '';
    if (language === 'ta') {
      const fieldTa = `${fieldName}_ta`;
      if (obj[fieldTa]) return obj[fieldTa];
    }
    return obj[fieldName] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, tField }}>
      {children}
    </LanguageContext.Provider>
  );
};
