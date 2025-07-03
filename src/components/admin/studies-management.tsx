'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, Download, Eye, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { PDFViewer } from '@/components/ui/pdf-viewer';
import { 
  getStudies, 
  type Study, 
  type StudyFormData 
} from '@/lib/actions';
import { 
  createStudyWithFiles,
  updateStudyWithFiles,
  deleteStudyWithFiles
} from '@/lib/client-actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function StudiesManagement() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const { toast } = useToast();

  // Estados para archivos
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<StudyFormData>({
    title: '',
    description: '',
    category: 'research',
    pdfUrl: '',
    thumbnailUrl: '',
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    featured: false,
  });

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    try {
      const studiesData = await getStudies();
      setStudies(studiesData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error al cargar los estudios',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingStudy) {
        await updateStudyWithFiles(
          editingStudy.id,
          formData,
          pdfFile || undefined,
          thumbnailFile || undefined,
          editingStudy.pdfUrl,
          editingStudy.thumbnailUrl
        );
        toast({
          title: 'Éxito',
          description: 'Estudio actualizado correctamente',
        });
      } else {
        if (!pdfFile) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Debes seleccionar un archivo PDF',
          });
          return;
        }

        await createStudyWithFiles(
          formData,
          pdfFile,
          thumbnailFile || undefined
        );
        toast({
          title: 'Éxito',
          description: 'Estudio creado correctamente',
        });
      }
      
      await loadStudies();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error al guardar el estudio',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (study: Study) => {
    setEditingStudy(study);
    setFormData({
      title: study.title,
      description: study.description,
      category: study.category,
      pdfUrl: study.pdfUrl,
      thumbnailUrl: study.thumbnailUrl || '',
      author: study.author,
      publishDate: study.publishDate,
      tags: study.tags,
      featured: study.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este estudio?')) return;

    try {
      await deleteStudyWithFiles(id);
      toast({
        title: 'Éxito',
        description: 'Estudio eliminado correctamente',
      });
      await loadStudies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error al eliminar el estudio',
      });
    }
  };

  const resetForm = () => {
    setEditingStudy(null);
    setFormData({
      title: '',
      description: '',
      category: 'research',
      pdfUrl: '',
      thumbnailUrl: '',
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
      featured: false,
    });
    setPdfFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      innovation: 'Innovación',
      impact: 'Impacto',
      research: 'Investigación',
      'case-study': 'Caso de Estudio',
    };
    return labels[category as keyof typeof labels] || 'Investigación';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Estudios</h2>
          <p className="text-muted-foreground">
            Administra los estudios e investigaciones que se muestran en la página de impacto
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Estudio
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStudy ? 'Editar Estudio' : 'Crear Nuevo Estudio'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Autor *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="publishDate">Fecha de Publicación *</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: StudyFormData['category']) => 
                        setFormData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="innovation">Innovación</SelectItem>
                        <SelectItem value="impact">Impacto</SelectItem>
                        <SelectItem value="research">Investigación</SelectItem>
                        <SelectItem value="case-study">Caso de Estudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Destacado</Label>
                  </div>
                </div>
                
                {/* Archivos */}
                <div className="space-y-4">
                  <FileUpload
                    label="Archivo PDF *"
                    accept=".pdf,application/pdf"
                    file={pdfFile}
                    onFileChange={setPdfFile}
                    maxSize={50}
                  />
                  
                  <FileUpload
                    label="Imagen de Portada (opcional)"
                    accept="image/*"
                    file={thumbnailFile}
                    onFileChange={handleThumbnailChange}
                    preview={thumbnailPreview}
                    maxSize={5}
                  />
                  
                  {editingStudy?.pdfUrl && (
                    <div>
                      <Label>PDF Actual</Label>
                      <PDFViewer 
                        url={editingStudy.pdfUrl} 
                        title={editingStudy.title}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="AI, Machine Learning, Innovation"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingStudy ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {studies.map((study) => (
          <Card key={study.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{study.title}</h3>
                    {study.featured && (
                      <Badge variant="secondary">Destacado</Badge>
                    )}
                    <Badge variant="outline">
                      {getCategoryLabel(study.category)}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {study.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span>Por: {study.author}</span>
                    <span>{new Date(study.publishDate).toLocaleDateString('es-ES')}</span>
                    <span>{study.downloadCount} descargas</span>
                  </div>
                  
                  {study.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {study.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <PDFViewer 
                    url={study.pdfUrl} 
                    title={study.title}
                  />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(study)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(study.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {studies.length === 0 && (
          <Card className="text-center p-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay estudios</h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando tu primer estudio o investigación
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}