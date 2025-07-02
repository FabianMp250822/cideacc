'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/use-localization';
import { ArrowRight, BrainCircuit, HeartPulse, Lightbulb, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { t } = useLocalization();

  const heroFeatures = [
    t('homepage.hero.feature1'),
    t('homepage.hero.feature2'),
    t('homepage.hero.feature3'),
  ];
  
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
    <div className="flex flex-col animate-fade-in">
      <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-br from-background via-secondary to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
               <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium max-w-fit">
                {t('homepage.hero.badge')}
              </div>
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                <span className="block">{t('homepage.hero.title_part1')}</span>
                <span className="block text-primary">{t('homepage.hero.title_part2')}</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t('homepage.hero.subtitle')}
              </p>
               <ul className="space-y-3 pt-4">
                {heroFeatures.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  <Link href="/contact">
                    {t('common.get_in_touch')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/solutions">
                    {t('navigation.solutions')}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Futuristic Medical Technology"
                width={600}
                height={600}
                priority
                className="rounded-xl shadow-2xl"
                data-ai-hint="abstract AI data"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-28 lg:py-32 bg-background">
        <div className="container mx-auto space-y-16 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-semibold">
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
              <Card key={feature.title} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card border shadow-lg">
                <CardHeader className="flex flex-col items-start">
                  <div className="p-3 rounded-md bg-primary/10">{feature.icon}</div>
                  <CardTitle className="mt-4 font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-start text-left space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                   <Button asChild variant="link" className="text-primary p-0">
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

      <section className="w-full py-20 md:py-28 lg:py-32 bg-secondary">
        <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground md:text-4xl/tight">
              {t('homepage.cta_section.title')}
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('homepage.cta_section.subtitle')}
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              <Link href="/contact">
                {t('common.get_in_touch')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
