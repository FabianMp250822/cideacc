'use client';

import { PostForm } from '@/components/admin/post-form';
import { useLocalization } from '@/hooks/use-localization';
import { useEffect, useState } from 'react';
import type { Post } from '@/types';
import { getPostBySlug } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const { t } = useLocalization();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const fetchedPost = await getPostBySlug(params.slug);
      setPost(fetchedPost);
      setLoading(false);
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
     return (
       <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-headline text-4xl font-bold mb-4">Publicación no encontrada</h1>
        <p className="text-muted-foreground mb-8">La publicación que intentas editar no existe.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
      <header className="space-y-2 mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Editar Publicación
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Modifica los detalles de la publicación.
        </p>
      </header>
      <PostForm postToEdit={post} />
    </div>
  );
}
