import type { Metadata } from 'next';
import { Poppins, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LocalizationProvider } from '@/components/providers/localization-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

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
  metadataBase: new URL('https://cideacc.org'),
  title: 'CIDEACC - Laboratorio de IA para Innovación en Salud',
  description:
    'CIDEACC, el laboratorio de IA médica de la Clínica de la Costa, lidera la transformación de la salud con inteligencia artificial. Descubre nuestras soluciones y lee nuestro blog sobre las últimas tendencias.',
  keywords: ['IA en salud', 'inteligencia artificial médica', 'CIDEACC', 'Clínica de la Costa', 'innovación en salud', 'diagnóstico por IA', 'agentic rag', 'procesamiento de lenguaje natural', 'blog', 'artículos'],
  openGraph: {
    title: 'CIDEACC - Laboratorio de IA para Innovación en Salud',
    description: 'Transformando la salud con inteligencia artificial. Descubre nuestras soluciones en CIDEACC.',
    url: 'https://cideacc.org',
    siteName: 'CIDEACC',
    images: [
      {
        url: 'https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png',
        width: 1200,
        height: 630,
        alt: 'Logo de CIDEACC',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIDEACC - Laboratorio de IA para Innovación en Salud',
    description: 'CIDEACC lidera la transformación de la salud con inteligencia artificial.',
    images: ['https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocalizationProvider>
            <AuthProvider>
              <div className="relative flex min-h-dvh flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
