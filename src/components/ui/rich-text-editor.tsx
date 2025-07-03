'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Escribe tu contenido aquí...", 
  height = 400 
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  // Configuración simplificada de TinyMCE - solo plugins que funcionan
  const editorConfig = {
    height: height,
    menubar: false,
    branding: false,
    statusbar: false,
    
    // Solo plugins que no requieren archivos externos
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    
    toolbar: [
      'undo redo | formatselect | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help'
    ].join(' | '),
    
    // Configuración para mantener el formato de Word
    paste_data_images: true,
    paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td,th",
    paste_retain_style_properties: "all",
    paste_auto_cleanup_on_paste: false,
    paste_enable_default_filters: false,
    paste_filter_drop: false,
    paste_remove_styles: false,
    paste_remove_styles_if_webkit: false,
    paste_strip_class_attributes: false,
    
    // Configuración de contenido
    forced_root_block: 'p',
    force_br_newlines: false,
    force_p_newlines: false,
    convert_newlines_to_brs: false,
    remove_linebreaks: false,
    
    // Configuración visual para tema oscuro
    skin: 'oxide-dark',
    content_css: 'dark',
    
    // Configuración de estilo del contenido
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: 16px; 
        line-height: 1.6; 
        color: #ffffff;
        background-color: #1a1a1a;
        margin: 1rem;
      }
      h1, h2, h3, h4, h5, h6 { 
        margin-top: 1.5em; 
        margin-bottom: 0.5em; 
        font-weight: 600; 
      }
      p { margin-bottom: 1em; }
      blockquote { 
        border-left: 4px solid #00d4ff; 
        padding-left: 1em; 
        margin: 1em 0; 
        background-color: #2a2a2a; 
        padding: 1em; 
        border-radius: 8px; 
      }
      img { 
        max-width: 100%; 
        height: auto; 
        border-radius: 8px; 
        margin: 1em 0; 
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      table td, table th {
        border: 1px solid #444;
        padding: 8px 12px;
      }
      table th {
        background-color: #333;
        font-weight: 600;
      }
      ul, ol { 
        padding-left: 1.5em; 
        margin-bottom: 1em; 
      }
      li { margin-bottom: 0.5em; }
      a { color: #00d4ff; text-decoration: underline; }
      strong { font-weight: 600; }
      code { 
        background-color: #333; 
        padding: 2px 4px; 
        border-radius: 4px; 
        font-family: 'Courier New', monospace; 
      }
    `,
    
    // Eventos
    setup: (editor: any) => {
      editor.on('init', () => {
        console.log('TinyMCE editor initialized');
      });
      
      editor.on('change', () => {
        const content = editor.getContent();
        onChange(content);
      });

      // Mejorar el pegado desde Word
      editor.on('paste', (e: any) => {
        console.log('Pasting content from clipboard');
      });
    },
    
    // Configuración adicional para Word
    paste_webkit_styles: "all",
    paste_merge_formats: true,
    smart_paste: true,
    
    // Permitir todos los elementos HTML para Word
    valid_elements: '*[*]',
    valid_children: '+body[style],+p[span|strong|em|a|img]',
    extended_valid_elements: 'span[*],div[*],p[*],strong[*],em[*],b[*],i[*],u[*],s[*],sub[*],sup[*],h1[*],h2[*],h3[*],h4[*],h5[*],h6[*],ul[*],ol[*],li[*],a[*],img[*],table[*],tr[*],td[*],th[*],tbody[*],thead[*],tfoot[*]',
    
    // Configuración de imagen
    image_advtab: true,
    image_caption: true,
    image_description: false,
    image_dimensions: false,
    image_title: true,
    
    // Configuración de tabla
    table_use_colgroups: true,
    table_sizing_mode: 'fixed',
    table_default_attributes: {
      border: '1'
    },
    table_default_styles: {
      'border-collapse': 'collapse'
    }
  };

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        init={editorConfig}
        onEditorChange={(content) => onChange(content)}
      />
    </div>
  );
}