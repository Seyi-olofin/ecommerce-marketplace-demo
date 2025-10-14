import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Currency conversion API - ExchangeRate-API (free tier, supports NGN)
const CURRENCY_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

interface CurrencyContextType {
  currency: string;
  setCurrency: (curr: string) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => Promise<number>;
  supportedCurrencies: Array<{code: string, name: string, symbol: string, locale: string}>;
  exchangeRates: Record<string, number>;
  isConverting: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Comprehensive list of world currencies
const supportedCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-US' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', locale: 'en-KE' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'zh-HK' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'no-NO' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', locale: 'tr-TR' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', locale: 'ru-RU' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'hi-IN' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', locale: 'es-AR' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', locale: 'es-CL' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', locale: 'es-CO' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', locale: 'es-PE' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$', locale: 'es-UY' },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', locale: 'es-PY' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', locale: 'es-BO' },
  { code: 'VEF', name: 'Venezuelan Bolivar', symbol: 'Bs.', locale: 'es-VE' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', locale: 'ar-EG' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', locale: 'ar-MA' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', locale: 'ar-TN' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', locale: 'ar-DZ' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', locale: 'ar-LY' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: '£', locale: 'ar-SD' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: '£', locale: 'en-SS' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', locale: 'am-ET' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', locale: 'sw-TZ' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', locale: 'en-UG' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', locale: 'rw-RW' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', locale: 'rn-BI' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', locale: 'fr-CD' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', locale: 'fr-CM' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', locale: 'fr-SN' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', locale: 'en-GH' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: '$', locale: 'en-KN' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: '$', locale: 'en-BS' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: '$', locale: 'en-BB' },
  { code: 'BZD', name: 'Belize Dollar', symbol: '$', locale: 'en-BZ' },
  { code: 'BND', name: 'Brunei Dollar', symbol: '$', locale: 'ms-BN' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: '$', locale: 'en-FJ' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: '$', locale: 'en-GY' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: '$', locale: 'en-JM' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: '$', locale: 'en-LR' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: '$', locale: 'en-NA' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$', locale: 'en-SB' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', locale: 'nl-SR' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: '$', locale: 'en-TT' },
  { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$', locale: 'en-TV' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT', locale: 'en-VU' },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$', locale: 'en-WS' },
  { code: 'TOP', name: 'Tongan Pa\'anga', symbol: 'T$', locale: 'to-TO' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', locale: 'en-PG' },
  { code: 'SHP', name: 'Saint Helena Pound', symbol: '£', locale: 'en-SH' },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£', locale: 'en-FK' },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: '£', locale: 'en-GI' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', locale: 'nl-CW' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', locale: 'nl-AW' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: '$', locale: 'en-BM' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.', locale: 'dz-BT' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', locale: 'pt-CV' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', locale: 'fr-DJ' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', locale: 'ti-ER' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', locale: 'ka-GE' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', locale: 'en-GM' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', locale: 'fr-GN' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', locale: 'ht-HT' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', locale: 'hu-HU' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', locale: 'id-ID' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', locale: 'he-IL' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', locale: 'ar-IQ' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', locale: 'fa-IR' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', locale: 'is-IS' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', locale: 'ar-JO' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с', locale: 'ky-KG' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', locale: 'km-KH' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', locale: 'ar-KM' },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩', locale: 'ko-KP' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', locale: 'ar-KW' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', locale: 'kk-KZ' },
  { code: 'LAK', name: 'Laotian Kip', symbol: '₭', locale: 'lo-LA' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: '£', locale: 'ar-LB' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', locale: 'si-LK' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', locale: 'en-LS' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', locale: 'ro-MD' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', locale: 'mg-MG' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', locale: 'mk-MK' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', locale: 'my-MM' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', locale: 'mn-MN' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', locale: 'zh-MO' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', locale: 'ar-MR' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', locale: 'en-MU' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', locale: 'dv-MV' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', locale: 'en-MW' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', locale: 'pt-MZ' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', locale: 'es-NI' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨', locale: 'ne-NP' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', locale: 'ar-OM' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', locale: 'es-PA' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', locale: 'ur-PK' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', locale: 'pl-PL' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', locale: 'ar-QA' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', locale: 'ro-RO' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин.', locale: 'sr-RS' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', locale: 'ar-SA' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', locale: 'en-SC' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', locale: 'en-SL' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh', locale: 'so-SO' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', locale: 'en-SZ' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', locale: 'th-TH' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ', locale: 'tg-TJ' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', locale: 'tk-TM' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', locale: 'zh-TW' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', locale: 'sw-TZ' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', locale: 'uk-UA' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m', locale: 'uz-UZ' },
  { code: 'VES', name: 'Venezuelan Bolívar Soberano', symbol: 'Bs.', locale: 'es-VE' },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: '₫', locale: 'vi-VN' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣', locale: 'fr-PF' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', locale: 'ar-YE' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', locale: 'en-ZM' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: '$', locale: 'en-ZW' }
];

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('currency');
    if (stored) {
      setCurrencyState(stored);
    }

    // Fetch exchange rates on mount
    fetchExchangeRates();

    // Set up real-time updates every 60 seconds
    const interval = setInterval(fetchExchangeRates, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      // Use ExchangeRate-API as primary API (free, supports NGN)
      const response = await fetch(`${CURRENCY_API_BASE}/USD`);
      if (response.ok) {
        const data = await response.json();
        setExchangeRates(data.rates || {});
        console.log('Exchange rates updated:', data.rates);
        return;
      }

      throw new Error('ExchangeRate-API failed');
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback to static rates if API fails
      setExchangeRates({
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 150,
        NGN: 1650,
        KES: 130,
        ZAR: 18.5,
        CAD: 1.35,
        AUD: 1.52,
        CHF: 0.91,
        CNY: 7.25,
        SEK: 10.8,
        NZD: 1.68,
        MXN: 20.0,
        SGD: 1.35,
        HKD: 7.82,
        NOK: 10.9,
        KRW: 1380,
        TRY: 34.5,
        RUB: 95.0,
        INR: 84.0,
        BRL: 5.45,
        ARS: 950,
        CLP: 950,
        COP: 4100,
        PEN: 3.75,
        UYU: 41.5,
        PYG: 7800,
        BOB: 6.9,
        VEF: 3800000,
        EGP: 48.5,
        MAD: 10.1,
        TND: 3.15,
        DZD: 135,
        LYD: 4.85,
        SDG: 600,
        SSP: 130,
        ETB: 120,
        UGX: 3700,
        RWF: 1300,
        BIF: 2900,
        CDF: 2850,
        XAF: 600,
        XOF: 600,
        GHS: 15.5,
        XCD: 2.7,
        BSD: 1,
        BBD: 2,
        BZD: 2,
        BND: 1.35,
        FJD: 2.3,
        GYD: 210,
        JMD: 155,
        LRD: 175,
        NAD: 18.5,
        SBD: 8.5,
        SRD: 38,
        TTD: 6.8,
        TVD: 1.9,
        VUV: 120,
        WST: 2.8,
        TOP: 2.4,
        PGK: 3.9,
        SHP: 0.8,
        FKP: 0.8,
        GIP: 0.8,
        ANG: 1.8,
        AWG: 1.8,
        BMD: 1,
        BTN: 84,
        CVE: 100,
        DJF: 178,
        ERN: 15,
        GEL: 2.7,
        GMD: 70,
        GNF: 8600,
        HTG: 130,
        HUF: 380,
        IDR: 15600,
        ILS: 3.7,
        IQD: 1310,
        IRR: 42000,
        ISK: 138,
        JOD: 0.71,
        KGS: 89,
        KHR: 4100,
        KMF: 450,
        KPW: 900,
        KWD: 0.31,
        KZT: 480,
        LAK: 22000,
        LBP: 15000,
        LKR: 310,
        LSL: 18.5,
        MDL: 18,
        MGA: 5000,
        MKD: 61.5,
        MMK: 2100,
        MNT: 3450,
        MOP: 8.1,
        MRU: 39.5,
        MUR: 46,
        MVR: 15.5,
        MWK: 1740,
        MZN: 64,
        NIO: 36.5,
        NPR: 134,
        OMR: 0.385,
        PAB: 1,
        PKR: 278,
        PLN: 4.1,
        QAR: 3.65,
        RON: 4.65,
        RSD: 117,
        SAR: 3.75,
        SCR: 14,
        SLL: 22500,
        SOS: 570,
        SZL: 18.5,
        THB: 36.5,
        TJS: 11.3,
        TMT: 3.5,
        TWD: 32.5,
        UAH: 41,
        UZS: 12800,
        VES: 38,
        VND: 25400,
        XPF: 110,
        YER: 250,
        ZMW: 26.5,
        ZWL: 322
      });
    }
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
    // Trigger a re-render by updating exchange rates to force price recalculation
    fetchExchangeRates();
    // Force component re-render
    setIsConverting(true);
    setTimeout(() => setIsConverting(false), 100);
  };

  const convertPrice = async (price: number, fromCurrency: string = 'USD'): Promise<number> => {
    if (fromCurrency === currency) return price;

    try {
      setIsConverting(true);

      // If we don't have rates, fetch them
      if (Object.keys(exchangeRates).length === 0) {
        await fetchExchangeRates();
      }

      // Frankfurter API format: rates show how many units of target currency = 1 USD
      // So USD: 1, EUR: 0.85 means 1 USD = 0.85 EUR

      if (fromCurrency === 'USD') {
        // Converting from USD to target currency
        const rate = exchangeRates[currency] || 1;
        return price * rate;
      } else if (currency === 'USD') {
        // Converting from target currency to USD
        const rate = exchangeRates[fromCurrency] || 1;
        return price / rate;
      } else {
        // Converting between two non-USD currencies
        const fromRate = exchangeRates[fromCurrency] || 1;
        const toRate = exchangeRates[currency] || 1;
        // First convert to USD, then to target currency
        const usdAmount = price / fromRate;
        return usdAmount * toRate;
      }
    } catch (error) {
      console.error('Currency conversion error:', error);
      return price; // Return original price on error
    } finally {
      setIsConverting(false);
    }
  };

  const formatPrice = (price: number): string => {
    // Handle invalid prices
    if (!price || isNaN(price) || !isFinite(price)) {
      return '$0.00';
    }

    // Cap extremely large prices to prevent display issues
    const cappedPrice = Math.min(price, 999999999.99);

    const curr = supportedCurrencies.find(c => c.code === currency);
    if (!curr) return `$${cappedPrice.toFixed(2)}`;

    try {
      // Use synchronous conversion for formatting
      const rate = exchangeRates[currency] || 1;
      const convertedPrice = cappedPrice * rate;

      return new Intl.NumberFormat(curr.locale, {
        style: 'currency',
        currency: currency,
      }).format(convertedPrice);
    } catch {
      return `${curr.symbol}${cappedPrice.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatPrice,
      convertPrice,
      supportedCurrencies,
      exchangeRates,
      isConverting
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};