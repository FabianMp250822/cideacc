'use client';

import { useLocalization } from '@/hooks/use-localization';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LanguageSwitcher } from '../language-switcher';
import { Button } from '../ui/button';
import Image from 'next/image';

export function Header() {
  const { t } = useLocalization();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '/about', label: t('navigation.about') },
    { href: '/solutions', label: t('navigation.solutions') },
    { href: '/impact', label: t('navigation.impact') },
    { href: '/contact', label: t('navigation.contact') },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);


  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground border-primary/20'
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png"
            alt="CIDEACC Logo"
            width={150}
            height={50}
            className="dark:invert"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-foreground',
                pathname === link.href ? 'text-primary-foreground' : 'text-primary-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button asChild className="bg-accent hover:bg-accent/90 rounded-full">
             <Link href="/contact">
              {t('common.get_in_touch')}
              <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col items-center space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Button asChild className="w-full bg-accent hover:bg-accent/90 rounded-full">
                <Link href="/contact">
                  {t('common.get_in_touch')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
