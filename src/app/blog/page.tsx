'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocalization } from '@/hooks/use-localization';
import { useEffect, useState } from 'react';
import { getPublishedPosts } from '@/lib/actions';
import type { Post } from '@/types';


export default function BlogPage() {
  const { t } = useLocalization();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const postsData = await getPublishedPosts();
      setPosts(postsData);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

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
       {isLoading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="flex flex-col bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
                <Image
                    src={post.featuredImageUrl || 'https://placehold.co/800x400.png'}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint="technology abstract"
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
                            <AvatarImage src={'https://placehold.co/100x100.png'} alt={'CIDEACC Team'} data-ai-hint={'organization logo'}/>
                            <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">CIDEACC Team</p>
                            <p className="text-sm text-muted-foreground">{post.createdAt?.toDate().toLocaleDateString()}</p>
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
        )}
    </div>
  );
}
