import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ml' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className="glass-card px-4 py-2 rounded-full font-bold text-sm text-wc-gold border-wc-gold/40 hover:bg-wc-gold/10 transition-colors flex items-center gap-2"
        title="Switch Language"
      >
        <span className={i18n.language === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
        <span className="text-wc-muted">/</span>
        <span className={i18n.language === 'ml' ? 'opacity-100' : 'opacity-50'}>മല</span>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
