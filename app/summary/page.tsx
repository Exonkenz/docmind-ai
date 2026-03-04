"use client";

import { useEffect, useState } from 'react';
import { SummaryPanel } from '@/components/summary-panel';

export default function SummaryPage() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('docmind_document_id');
    if (stored) setDocumentId(stored);
  }, []);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-8">
        AI-generated summaries of your document at different reading levels.
      </p>
      {!documentId && (
        <div className="border rounded-lg p-12 text-center text-muted-foreground">
          No document uploaded yet. Go to the Upload page first.
        </div>
      )}
      {documentId && <SummaryPanel documentId={documentId} />}
    </div>
  );
}