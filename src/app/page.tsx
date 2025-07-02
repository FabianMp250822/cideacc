'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/use-localization';
import { ArrowRight, BrainCircuit, HeartPulse, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { t } = useLocalization();

  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: t('homepage.features.ai.title'),
      description: t('homepage.features.ai.description'),
      link: '/solutions',
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-primary" />,
      title: t('homepage.features.impact.title'),
      description: t('homepage.features.impact.description'),
      link: '/impact',
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: t('homepage.features.innovation.title'),
      description: t('homepage.features.innovation.description'),
      link: '/about',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="w-full bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
                {t('homepage.hero.title')}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t('homepage.hero.subtitle')}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/solutions">{t('homepage.hero.cta_solutions')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">{t('homepage.hero.cta_contact')}</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png"
                alt="CIDEACC Logo"
                width={400}
                height={137}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                {t('homepage.features.section_title')}
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                {t('homepage.features.title')}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('homepage.features.subtitle')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-col items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                   <Button asChild variant="link" className="text-accent">
                    <Link href={feature.link}>
                      {t('common.learn_more')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary md:text-4xl/tight">
              {t('homepage.cta_section.title')}
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('homepage.cta_section.subtitle')}
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
              <Link href="/contact">{t('homepage.cta_section.cta')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
