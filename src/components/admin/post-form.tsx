'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { createOrUpdatePostViaFunction } from '@/lib/client-actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres.').max(150),
  excerpt: z.string().min(10, 'El extracto debe tener al menos 10 caracteres.').max(300),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres.'),
  status: z.enum(['draft', 'published']),
  category: z.string().min(1, 'Debes seleccionar una categoría.'),
  newCategory: z.string().optional(),
}).refine(data => {
  if (data.category === 'new' && (!data.newCategory || data.newCategory.length < 2)) {
    return false;
  }
  return true;
}, {
  message: 'El nombre de la nueva categoría es requerido y debe tener al menos 2 caracteres.',
  path: ['newCategory'],
});

interface PostFormProps {
  postToEdit?: any;
  categories?: string[];
}

export function PostForm({ postToEdit, categories = [] }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    postToEdit?.featuredImageUrl || null
  );
  const { toast } = useToast();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const result = await createOrUpdatePostViaFunction(
        {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          status: values.status,
          category: values.category === 'new' ? values.newCategory || '' : values.category,
          newCategory: values.category === 'new' ? values.newCategory : undefined,
        },
        selectedImage || undefined,
        postToEdit?.id
      );

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: postToEdit ? 'Publicación actualizada correctamente' : 'Publicación creada correctamente',
        });
        
        // Resetear el formulario si es una nueva publicación
        if (!postToEdit) {
          form.reset();
          setSelectedImage(null);
          setImagePreview(null);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al procesar la publicación',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Contenido */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de la publicación" {...field} />
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
                      <FormLabel>Extracto</FormLabel>
                      <FormControl>
                        <Input placeholder="Breve descripción de la publicación" {...field} />
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
                      <FormLabel>Contenido</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Escribe el contenido de tu publicación aquí. Puedes pegar contenido directamente desde Word..."
                          height={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral - Configuración */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">+ Nueva categoría</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('category') === 'new' && (
                  <FormField
                    control={form.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva Categoría</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la nueva categoría" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagen Destacada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Selecciona una imagen destacada
                      </p>
                    </div>
                  )}
                  
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />

                  {uploadProgress !== null && (
                    <div className="mt-4 space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        {uploadProgress < 100 ? `Subiendo: ${Math.round(uploadProgress)}%` : 'Subida completada'}
                      </p>
                    </div>
                  )}
                </div>
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
