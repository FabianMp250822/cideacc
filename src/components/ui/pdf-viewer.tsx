'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, ExternalLink } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
  className?: string;
}

export function PDFViewer({ url, title, className }: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver PDF
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`${url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={title}
              />
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>

        <Button variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir en nueva pestaña
          </a>
        </Button>
      </div>
    </div>
  );
}