'use client';

import { useLocalization } from '@/hooks/use-localization';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LanguageSwitcher } from '../language-switcher';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function Header() {
  const { t } = useLocalization();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '/about', label: t('navigation.about') },
    { href: '/solutions', label: t('navigation.solutions') },
    { href: '/impact', label: t('navigation.impact') },
    { href: '/blog', label: t('navigation.blog') },
  ];
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!isMounted) {
    return (
       <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm border-border">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
             <div className="h-8 w-36 bg-muted/50 rounded-md animate-pulse" />
             <div className="hidden md:flex items-center gap-4">
                <div className="h-6 w-20 bg-muted/50 rounded-md animate-pulse" />
                <div className="h-6 w-20 bg-muted/50 rounded-md animate-pulse" />
                <div className="h-6 w-20 bg-muted/50 rounded-md animate-pulse" />
             </div>
             <div className="h-10 w-24 bg-muted/50 rounded-full animate-pulse" />
          </div>
       </header>
    )
  }

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm border-border'
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png"
            alt="CIDEACC Logo"
            width={150}
            height={50}
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
           {!loading && (
            <>
              {user ? (
                <div className='flex gap-2'>
                   <Button asChild variant="outline" className="rounded-full">
                     <Link href="/admin/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                       {t('navigation.admin')}
                      </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="destructive" className="rounded-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('navigation.logout')}
                  </Button>
                </div>
              ) : (
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Link href="/contact">
                    {t('navigation.contact')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </>
          )}
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
             <Link
                href="/contact"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  pathname === "/contact" ? 'text-primary' : 'text-foreground'
                )}
              >
                {t('navigation.contact')}
              </Link>
            <LanguageSwitcher />
            {!loading && (
              <>
                {user ? (
                  <div className='w-full flex flex-col gap-4'>
                    <Button asChild className="w-full">
                      <Link href="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('navigation.admin')}
                      </Link>
                    </Button>
                    <Button onClick={handleLogout} variant="destructive" className="w-full">
                       <LogOut className="mr-2 h-4 w-4" />
                       {t('navigation.logout')}
                    </Button>
                  </div>
                ) : (
                   <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                      <Link href="/contact">
                        {t('common.get_in_touch')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
