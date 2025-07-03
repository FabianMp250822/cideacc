'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Eye, 
  Share2,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getStudyById, incrementDownloadCount, type Study } from '@/lib/actions';
import Link from 'next/link';
import Image from 'next/image';

export default function StudyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [study, setStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadStudy = async () => {
      if (!params.id) return;
      
      try {
        const studyData = await getStudyById(params.id as string);
        setStudy(studyData);
      } catch (error) {
        console.error('Error loading study:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudy();
  }, [params.id]);

  const getCategoryColor = (category: string) => {
    const colors = {
      innovation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      impact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      research: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'case-study': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[category as keyof typeof colors] || colors.research;
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

  const handleDownload = async () => {
    if (!study) return;
    
    setIsDownloading(true);
    try {
      // Incrementar contador de descargas
      await incrementDownloadCount(study.id);
      
      // Descargar archivo
      const response = await fetch(study.pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${study.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Actualizar contador local
      setStudy(prev => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
    } catch (error) {
      console.error('Error downloading study:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!study) return;
    
    const shareData = {
      title: study.title,
      text: study.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando estudio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Estudio no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El estudio que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link href="/impact">
              Volver a Impacto
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          <span className="mx-2">›</span>
          <Link href="/impact" className="hover:text-primary">Impacto</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{study.title}</span>
        </nav>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryColor(study.category)}>
                  {getCategoryLabel(study.category)}
                </Badge>
                {study.featured && (
                  <Badge variant="secondary">Destacado</Badge>
                )}
              </div>
              
              <CardTitle className="text-3xl font-bold leading-tight">
                {study.title}
              </CardTitle>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {study.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(study.publishDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {study.downloadCount} descargas
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {study.description}
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          {study.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visor PDF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vista Previa del Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <iframe
                  src={`${study.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                  width="100%"
                  height="100%"
                  className="border-0"
                  title={study.title}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Si no puedes ver el documento, 
                <Link 
                  href={study.pdfUrl} 
                  target="_blank" 
                  className="text-primary hover:underline ml-1"
                >
                  haz clic aquí para abrirlo en una nueva ventana
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Imagen de portada */}
          {study.thumbnailUrl && (
            <Card>
              <CardContent className="p-0">
                <Image
                  src={study.thumbnailUrl}
                  alt={study.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Descargar PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              
              <Button 
                variant="outline"
                asChild
                className="w-full"
              >
                <Link 
                  href={study.pdfUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Categoría:</span>
                <p className="text-sm text-muted-foreground">
                  {getCategoryLabel(study.category)}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm font-medium">Autor:</span>
                <p className="text-sm text-muted-foreground">{study.author}</p>
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm font-medium">Fecha de publicación:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(study.publishDate).toLocaleDateString('es-ES')}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <span className="text-sm font-medium">Descargas:</span>
                <p className="text-sm text-muted-foreground">{study.downloadCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}