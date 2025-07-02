'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocalization } from '@/hooks/use-localization';

// Placeholder data - in a real app, this would come from Firebase
const posts = [
  {
    slug: 'ia-revoluciona-diagnostico',
    title: 'Cómo la IA está Revolucionando el Diagnóstico Médico',
    excerpt: 'La inteligencia artificial no es solo una promesa futura; está transformando activamente el campo del diagnóstico médico hoy. Desde el análisis de imágenes hasta la predicción de enfermedades, descubra cómo la IA está mejorando la precisión y la velocidad de los diagnósticos.',
    author: 'Dra. Maria Paula Aroca',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman doctor',
    date: '24 de Julio, 2024',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'medical scan AI'
  },
  {
    slug: 'etica-en-ia-medica',
    title: 'Los Desafíos Éticos de la Inteligencia Artificial en la Salud',
    excerpt: 'A medida que integramos la IA en decisiones clínicas críticas, surgen importantes cuestiones éticas. Analizamos los desafíos de la privacidad de los datos, el sesgo algorítmico y la responsabilidad en la era de la medicina aumentada por la IA.',
    author: 'Kanery Camargo',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman developer',
    date: '15 de Julio, 2024',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'abstract ethics data'
  },
  {
    slug: 'futuro-medicina-personalizada',
    title: 'El Futuro de la Medicina: Tratamientos Personalizados con IA',
    excerpt: 'La IA permite analizar grandes volúmenes de datos genéticos y de estilo de vida para crear tratamientos a medida. Exploramos cómo esta hiperpersonalización está cambiando el enfoque de "talla única" en la medicina moderna.',
    author: 'Nicoll Fontalvo',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman engineer',
    date: '02 de Julio, 2024',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'dna sequence AI'
  },
];


export default function BlogPage() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in mb-20">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t('blog.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          {t('blog.subtitle')}
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
             <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-t-lg object-cover"
                data-ai-hint={post.imageHint}
              />
            <CardHeader>
              <CardTitle className="font-headline text-2xl hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 border-t border-border/50 pt-6">
                <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                        <AvatarImage src={post.authorImage} alt={post.author} data-ai-hint={post.authorImageHint}/>
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{post.author}</p>
                        <p className="text-sm text-muted-foreground">{post.date}</p>
                    </div>
                </div>
                 <Button asChild variant="link" className="text-accent p-0 mt-2">
                    <Link href={`/blog/${post.slug}`}>
                        Leer más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
