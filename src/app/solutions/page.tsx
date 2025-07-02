'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/use-localization';
import { BrainCircuit, FileText, MessagesSquare, ShieldCheck, Check } from 'lucide-react';
import Image from 'next/image';

export default function SolutionsPage() {
  const { t } = useLocalization();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t('solutions.features.data_structuring.title'),
      description: t('solutions.features.data_structuring.description'),
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: t('solutions.features.summarization.title'),
      description: t('solutions.features.summarization.description'),
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-primary" />,
      title: t('solutions.features.interactive_consultation.title'),
      description: t('solutions.features.interactive_consultation.description'),
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: t('solutions.features.agentic_rag.title'),
      description: t('solutions.features.agentic_rag.description'),
    },
  ];

  const benefits = [
    t('solutions.benefits.list.time_reduction'),
    t('solutions.benefits.list.efficiency'),
    t('solutions.benefits.list.copilots'),
    t('solutions.benefits.list.privacy'),
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
      <header className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t('solutions.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('solutions.subtitle')}
        </p>
      </header>

      <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <h2 className="font-headline text-3xl font-bold text-foreground">{t('solutions.description')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('solutions.subtitle')}
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <Image
            src="https://placehold.co/600x400.png"
            alt="AI Solution Diagram"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
            data-ai-hint="medical dashboard graphs"
          />
        </div>
      </section>

      <section className="mt-24">
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-md bg-primary/10">{feature.icon}</div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <Card className="bg-secondary shadow-lg">
            <CardHeader>
                <CardTitle className="text-center font-headline text-3xl font-bold text-foreground">
                    {t('solutions.benefits.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <Check className="h-6 w-6 flex-shrink-0 text-primary mt-1" />
                            <span className="text-muted-foreground text-base">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
