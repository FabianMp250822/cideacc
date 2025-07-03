'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, User, Eye, Loader2 } from 'lucide-react';
import { getFeaturedStudies, type Study } from '@/lib/actions';
import Link from 'next/link';
import Image from 'next/image';

export default function ImpactPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudies = async () => {
      try {
        const featuredStudies = await getFeaturedStudies();
        setStudies(featuredStudies);
      } catch (error) {
        console.error('Error loading studies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudies();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      innovation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      impact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      research: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'case-study': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[category as keyof typeof colors] || colors.research;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      innovation: 'Innovación',
      impact: 'Impacto',
      research: 'Investigación',
      'case-study': 'Caso de Estudio',
    };
    return labels[category as keyof typeof labels] || 'Investigación';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando estudios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Impacto e Innovación
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          Explora nuestros estudios, investigaciones y casos de éxito que demuestran 
          el impacto de la inteligencia artificial en diferentes sectores.
        </p>
      </header>

      {/* Estadísticas de impacto */}
      <section className="mt-20 animate-fade-in">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Organizaciones Impactadas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-muted-foreground">Reducción de Tiempo</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-muted-foreground">Profesionales Capacitados</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Estudios destacados */}
      <section className="mt-20 animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-foreground mb-4">
            Estudios e Investigaciones
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Documentos técnicos, casos de estudio y investigaciones que respaldan 
            nuestro trabajo y demuestran el impacto real de nuestras soluciones.
          </p>
        </div>

        {studies.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study) => (
                <Card key={study.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    {study.thumbnailUrl ? (
                      <Image
                        src={study.thumbnailUrl}
                        alt={study.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(study.category)}>
                        {getCategoryLabel(study.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {study.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {study.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(study.publishDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        {study.downloadCount} descargas
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/studies/${study.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        
                        <Button
                          size="sm"
                          asChild
                        >
                          <Link 
                            href={study.pdfUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {study.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {study.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/studies">
                  Ver Todos los Estudios
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Card className="text-center p-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay estudios disponibles</h3>
            <p className="text-muted-foreground">
              Los estudios e investigaciones se publicarán próximamente.
            </p>
          </Card>
        )}
      </section>

      {/* Llamada a la acción */}
      <section className="mt-20 text-center animate-fade-in">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 p-8">
          <CardContent className="p-0">
            <h3 className="font-headline text-2xl font-bold text-foreground mb-4">
              ¿Quieres conocer más sobre nuestro impacto?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contáctanos para obtener información detallada sobre cómo nuestras 
              soluciones pueden transformar tu organización.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contactar Ahora
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
