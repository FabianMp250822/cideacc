'use client';

import { useLocalization } from '@/hooks/use-localization';

export default function BlogPage() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t('blog.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('blog.subtitle')}
        </p>
      </header>

      <section className="mt-20 text-center animate-fade-in">
        <p className="text-2xl text-muted-foreground">Próximamente...</p>
      </section>
    </div>
  );
}
