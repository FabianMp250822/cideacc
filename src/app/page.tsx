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
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
            <div className="flex flex-col justify-center space-y-6">
               <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary max-w-fit">
                {t('homepage.hero.badge')}
              </div>
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                <span className="block">{t('homepage.hero.title_part1')}</span>
                <span className="block text-primary">{t('homepage.hero.title_part2')}</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                {t('homepage.hero.subtitle')}
              </p>
               <ul className="space-y-3">
                {heroFeatures.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Futuristic Medical Technology"
                width={600}
                height={600}
                priority
                className="rounded-lg"
                data-ai-hint="futuristic medical technology"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container mx-auto space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
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
              <Card key={feature.title} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                   <Button asChild variant="link" className="text-primary">
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

      <section className="w-full py-12 md:py-24 lg:py-32">
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
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 rounded-full">
              <Link href="/contact">
                {t('common.get_in_touch')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
