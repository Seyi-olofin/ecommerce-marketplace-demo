import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Google Translate API key - you should get this from Google Cloud Console
const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || 'YOUR_GOOGLE_TRANSLATE_API_KEY';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => Promise<string>;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  supportedLanguages: Array<{code: string, name: string, nativeName: string}>;
  isTranslating: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Comprehensive list of all languages supported by Google Translate
const supportedLanguages = [
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan dili' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文 (简体)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
  { code: 'iw', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmong' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'jw', name: 'Javanese', nativeName: 'Basa Jawa' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'la', name: 'Latin', nativeName: 'Latina' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'mi', name: 'Maori', nativeName: 'Māori' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာစာ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'or', name: 'Odia (Oriya)', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'sm', name: 'Samoan', nativeName: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
  { code: 'sn', name: 'Shona', nativeName: 'Shona' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' }
];

// Fallback translations for common UI elements
const fallbackTranslations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    home: 'Home',
    cart: 'Cart',
    checkout: 'Checkout',
    search: 'Search',
    categories: 'Categories',
    products: 'Products',
    price: 'Price',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    quantity: 'Quantity',
    total: 'Total',
    shipping: 'Shipping',
    tax: 'Tax',
    subtotal: 'Subtotal',
    continueShopping: 'Continue Shopping',
    viewDetails: 'View Details',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    relatedProducts: 'Related Products',
    featuredProducts: 'Featured Products',
    topSelling: 'Top Selling',
    flashSale: 'Flash Sale',
    freeShipping: 'Free Shipping',
    securePayment: 'Secure Payment',
    easyReturns: 'Easy Returns',
    customerSupport: 'Customer Support',
    contactUs: 'Contact Us',
    aboutUs: 'About Us',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP Code',
    country: 'Country',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information'
  }
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedCache, setTranslatedCache] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Clear cache to force fresh translations
    setTranslatedCache({});
    // Force re-render by triggering translation state
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 100);
  };

  // Enhanced Google Translate API function with better error handling
  const translateText = async (text: string, targetLang: string = language): Promise<string> => {
    if (targetLang === 'en') return text; // No translation needed for English
    if (!text || text.trim() === '') return text; // Handle empty text

    // Check cache first
    if (translatedCache[targetLang]?.[text]) {
      return translatedCache[targetLang][text];
    }

    try {
      setIsTranslating(true);

      // Primary: Use free Google Translate endpoint (most reliable)
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);

      if (response.ok) {
        const data = await response.json();
        const translatedText = data[0]?.map((item: any[]) => item[0]).join('') || text;

        // Cache the translation
        setTranslatedCache(prev => ({
          ...prev,
          [targetLang]: {
            ...prev[targetLang],
            [text]: translatedText
          }
        }));

        return translatedText;
      }

      throw new Error(`Google Translate API error: ${response.status}`);
    } catch (error) {
      console.error('Primary translation error:', error);

      // Secondary fallback: Try backend Google Cloud Translation
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            target: targetLang,
            source: 'en'
          })
        });

        if (response.ok) {
          const data = await response.json();
          const translatedText = data.translatedText || text;

          // Cache the translation
          setTranslatedCache(prev => ({
            ...prev,
            [targetLang]: {
              ...prev[targetLang],
              [text]: translatedText
            }
          }));

          return translatedText;
        }
      } catch (backendError) {
        console.error('Backend translation also failed:', backendError);
      }

      // Final fallback to original text
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const t = async (key: string): Promise<string> => {
    // First check fallback translations
    const fallbackText = fallbackTranslations.en[key] || key;

    if (language === 'en') return fallbackText;

    // Check cache
    if (translatedCache[language]?.[key]) {
      return translatedCache[language][key];
    }

    // Try to translate
    try {
      const translated = await translateText(fallbackText, language);
      // Ensure we return the translated text, not empty
      return translated && translated.trim() ? translated : fallbackText;
    } catch (error) {
      console.error('Translation failed for key:', key, error);
      // Fallback to English if translation fails
      return fallbackText;
    }
  };

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t,
      translateText,
      supportedLanguages,
      isTranslating
    }}>
      {children}
    </I18nContext.Provider>
  );
};