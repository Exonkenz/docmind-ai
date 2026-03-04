'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileText } from 'lucide-react';

type DocumentStatus = 'pending' | 'processing' | 'complete' | 'failed';

const STATUS_COLORS: Record<DocumentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  processing: 'bg-blue-100 text-blue-800 border-blue-300',
  complete: 'bg-green-100 text-green-800 border-green-300',
  failed: 'bg-red-100 text-red-800 border-red-300',
};

const STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  complete: 'Complete',
  failed: 'Failed',
};

interface DocumentStatusCardProps {
  filename?: string;
  documentId?: string;
}

export function DocumentStatusCard({
  filename = 'sample-document.pdf',
  documentId = 'doc-12345',
}: DocumentStatusCardProps) {
  const [status, setStatus] = useState<DocumentStatus>('pending');
  const [message, setMessage] = useState('Document is queued for processing');
const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const poll = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/documents/${documentId}/status`);
        const data = await res.json();
        setStatus(data.status);
        setMessage(data.message);

        if (data.status === 'complete') {
          setReady(true);
        } else if (data.status !== 'failed') {
          setTimeout(poll, 3000);
        }
      } catch (err) {
        console.error('Status poll failed:', err);
setMessage('Could not connect to the server. Make sure the backend is running on port 3001.');
      }
    };

    poll();
  }, [documentId]);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">{filename}</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {documentId}</p>
          </div>
        </div>
        <Badge variant="outline" className={STATUS_COLORS[status]}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4 py-4 border-t border-b border-border">
        <div className="flex-shrink-0">
          {status === 'complete' ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-yellow-300 bg-yellow-50" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {status === 'pending' && 'Waiting to process'}
            {status === 'processing' && 'Analyzing document...'}
            {status === 'complete' && 'Analysis complete'}
            {status === 'failed' && 'Processing failed'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
        </div>
      </div>

      {ready ? (
        <p className="text-xs text-green-600 font-medium">
          ✓ Document ready — check Findings, Summary and Diagrams in the sidebar.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Status updates automatically every 3 seconds
        </p>
      )}
    </div>
  );
}