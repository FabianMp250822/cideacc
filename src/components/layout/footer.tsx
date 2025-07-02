'use client';

import { useLocalization } from '@/hooks/use-localization';
import { Mail, Phone, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Footer() {
  const { t } = useLocalization();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const navLinks = [
    { href: '/about', label: t('navigation.about') },
    { href: '/solutions', label: t('navigation.solutions') },
    { href: '/impact', label: t('navigation.impact') },
    { href: '/contact', label: t('navigation.contact') },
  ];

  return (
    <footer className="bg-background border-t border-border/20">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png"
                alt="CIDEACC Logo"
                width={120}
                height={40}
              />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="font-headline text-lg font-semibold text-foreground">{t('navigation.title')}</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-foreground">{t('contact.direct_info')}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <a href="mailto:maroca@clinicadelacosta.co" className="text-muted-foreground transition-colors hover:text-foreground">
                    maroca@clinicadelacosta.co
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">+57 320 801 5489</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-accent" />
                  <a href="https://cideacc.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                    cideacc.org
                  </a>
                </li>
              </ul>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold text-foreground">{t('footer.credits.title')}</h3>
               <ul className="mt-4 space-y-2 text-sm">
                <li className="text-muted-foreground">
                  {t('footer.credits.developer')}: Fabian Muñoz Puello
                </li>
                <li className="text-muted-foreground">
                  {t('footer.credits.designer')}: Leidy Vega Anaya
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>&copy; {year} CIDEACC. {t('footer.all_rights_reserved')}</p>
          <p>{t('footer.developed_by')}</p>
        </div>
      </div>
    </footer>
  );
}
