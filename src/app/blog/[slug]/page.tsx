import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts } from "@/lib/actions";

type Props = {
  params: Promise<{ slug: string }>
}

// Función helper para formatear fechas y obtener ISO string
const getDateTimeString = (dateValue: any): string | undefined => {
  if (!dateValue) return undefined;
  
  try {
    let date: Date;
    
    if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (dateValue && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      return undefined;
    }
    
    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      return undefined;
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error getting datetime string:', error);
    return undefined;
  }
};

// Función helper para formatear fechas para mostrar
const formatDate = (dateValue: any): string => {
  if (!dateValue) return 'Fecha no disponible';
  
  try {
    let date: Date;
    
    if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (dateValue && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      return 'Fecha inválida';
    }
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params para Next.js 15
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
      description: 'El post que buscas no existe o fue movido.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const featuredImageUrl = post.featuredImageUrl || 'https://placehold.co/1200x600.png';

  return {
    title: `${post.title} | CIDEACC Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [featuredImageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [featuredImageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  // Await params para Next.js 15
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const allPosts = await getPublishedPosts();
  
  if (!post) {
    return (
       <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-headline text-4xl font-bold mb-4">Post no Encontrado</h1>
        <p className="text-muted-foreground mb-8">El post que buscas no existe o fue movido.</p>
        <Link href="/blog" className="text-accent hover:underline">
          <ArrowLeft className="inline-block mr-2 h-4 w-4"/>Volver al Blog
        </Link>
      </div>
    )
  }

  const recommendedPosts = allPosts
    .filter(p => p.slug !== slug)
    .slice(0, 4);

  // Obtener el dateTime string de forma segura
  const dateTimeString = getDateTimeString(post.createdAt);
  const updatedAtString = getDateTimeString(post.updatedAt);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.featuredImageUrl || 'https://placehold.co/1200x600.png',
    'author': {
      '@type': 'Organization',
      'name': 'CIDEACC Team',
      'url': 'https://cideacc.org'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CIDEACC',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://i.ibb.co/SDrPcVcD/LOGO-CIDEACC-BLANCO-9c097083112aab88a977.png'
      }
    },
    'datePublished': dateTimeString,
    'dateModified': updatedAtString
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
          <article className="max-w-4xl mx-auto">
              <header className="mb-12 text-center animate-fade-in">
                  <Link href="/blog" className="inline-flex items-center text-accent hover:underline mb-6">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al Blog
                  </Link>
                  <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                      {post.title}
                  </h1>
                  <div className="mt-6 flex justify-center items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={'https://placehold.co/100x100.png'} alt={'CIDEACC Team'} data-ai-hint={'organization logo'} />
                              <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                          <span>CIDEACC Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <time dateTime={dateTimeString}>
                            {formatDate(post.createdAt)}
                          </time>
                      </div>
                  </div>
              </header>

              <Image
                  src={post.featuredImageUrl || 'https://placehold.co/1200x600.png'}
                  alt={post.title}
                  width={1200}
                  height={600}
                  priority
                  className="rounded-xl shadow-2xl mb-12 animate-fade-in"
                  data-ai-hint={'technology abstract'}
                />

              {/* Contenido mejorado para mostrar HTML rico */}
              <div
                  className="prose prose-lg max-w-none animate-fade-in"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '18px',
                    lineHeight: '1.7',
                    color: 'hsl(var(--foreground))',
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
              />
          </article>
          
          {recommendedPosts.length > 0 && (
              <section className="mt-24 border-t border-border/50 pt-16 animate-fade-in">
                  <h2 className="text-center font-headline text-3xl font-bold text-foreground mb-12">
                      También te podría interesar
                  </h2>
                  <Carousel
                      opts={{
                          align: "start",
                          loop: recommendedPosts.length > 2,
                      }}
                      className="w-full max-w-6xl mx-auto"
                  >
                      <CarouselContent className="-ml-4">
                          {recommendedPosts.map((recommendedPost) => (
                              <CarouselItem key={recommendedPost.slug} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                  <Card className="h-full overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
                                      <Link href={`/blog/${recommendedPost.slug}`} className="flex flex-col h-full">
                                          <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                                              <Image
                                                  src={recommendedPost.featuredImageUrl || 'https://placehold.co/800x400.png'}
                                                  alt={recommendedPost.title}
                                                  fill
                                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                  data-ai-hint={'technology abstract'}
                                              />
                                          </div>
                                          <CardHeader className="flex-grow">
                                              <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                  {recommendedPost.title}
                                              </CardTitle>
                                          </CardHeader>
                                      </Link>
                                  </Card>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden sm:flex" />
                      <CarouselNext className="hidden sm:flex" />
                  </Carousel>
              </section>
          )}
      </div>
    </>
  );
}
