'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { createPost, updatePost } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Post } from '@/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres.').max(150),
  excerpt: z.string().min(10, 'El extracto debe tener al menos 10 caracteres.').max(300),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres.'),
  status: z.enum(['draft', 'published']),
  category: z.string().min(1, 'Debes seleccionar una categoría.'),
  newCategory: z.string().optional(),
}).refine(data => {
    if (data.category === 'new_category') {
        return !!data.newCategory && data.newCategory.length > 1;
    }
    return true;
}, {
    message: 'El nombre de la nueva categoría es requerido.',
    path: ['newCategory'],
});

interface PostFormProps {
  postToEdit?: Post;
}

export function PostForm({ postToEdit }: PostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(postToEdit?.featuredImageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: postToEdit?.title || '',
      excerpt: postToEdit?.excerpt || '',
      content: postToEdit?.content || '',
      status: postToEdit?.status || 'draft',
      category: postToEdit?.categories?.[0] || '',
      newCategory: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setCategories(cats);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const imageInput = document.getElementById('featuredImage') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.append('featuredImage', imageInput.files[0]);
    } else if (!postToEdit) {
      toast({ variant: 'destructive', title: 'Error', description: 'La imagen destacada es requerida.' });
      setIsLoading(false);
      return;
    }

    try {
      if (postToEdit) {
        await updatePost(postToEdit.id, formData);
        toast({ title: '¡Éxito!', description: 'Publicación actualizada correctamente.' });
      } else {
        await createPost(formData);
        toast({ title: '¡Éxito!', description: 'Publicación creada correctamente.' });
      }
      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Contenido Principal</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la Publicación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Avances en IA para Diagnóstico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extracto / Resumen</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Un breve resumen que aparecerá en las miniaturas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido Principal</FormLabel>
                       <FormDescription>
                        Puedes usar Markdown para formatear el texto. Para una experiencia de edición avanzada, se puede integrar un Editor de Texto Enriquecido.
                      </FormDescription>
                      <FormControl>
                        <Textarea placeholder="Escribe el contenido completo del artículo aquí..." {...field} rows={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader><CardTitle>Detalles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setShowNewCategory(value === 'new_category');
                      }} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                            <SelectItem value="new_category">Crear nueva categoría</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showNewCategory && (
                    <FormField
                        control={form.control}
                        name="newCategory"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la Nueva Categoría</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Ética en IA" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
              </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Imagen Destacada</CardTitle></CardHeader>
                <CardContent>
                    <FormItem>
                        <FormLabel htmlFor="featuredImage" className={cn("cursor-pointer", !imagePreview && "block border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center")}>
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Vista previa" width={300} height={150} className="w-full h-auto rounded-md object-cover" />
                            ) : (
                                <span>Haz clic para subir una imagen</span>
                            )}
                        </FormLabel>
                        <FormControl>
                            <Input id="featuredImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Guardando...' : (postToEdit ? 'Actualizar Publicación' : 'Crear Publicación')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
