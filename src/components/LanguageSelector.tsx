import type { Language } from '../utils/translations';
import { speechService } from '../utils/speech';

type LanguageSelectorProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  voiceEnabled?: boolean;
};

export default function LanguageSelector({ language, onLanguageChange, voiceEnabled = false }: LanguageSelectorProps): JSX.Element {
  const handleLanguageChange = (newLanguage: Language) => {
    // Provide voice feedback if voice is enabled
    if (voiceEnabled && speechService.isSupported()) {
      const feedbackText = newLanguage === 'es' ? 'Español' : 'English';
      speechService.speak(feedbackText, newLanguage);
    }
    
    // Call the original onLanguageChange
    onLanguageChange(newLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md shadow-sm">
        <button
          onClick={() => handleLanguageChange('es')}
          className={`px-4 py-2 text-sm font-medium rounded-l-md border min-w-[80px] ${
            language === 'es'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          🇪🇸 Español
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b min-w-[80px] ${
            language === 'en'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          🇺🇸 English
        </button>
      </div>
    </div>
  );
} 