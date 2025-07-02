'use client';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Título del Post
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          Cargando contenido para: {params.slug}
        </p>
      </header>

      <article className="mt-20 max-w-4xl mx-auto animate-fade-in space-y-6 text-muted-foreground">
          <p className="text-2xl text-center">Contenido del post próximamente...</p>
      </article>
    </div>
  );
}
