'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Image, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  preview?: string;
  className?: string;
  maxSize?: number; // en MB
}

export function FileUpload({ 
  label, 
  accept, 
  file, 
  onFileChange, 
  preview,
  className,
  maxSize = 10 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validar tamaño
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`El archivo es demasiado grande. Máximo ${maxSize}MB.`);
      return;
    }

    // Validar tipo
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return selectedFile.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return selectedFile.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      alert(`Tipo de archivo no válido. Acepta: ${accept}`);
      return;
    }

    onFileChange(selectedFile);
  };

  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (accept.includes('image/')) return <Image className="h-8 w-8" />;
    if (accept.includes('pdf')) return <FileText className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      {file ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon()}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && accept.includes('image/') && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Vista previa" 
                  className="max-w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            'border-dashed border-2 transition-colors cursor-pointer',
            isDragging && 'border-primary bg-primary/10'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {getFileIcon()}
              <div>
                <p className="font-medium">Arrastra tu archivo aquí</p>
                <p className="text-sm text-muted-foreground">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo {maxSize}MB • {accept}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}