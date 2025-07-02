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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs *after* the component has mounted on the client.
    // This prevents a mismatch between the server-rendered HTML and the initial client-render.
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (browserLang === 'en' || browserLang === 'es') {
      setLocale(browserLang);
    }
    setIsMounted(true);
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Until the component is mounted, we use the default locale ('es')
      // to match the server-rendered output.
      const effectiveLocale = isMounted ? locale : 'es';
      return getNestedValue(translations[effectiveLocale], key);
    },
    [locale, isMounted]
  );

  const value = { locale, setLocale, t };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}
