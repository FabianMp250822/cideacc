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
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t('impact.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('impact.subtitle')}
        </p>
      </header>
      
      <section className="mt-20 animate-fade-in">
        <ImpactSummary />
      </section>

      <section className="mt-20 animate-fade-in">
        <div className="grid gap-12 md:grid-cols-2">
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-foreground">
                <BarChart className="text-primary" />
                {t('impact.organizational_results.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {results.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline text-2xl text-foreground">
                <Lightbulb className="text-primary" />
                {t('impact.lessons_learned.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {lessons.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                     <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
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
