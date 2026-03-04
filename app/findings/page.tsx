"use client";

import { useEffect, useState } from 'react';
import { FindingsPanel } from '@/components/findings-panel';

export default function FindingsPage() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('docmind_document_id');
    if (stored) setDocumentId(stored);
  }, []);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-8">
        Automatically detected risks, dependencies, and issues in your document.
      </p>
      {!documentId && (
        <div className="border rounded-lg p-12 text-center text-muted-foreground">
          No document uploaded yet. Go to the Upload page first.
        </div>
      )}
      {documentId && <FindingsPanel documentId={documentId} />}
    </div>
  );
}