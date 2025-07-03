'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLocalization } from '@/hooks/use-localization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Trash2, Pencil, ExternalLink, Loader2, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post } from '@/types';
import { deletePost } from '@/lib/client-actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StudiesManagement } from '@/components/admin/studies-management';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePost = async (postId: string, imageUrl: string | undefined) => {
    setIsDeleting(postId);
    try {
      await deletePost(postId, imageUrl);
      toast({
        title: 'Publicación eliminada',
        description: 'La publicación ha sido eliminada exitosamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la publicación.',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-muted-foreground md:text-xl">
            {t('admin.dashboard.subtitle')} {user?.email}
          </p>
        </div>
      </header>

      <div className="grid gap-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="studies" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Estudios e Investigaciones
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl">{t('admin.manage_posts.title')}</CardTitle>
                  <CardDescription>{t('admin.manage_posts.description')}</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/create-post">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('admin.manage_posts.new_post')}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="border rounded-lg p-16 text-center border-dashed">
                    <p className="text-muted-foreground">{t('admin.manage_posts.no_posts')}</p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Creado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                              {post.categories?.map(c => <Badge key={c} variant="outline" className="mr-1">{c}</Badge>)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status === 'published' ? 'Publicado' : 'Borrador'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {post.createdAt?.toDate().toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting === post.id}>
                                      {isDeleting === post.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/blog/${post.slug}`} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Ver
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/edit-post/${post.slug}`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                      </Link>
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente la publicación.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePost(post.id, post.featuredImageUrl)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="studies" className="space-y-4">
            <div className="container mx-auto px-4 py-8">
              <StudiesManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
