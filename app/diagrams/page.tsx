"use client";

import { useEffect, useState } from 'react';
import { DiagramPanel } from '@/components/diagram-panel';

export default function DiagramsPage() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('docmind_document_id');
    if (stored) setDocumentId(stored);
  }, []);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-8">
        Auto-generated flow diagram from your document workflows.
      </p>
      {!documentId && (
        <div className="border rounded-lg p-12 text-center text-muted-foreground">
          No document uploaded yet. Go to the Upload page first.
        </div>
      )}
      {documentId && <DiagramPanel documentId={documentId} />}
    </div>
  );
}