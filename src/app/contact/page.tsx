'use client';

import { ContactForm } from '@/components/contact-form';
import { useLocalization } from '@/hooks/use-localization';
import { Mail, Phone, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  const { t } = useLocalization();

  const contactDetails = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      label: 'Email',
      value: 'maroca@clinicadelacosta.co',
      href: 'mailto:maroca@clinicadelacosta.co',
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      label: 'Phone',
      value: '+57 320 801 5489',
      href: 'tel:+573208015489',
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      label: 'Website',
      value: 'cideacc.org',
      href: 'https://cideacc.org',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
          {t('contact.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('contact.subtitle')}
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">{t('contact.direct_info')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    {contactDetails.map((detail) => (
                        <div key={detail.label} className="flex items-start gap-4">
                        <div className="flex-shrink-0">{detail.icon}</div>
                        <div>
                            <p className="font-semibold">{detail.label}</p>
                            <a
                            href={detail.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-accent"
                            >
                            {detail.value}
                            </a>
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
