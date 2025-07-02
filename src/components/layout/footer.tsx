'use client';

import { useLocalization } from '@/hooks/use-localization';
import { BrainCircuit, Mail, Phone, Globe } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const { t } = useLocalization();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: '/about', label: t('navigation.about') },
    { href: '/solutions', label: t('navigation.solutions') },
    { href: '/impact', label: t('navigation.impact') },
    { href: '/contact', label: t('navigation.contact') },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold">CIDEACC</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="font-headline text-lg font-semibold">{t('navigation.title')}</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">{t('contact.title')}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:maroca@clinicadelacosta.co" className="text-muted-foreground hover:text-primary">
                    maroca@clinicadelacosta.co
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+57 320 801 5489</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <a href="https://cideacc.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    cideacc.org
                  </a>
                </li>
              </ul>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold">{t('footer.credits.title')}</h3>
               <p className="mt-4 text-sm text-muted-foreground">
                {t('footer.credits.text')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {year} CIDEACC. {t('footer.all_rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
}
