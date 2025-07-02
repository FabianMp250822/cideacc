'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useLocalization } from '@/hooks/use-localization';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateImpactSummary } from '@/lib/actions';

const defaultProjectOverview = 
`Casos sintéticos como ejemplos.
Resultados organizacionales: Reducción en tiempos operativos. Mejora de accesibilidad a información crítica. Empoderamiento del personal.
Lecciones aprendidas: Evitar soluciones genéricas. Importancia de medir precisión. Progreso gradual con IA bien alineada.`;

export default function ImpactSummary() {
  const { t } = useLocalization();
  const [projectOverview, setProjectOverview] = useState(defaultProjectOverview);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await generateImpactSummary({ projectOverview });
      if (result.summary) {
        setSummary(result.summary);
      } else {
        setError('Failed to generate summary. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
          <Sparkles className="text-accent" /> {t('impact.ai_summary.title')}
        </CardTitle>
        <CardDescription>
          {t('impact.ai_summary.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={t('impact.ai_summary.placeholder')}
            value={projectOverview}
            onChange={(e) => setProjectOverview(e.target.value)}
            className="min-h-[150px]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !projectOverview.trim()} className="bg-accent hover:bg-accent/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('impact.ai_summary.button')
            )}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {summary && (
          <div className="mt-6">
            <h3 className="font-headline text-xl font-semibold text-primary">
                {t('impact.ai_summary.result_title')}
            </h3>
            <Card className="mt-2 bg-primary/5">
                <CardContent className="p-6">
                    <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
