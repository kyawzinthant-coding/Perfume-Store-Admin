import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { Input } from './ui/input';

interface ImageUploadProps {
  value: File | string | null | undefined;
  onChange: (value: File | string | null) => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle preview generation when value changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    // If value is a string (URL), use it directly as preview
    if (typeof value === 'string') {
      setPreview(value);
      return;
    }

    // If value is a File, generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(value);
  }, [value]);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const selectedFile = selectedFiles[0];
    onChange(selectedFile);
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <div className="text-sm font-medium">
            <span className="text-primary">Click to upload</span> or drag and
            drop
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </div>
      ) : (
        <div className="relative group rounded-md overflow-hidden border">
          <div className=" relative flex items-center justify-center">
            <input
              type="image"
              src={preview || '/placeholder.svg'}
              alt="Image preview"
              width={300}
              height={200}
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-7 h-7 opacity-80 hover:opacity-100 transition-opacity"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
