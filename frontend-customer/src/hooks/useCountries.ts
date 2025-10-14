import { useState, useEffect } from 'react';

export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  currencies: Record<string, {
    name: string;
    symbol: string;
  }>;
  cca2: string; // ISO 3166-1 alpha-2
}

const CACHE_KEY = 'countries_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCountries(data);
            setLoading(false);
            return;
          }
        }

        // Fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        console.log('Fetching countries from REST Countries API...');
        const response = await fetch('https://restcountries.com/v3.1/all', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        console.log('Countries API response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data: Country[] = await response.json();
        console.log('Raw countries data received:', data.length, 'countries');

        // Sort by common name
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Filter out countries without currencies to avoid issues, but be more lenient
        const validCountries = data.filter(country =>
          country.name?.common &&
          country.flags?.png
        );
        console.log('Valid countries after filtering:', validCountries.length);

        // If filtering removes too many countries, use a broader filter
        const finalCountries = validCountries.length > 10 ? validCountries :
          data.filter(country => country.name?.common && country.flags?.png);

        console.log('Final countries to display:', finalCountries.length);
        console.log('Sample countries:', finalCountries.slice(0, 3).map(c => c.name.common));

        setCountries(finalCountries);

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: finalCountries,
          timestamp: Date.now()
        }));

      } catch (err) {
        console.error('Countries API error:', err);
        console.log('Falling back to static country list');
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Provide comprehensive fallback countries if API fails
        const fallbackCountries: Country[] = [
          {
            name: { common: 'Afghanistan', official: 'Islamic Republic of Afghanistan' },
            flags: { png: 'https://flagcdn.com/w320/af.png', svg: 'https://flagcdn.com/af.svg' },
            currencies: { AFN: { name: 'Afghan Afghani', symbol: '؋' } },
            cca2: 'AF'
          },
          {
            name: { common: 'Albania', official: 'Republic of Albania' },
            flags: { png: 'https://flagcdn.com/w320/al.png', svg: 'https://flagcdn.com/al.svg' },
            currencies: { ALL: { name: 'Albanian Lek', symbol: 'L' } },
            cca2: 'AL'
          },
          {
            name: { common: 'Algeria', official: 'People\'s Democratic Republic of Algeria' },
            flags: { png: 'https://flagcdn.com/w320/dz.png', svg: 'https://flagcdn.com/dz.svg' },
            currencies: { DZD: { name: 'Algerian Dinar', symbol: 'د.ج' } },
            cca2: 'DZ'
          },
          {
            name: { common: 'Argentina', official: 'Argentine Republic' },
            flags: { png: 'https://flagcdn.com/w320/ar.png', svg: 'https://flagcdn.com/ar.svg' },
            currencies: { ARS: { name: 'Argentine Peso', symbol: '$' } },
            cca2: 'AR'
          },
          {
            name: { common: 'Australia', official: 'Commonwealth of Australia' },
            flags: { png: 'https://flagcdn.com/w320/au.png', svg: 'https://flagcdn.com/au.svg' },
            currencies: { AUD: { name: 'Australian Dollar', symbol: 'A$' } },
            cca2: 'AU'
          },
          {
            name: { common: 'Austria', official: 'Republic of Austria' },
            flags: { png: 'https://flagcdn.com/w320/at.png', svg: 'https://flagcdn.com/at.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'AT'
          },
          {
            name: { common: 'Bangladesh', official: 'People\'s Republic of Bangladesh' },
            flags: { png: 'https://flagcdn.com/w320/bd.png', svg: 'https://flagcdn.com/bd.svg' },
            currencies: { BDT: { name: 'Bangladeshi Taka', symbol: '৳' } },
            cca2: 'BD'
          },
          {
            name: { common: 'Belgium', official: 'Kingdom of Belgium' },
            flags: { png: 'https://flagcdn.com/w320/be.png', svg: 'https://flagcdn.com/be.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'BE'
          },
          {
            name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
            flags: { png: 'https://flagcdn.com/w320/br.png', svg: 'https://flagcdn.com/br.svg' },
            currencies: { BRL: { name: 'Brazilian Real', symbol: 'R$' } },
            cca2: 'BR'
          },
          {
            name: { common: 'Canada', official: 'Canada' },
            flags: { png: 'https://flagcdn.com/w320/ca.png', svg: 'https://flagcdn.com/ca.svg' },
            currencies: { CAD: { name: 'Canadian Dollar', symbol: 'C$' } },
            cca2: 'CA'
          },
          {
            name: { common: 'China', official: 'People\'s Republic of China' },
            flags: { png: 'https://flagcdn.com/w320/cn.png', svg: 'https://flagcdn.com/cn.svg' },
            currencies: { CNY: { name: 'Chinese Yuan', symbol: '¥' } },
            cca2: 'CN'
          },
          {
            name: { common: 'Colombia', official: 'Republic of Colombia' },
            flags: { png: 'https://flagcdn.com/w320/co.png', svg: 'https://flagcdn.com/co.svg' },
            currencies: { COP: { name: 'Colombian Peso', symbol: '$' } },
            cca2: 'CO'
          },
          {
            name: { common: 'Egypt', official: 'Arab Republic of Egypt' },
            flags: { png: 'https://flagcdn.com/w320/eg.png', svg: 'https://flagcdn.com/eg.svg' },
            currencies: { EGP: { name: 'Egyptian Pound', symbol: '£' } },
            cca2: 'EG'
          },
          {
            name: { common: 'France', official: 'French Republic' },
            flags: { png: 'https://flagcdn.com/w320/fr.png', svg: 'https://flagcdn.com/fr.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'FR'
          },
          {
            name: { common: 'Germany', official: 'Federal Republic of Germany' },
            flags: { png: 'https://flagcdn.com/w320/de.png', svg: 'https://flagcdn.com/de.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'DE'
          },
          {
            name: { common: 'Ghana', official: 'Republic of Ghana' },
            flags: { png: 'https://flagcdn.com/w320/gh.png', svg: 'https://flagcdn.com/gh.svg' },
            currencies: { GHS: { name: 'Ghanaian Cedi', symbol: '₵' } },
            cca2: 'GH'
          },
          {
            name: { common: 'India', official: 'Republic of India' },
            flags: { png: 'https://flagcdn.com/w320/in.png', svg: 'https://flagcdn.com/in.svg' },
            currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } },
            cca2: 'IN'
          },
          {
            name: { common: 'Indonesia', official: 'Republic of Indonesia' },
            flags: { png: 'https://flagcdn.com/w320/id.png', svg: 'https://flagcdn.com/id.svg' },
            currencies: { IDR: { name: 'Indonesian Rupiah', symbol: 'Rp' } },
            cca2: 'ID'
          },
          {
            name: { common: 'Italy', official: 'Italian Republic' },
            flags: { png: 'https://flagcdn.com/w320/it.png', svg: 'https://flagcdn.com/it.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'IT'
          },
          {
            name: { common: 'Japan', official: 'Japan' },
            flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/jp.svg' },
            currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } },
            cca2: 'JP'
          },
          {
            name: { common: 'Kenya', official: 'Republic of Kenya' },
            flags: { png: 'https://flagcdn.com/w320/ke.png', svg: 'https://flagcdn.com/ke.svg' },
            currencies: { KES: { name: 'Kenyan Shilling', symbol: 'KSh' } },
            cca2: 'KE'
          },
          {
            name: { common: 'Mexico', official: 'United Mexican States' },
            flags: { png: 'https://flagcdn.com/w320/mx.png', svg: 'https://flagcdn.com/mx.svg' },
            currencies: { MXN: { name: 'Mexican Peso', symbol: '$' } },
            cca2: 'MX'
          },
          {
            name: { common: 'Netherlands', official: 'Kingdom of the Netherlands' },
            flags: { png: 'https://flagcdn.com/w320/nl.png', svg: 'https://flagcdn.com/nl.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'NL'
          },
          {
            name: { common: 'Nigeria', official: 'Federal Republic of Nigeria' },
            flags: { png: 'https://flagcdn.com/w320/ng.png', svg: 'https://flagcdn.com/ng.svg' },
            currencies: { NGN: { name: 'Nigerian Naira', symbol: '₦' } },
            cca2: 'NG'
          },
          {
            name: { common: 'Pakistan', official: 'Islamic Republic of Pakistan' },
            flags: { png: 'https://flagcdn.com/w320/pk.png', svg: 'https://flagcdn.com/pk.svg' },
            currencies: { PKR: { name: 'Pakistani Rupee', symbol: '₨' } },
            cca2: 'PK'
          },
          {
            name: { common: 'Philippines', official: 'Republic of the Philippines' },
            flags: { png: 'https://flagcdn.com/w320/ph.png', svg: 'https://flagcdn.com/ph.svg' },
            currencies: { PHP: { name: 'Philippine Peso', symbol: '₱' } },
            cca2: 'PH'
          },
          {
            name: { common: 'Poland', official: 'Republic of Poland' },
            flags: { png: 'https://flagcdn.com/w320/pl.png', svg: 'https://flagcdn.com/pl.svg' },
            currencies: { PLN: { name: 'Polish Złoty', symbol: 'zł' } },
            cca2: 'PL'
          },
          {
            name: { common: 'Portugal', official: 'Portuguese Republic' },
            flags: { png: 'https://flagcdn.com/w320/pt.png', svg: 'https://flagcdn.com/pt.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'PT'
          },
          {
            name: { common: 'Russia', official: 'Russian Federation' },
            flags: { png: 'https://flagcdn.com/w320/ru.png', svg: 'https://flagcdn.com/ru.svg' },
            currencies: { RUB: { name: 'Russian Ruble', symbol: '₽' } },
            cca2: 'RU'
          },
          {
            name: { common: 'Saudi Arabia', official: 'Kingdom of Saudi Arabia' },
            flags: { png: 'https://flagcdn.com/w320/sa.png', svg: 'https://flagcdn.com/sa.svg' },
            currencies: { SAR: { name: 'Saudi Riyal', symbol: '﷼' } },
            cca2: 'SA'
          },
          {
            name: { common: 'Singapore', official: 'Republic of Singapore' },
            flags: { png: 'https://flagcdn.com/w320/sg.png', svg: 'https://flagcdn.com/sg.svg' },
            currencies: { SGD: { name: 'Singapore Dollar', symbol: 'S$' } },
            cca2: 'SG'
          },
          {
            name: { common: 'South Africa', official: 'Republic of South Africa' },
            flags: { png: 'https://flagcdn.com/w320/za.png', svg: 'https://flagcdn.com/za.svg' },
            currencies: { ZAR: { name: 'South African Rand', symbol: 'R' } },
            cca2: 'ZA'
          },
          {
            name: { common: 'South Korea', official: 'Republic of Korea' },
            flags: { png: 'https://flagcdn.com/w320/kr.png', svg: 'https://flagcdn.com/kr.svg' },
            currencies: { KRW: { name: 'South Korean Won', symbol: '₩' } },
            cca2: 'KR'
          },
          {
            name: { common: 'Spain', official: 'Kingdom of Spain' },
            flags: { png: 'https://flagcdn.com/w320/es.png', svg: 'https://flagcdn.com/es.svg' },
            currencies: { EUR: { name: 'Euro', symbol: '€' } },
            cca2: 'ES'
          },
          {
            name: { common: 'Sweden', official: 'Kingdom of Sweden' },
            flags: { png: 'https://flagcdn.com/w320/se.png', svg: 'https://flagcdn.com/se.svg' },
            currencies: { SEK: { name: 'Swedish Krona', symbol: 'kr' } },
            cca2: 'SE'
          },
          {
            name: { common: 'Switzerland', official: 'Swiss Confederation' },
            flags: { png: 'https://flagcdn.com/w320/ch.png', svg: 'https://flagcdn.com/ch.svg' },
            currencies: { CHF: { name: 'Swiss Franc', symbol: 'Fr.' } },
            cca2: 'CH'
          },
          {
            name: { common: 'Thailand', official: 'Kingdom of Thailand' },
            flags: { png: 'https://flagcdn.com/w320/th.png', svg: 'https://flagcdn.com/th.svg' },
            currencies: { THB: { name: 'Thai Baht', symbol: '฿' } },
            cca2: 'TH'
          },
          {
            name: { common: 'Turkey', official: 'Republic of Türkiye' },
            flags: { png: 'https://flagcdn.com/w320/tr.png', svg: 'https://flagcdn.com/tr.svg' },
            currencies: { TRY: { name: 'Turkish Lira', symbol: '₺' } },
            cca2: 'TR'
          },
          {
            name: { common: 'Ukraine', official: 'Ukraine' },
            flags: { png: 'https://flagcdn.com/w320/ua.png', svg: 'https://flagcdn.com/ua.svg' },
            currencies: { UAH: { name: 'Ukrainian Hryvnia', symbol: '₴' } },
            cca2: 'UA'
          },
          {
            name: { common: 'United Arab Emirates', official: 'United Arab Emirates' },
            flags: { png: 'https://flagcdn.com/w320/ae.png', svg: 'https://flagcdn.com/ae.svg' },
            currencies: { AED: { name: 'UAE Dirham', symbol: 'د.إ' } },
            cca2: 'AE'
          },
          {
            name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' },
            flags: { png: 'https://flagcdn.com/w320/gb.png', svg: 'https://flagcdn.com/gb.svg' },
            currencies: { GBP: { name: 'British Pound', symbol: '£' } },
            cca2: 'GB'
          },
          {
            name: { common: 'United States', official: 'United States of America' },
            flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
            currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
            cca2: 'US'
          },
          {
            name: { common: 'Vietnam', official: 'Socialist Republic of Vietnam' },
            flags: { png: 'https://flagcdn.com/w320/vn.png', svg: 'https://flagcdn.com/vn.svg' },
            currencies: { VND: { name: 'Vietnamese Đồng', symbol: '₫' } },
            cca2: 'VN'
          }
        ];
        console.log('Setting fallback countries:', fallbackCountries.length);
        setCountries(fallbackCountries);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};