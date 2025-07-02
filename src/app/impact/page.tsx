'use client';

import ImpactSummary from '@/components/impact-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/use-localization';
import { BarChart, CheckCircle, Lightbulb } from 'lucide-react';

export default function ImpactPage() {
  const { t } = useLocalization();

  const results = [
    t('impact.organizational_results.items.time_reduction'),
    t('impact.organizational_results.items.accessibility'),
    t('impact.organizational_results.items.empowerment'),
  ];

  const lessons = [
    t('impact.lessons_learned.items.no_generic'),
    t('impact.lessons_learned.items.measure_accuracy'),
    t('impact.lessons_learned.items.gradual_progress'),
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
          {t('impact.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('impact.subtitle')}
        </p>
      </header>
      
      <section className="mt-16">
        <ImpactSummary />
      </section>

      <section className="mt-16">
        <div className="grid gap-12 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <BarChart />
                {t('impact.organizational_results.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                <Lightbulb />
                {t('impact.lessons_learned.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {lessons.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                     <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
