'use client';

import { PostForm } from '@/components/admin/post-form';
import { useLocalization } from '@/hooks/use-localization';

export default function CreatePostPage() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
        <header className="space-y-2 mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Crear Nueva Publicación
            </h1>
            <p className="text-muted-foreground md:text-xl">
                Completa el formulario para añadir un nuevo artículo al blog.
            </p>
        </header>
        <PostForm />
    </div>
  );
}
