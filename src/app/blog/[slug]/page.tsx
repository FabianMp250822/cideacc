import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import Link from "next/link";

// Placeholder data - in a real app, this would come from Firebase
const posts = [
  {
    slug: 'ia-revoluciona-diagnostico',
    title: 'Cómo la IA está Revolucionando el Diagnóstico Médico',
    excerpt: 'La inteligencia artificial no es solo una promesa futura; está transformando activamente el campo del diagnóstico médico hoy. Desde el análisis de imágenes hasta la predicción de enfermedades, descubra cómo la IA está mejorando la precisión y la velocidad de los diagnósticos.',
    content: `
      <p>La inteligencia artificial (IA) está marcando un antes y un después en la medicina moderna, y uno de los campos más impactados es el diagnóstico clínico. Durante décadas, el diagnóstico ha dependido en gran medida de la experiencia y la intuición del médico, apoyado por pruebas de laboratorio e imágenes. Sin embargo, la capacidad de la IA para analizar cantidades masivas de datos a una velocidad sobrehumana está llevando la precisión diagnóstica a un nuevo nivel.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 font-headline text-foreground">Análisis de Imágenes Médicas</h3>
      <p>Los algoritmos de IA, especialmente las redes neuronales convolucionales (CNN), han demostrado ser excepcionalmente buenos en la interpretación de imágenes médicas como radiografías, tomografías computarizadas (TC) y resonancias magnéticas (RM). En algunos estudios, los modelos de IA han igualado e incluso superado la precisión de los radiólogos humanos en la detección de cáncer de mama en mamografías o en la identificación de retinopatía diabética a partir de imágenes de retina.</p>
      <p>Esto no busca reemplazar a los médicos, sino empoderarlos. Una IA puede actuar como un "segundo par de ojos" infatigable, señalando áreas de interés que un especialista podría pasar por alto en un día ajetreado, reduciendo así los falsos negativos.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4 font-headline text-foreground">Medicina Predictiva y Personalizada</h3>
      <p>Más allá del diagnóstico de enfermedades existentes, la IA está abriendo la puerta a la medicina predictiva. Al analizar datos de historias clínicas electrónicas, resultados de laboratorio, información genética y factores de estilo de vida, los modelos de aprendizaje automático pueden identificar patrones sutiles que predicen el riesgo de un paciente de desarrollar ciertas condiciones, como enfermedades cardíacas o diabetes, años antes de que aparezcan los síntomas.</p>
      <p>Esta capacidad predictiva permite intervenciones tempranas y personalizadas, cambiando el paradigma de una medicina reactiva a una proactiva y preventiva. Es el comienzo de una era donde el tratamiento se adapta no solo a la enfermedad, sino al perfil único de cada individuo.</p>
    `,
    author: 'Dra. Maria Paula Aroca',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman doctor',
    date: '24 de Julio, 2024',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'medical scan AI'
  },
  {
    slug: 'etica-en-ia-medica',
    title: 'Los Desafíos Éticos de la Inteligencia Artificial en la Salud',
    excerpt: 'A medida que integramos la IA en decisiones clínicas críticas, surgen importantes cuestiones éticas. Analizamos los desafíos de la privacidad de los datos, el sesgo algorítmico y la responsabilidad en la era de la medicina aumentada por la IA.',
    content: '<p>Contenido del post sobre ética próximamente...</p>',
    author: 'Kanery Camargo',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman developer',
    date: '15 de Julio, 2024',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'abstract ethics data'
  },
  {
    slug: 'futuro-medicina-personalizada',
    title: 'El Futuro de la Medicina: Tratamientos Personalizados con IA',
    excerpt: 'La IA permite analizar grandes volúmenes de datos genéticos y de estilo de vida para crear tratamientos a medida. Exploramos cómo esta hiperpersonalización está cambiando el enfoque de "talla única" en la medicina moderna.',
    content: '<p>Contenido del post sobre medicina personalizada próximamente...</p>',
    author: 'Nicoll Fontalvo',
    authorImage: 'https://placehold.co/100x100.png',
    authorImageHint: 'woman engineer',
    date: '02 de Julio, 2024',
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'dna sequence AI'
  },
];

async function getPostBySlug(slug: string) {
  // In a real app, fetch this from Firebase
  return posts.find(p => p.slug === slug);
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
      description: 'El post que buscas no existe o fue movido.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${post.title} | CIDEACC Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

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

  return (
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
                            <AvatarImage src={post.authorImage} alt={post.author} data-ai-hint={post.authorImageHint} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <time dateTime={post.date}>{post.date}</time>
                    </div>
                </div>
            </header>

            <Image
                src={post.imageUrl}
                alt={post.title}
                width={1200}
                height={600}
                priority
                className="rounded-xl shadow-2xl mb-12 animate-fade-in"
                data-ai-hint={post.imageHint}
              />

            <div
                className="prose-lg max-w-none text-muted-foreground space-y-6 animate-fade-in"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    </div>
  );
}
