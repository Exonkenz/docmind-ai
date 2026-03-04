"use client";

import { useState, useEffect } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { DocumentStatusCard } from '@/components/document-status-card';

interface DocRecord {
  documentId: string;
  filename: string;
  uploadedAt: string;
}

export default function Home() {
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeFilename, setActiveFilename] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('docmind_documents');
    if (stored) {
      const docs = JSON.parse(stored);
      setDocuments(docs);
      if (docs.length > 0) {
        setActiveId(docs[0].documentId);
        setActiveFilename(docs[0].filename);
        localStorage.setItem('docmind_document_id', docs[0].documentId);
      }
    }
  }, []);

  const handleUploadComplete = (documentId: string, filename: string) => {
    const newDoc: DocRecord = {
      documentId,
      filename,
      uploadedAt: new Date().toLocaleTimeString(),
    };

    const updated = [newDoc, ...documents].slice(0, 5); // keep last 5
    setDocuments(updated);
    setActiveId(documentId);
    setActiveFilename(filename);
    localStorage.setItem('docmind_document_id', documentId);
    localStorage.setItem('docmind_documents', JSON.stringify(updated));
  };

  const handleSwitch = (doc: DocRecord) => {
    setActiveId(doc.documentId);
    setActiveFilename(doc.filename);
    localStorage.setItem('docmind_document_id', doc.documentId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Your Document</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a PDF or Markdown document to get started. DocMind will analyze it and generate diagrams, extract dependencies, and create summaries.
        </p>
        <UploadZone onUploadComplete={handleUploadComplete} />
      </div>

      {documents.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Documents</h3>
          <div className="space-y-2">
            {documents.map(doc => (
              <button
                key={doc.documentId}
                onClick={() => handleSwitch(doc)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  activeId === doc.documentId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <p className="text-sm font-medium text-foreground">{doc.filename}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {doc.documentId} · Uploaded at {doc.uploadedAt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeId && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Document Status</h3>
          <DocumentStatusCard
            filename={activeFilename || 'document'}
            documentId={activeId}
          />
        </div>
      )}
    </div>
  );
}