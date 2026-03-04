"use client";

import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  filename: string;
  progress: number;
  error?: string;
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.md', '.markdown'];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface UploadZoneProps {
  onUploadComplete?: (documentId: string, filename: string) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [upload, setUpload] = useState<UploadState>({ status: 'idle', filename: '', progress: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const isValidExt = ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isValidExt) {
      return { valid: false, error: 'Invalid file type. Only PDF and Markdown files are supported.' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File too large. Max size is 20MB.` };
    }
    return { valid: true };
  };

  const uploadFile = async (file: File) => {
    setUpload({ status: 'uploading', filename: file.name, progress: 50 });
    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/v1/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'Upload failed');
      }

      const data = await res.json();
      console.log('Uploaded successfully. Document ID:', data.documentId);
localStorage.setItem('docmind_document_id', data.documentId);
if (onUploadComplete) onUploadComplete(data.documentId, file.name);
      setUpload({ status: 'success', filename: file.name, progress: 100 });
    } catch (err: any) {
      setUpload({ status: 'error', filename: file.name, progress: 0, error: err.message || 'Upload failed. Please try again.' });
    }
  };

  const handleFile = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setUpload({ status: 'error', filename: file.name, progress: 0, error: validation.error });
      return;
    }
    uploadFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const resetUpload = () => {
    setUpload({ status: 'idle', filename: '', progress: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {upload.status === 'idle' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.md,.markdown"
            className="hidden"
          />
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Drop your PDF or Markdown file here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
            Choose File
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Max file size: 20MB · Supported: PDF, Markdown</p>
        </div>
      )}

      {upload.status === 'uploading' && (
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-foreground">{upload.filename}</p>
            <span className="text-xs text-muted-foreground">{upload.progress}%</span>
          </div>
          <Progress value={upload.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-3">Uploading...</p>
        </div>
      )}

      {upload.status === 'success' && (
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{upload.filename}</p>
              <p className="text-sm text-green-600">Uploaded successfully</p>
            </div>
            <Button onClick={resetUpload} variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your document has been uploaded. Navigate to other panels to view diagrams, findings, and summaries.
          </p>
        </div>
      )}

      {upload.status === 'error' && (
        <div className="bg-card border border-destructive rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{upload.filename}</p>
              <p className="text-sm text-destructive">{upload.error}</p>
            </div>
            <Button onClick={resetUpload} variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}