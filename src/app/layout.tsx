import type { Metadata } from 'next';
import { Poppins, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LocalizationProvider } from '@/components/providers/localization-provider';

const fontBody = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'CIDEACC - Laboratorio de IA Médica',
  description:
    'Transformando la salud con inteligencia artificial. CIDEACC es el laboratorio de IA médica de la Clínica de la Costa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <LocalizationProvider>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LocalizationProvider>
      </body>
    </html>
  );
}
