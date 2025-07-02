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
import {
  manageCategory,
  uploadImage,
  createPostDocument,
  updatePostDocument,
  deleteImage,
  createSlug,
} from '@/lib/client-actions';
import { auth, db } from '@/lib/firebase';
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
import { collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres.').max(150),
  excerpt: z.string().min(10, 'El extracto debe tener al menos 10 caracteres.').max(300),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres.'),
  status: z.enum(['draft', 'published']),
  category: z.string().min(1, 'Debes seleccionar una categoría.'),
  newCategory: z.string().optional(),
}).refine(data => {
    if (data.category === 'new_category') {
        return !!data.newCategory && data.newCategory.trim().length > 1;
    }
    return true;
}, {
    message: 'El nombre de la nueva categoría es requerido y debe tener al menos 2 caracteres.',
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
    const imageInput = document.getElementById('featuredImage') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    // Pre-flight check: If it's a new post, an image is absolutely required.
    if (!postToEdit && !imageFile) {
        toast({
            title: 'Error de validación',
            description: 'La imagen destacada es requerida para crear una nueva publicación.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    setUploadProgress(null);
    let uploadedImageUrl: string | null = null;

    const showToast = (title: string, description?: string, variant?: 'default' | 'destructive') => {
        toast({ title, description, variant });
    };

    try {
      // Step 1: Check authentication
      showToast('Paso 1/4: Verificando autenticación...');
      if (!auth.currentUser) {
        throw new Error('Debes iniciar sesión para realizar esta acción.');
      }
      showToast('Paso 1/4: Autenticación verificada ✓');

      // Step 2: Manage Category
      showToast('Paso 2/4: Gestionando categoría...');
      const finalCategory = await manageCategory(values.category, values.newCategory);
      showToast('Paso 2/4: Categoría procesada ✓');

      let finalImageUrl = postToEdit?.featuredImageUrl || '';
      
      // Step 3: Upload Image if provided
      if (imageFile) {
        setUploadProgress(0);
        showToast('Paso 3/4: Subiendo imagen destacada...');
        if (postToEdit?.featuredImageUrl) {
            await deleteImage(postToEdit.featuredImageUrl);
        }
        finalImageUrl = await uploadImage(imageFile, (progress) => {
            setUploadProgress(progress);
        });
        uploadedImageUrl = finalImageUrl;
        setUploadProgress(100);
        showToast('Paso 3/4: Imagen subida correctamente ✓');
      }

      if (!finalImageUrl) {
        throw new Error('No se pudo obtener la URL de la imagen destacada.');
      }

      // Step 4: Save post data to Firestore
      showToast('Paso 4/4: Guardando datos de la publicación...');
      const slug = createSlug(values.title);
      const postData = {
        title: values.title,
        slug,
        excerpt: values.excerpt,
        content: values.content,
        featuredImageUrl: finalImageUrl,
        status: values.status,
        categories: [finalCategory],
        updatedAt: serverTimestamp(),
      };
      
      if (postToEdit) {
        await updatePostDocument(postToEdit.id, postData);
      } else {
        const createData = {
            ...postData,
            viewsCount: 0,
            likesCount: 0,
            authorId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
        }
        await createPostDocument(createData);
      }
      showToast('Paso 4/4: Publicación guardada en la base de datos ✓');

      showToast(
        '¡Proceso completado!',
        postToEdit ? 'Publicación actualizada correctamente.' : 'Publicación creada correctamente.',
        'default'
      );
      
      router.push('/admin/dashboard');

    } catch (error) {
      showToast(
        '¡Error en el proceso!',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
        'destructive'
      );
      if (uploadedImageUrl) {
        showToast('Revirtiendo subida de imagen...');
        await deleteImage(uploadedImageUrl);
        showToast('Reversión completada.');
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
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
                        <Input placeholder="Ej: Avances en IA para Diagnóstico" {...field} disabled={isLoading} />
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
                        <Textarea placeholder="Un breve resumen que aparecerá en las miniaturas..." {...field} disabled={isLoading}/>
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
                        <Textarea placeholder="Escribe el contenido completo del artículo aquí..." {...field} rows={15} disabled={isLoading}/>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
                      }} defaultValue={field.value} disabled={isLoading}>
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
                                <Input placeholder="Ej: Ética en IA" {...field} disabled={isLoading} />
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
                            <Input id="featuredImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                     {uploadProgress !== null && (
                        <div className="mt-4 space-y-2">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground text-center">
                                {uploadProgress < 100 ? `Subiendo: ${Math.round(uploadProgress)}%` : 'Subida completada'}
                            </p>
                        </div>
                    )}
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
