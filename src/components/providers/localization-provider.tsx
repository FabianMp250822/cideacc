'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Locale = 'en' | 'es';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations: Record<Locale, any> = { en, es };

function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return key; // Return the key itself if not found
  }, obj);
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (browserLang === 'en' || browserLang === 'es') {
      setLocale(browserLang);
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = getNestedValue(translations[locale], key);
      return translation || key;
    },
    [locale]
  );

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}
