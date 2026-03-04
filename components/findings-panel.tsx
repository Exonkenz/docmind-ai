"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Finding {
  type: string;
  severity: Severity;
  excerpt: string;
  recommendation: string;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-gray-100 text-gray-800 border-gray-300',
};

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

interface FindingsPanelProps {
  documentId?: string;
}

export function FindingsPanel({ documentId }: FindingsPanelProps) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!documentId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    setLoading(true);

    fetch(`${apiUrl}/api/v1/documents/${documentId}/findings`)
      .then(r => r.json())
      .then(data => {
        const sorted = (data.findings || []).sort((a: Finding, b: Finding) =>
          SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
        );
        setFindings(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not connect to the server. Make sure the backend is running on port 3001.');
        setLoading(false);
      });
  }, [documentId]);

  const filtered = filter === 'all'
    ? findings
    : findings.filter(f => f.severity === filter);

  if (!documentId) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Upload a document to see findings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Loading findings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <Info className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No risks detected in this document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:border-primary'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} finding{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.map((finding, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm font-medium text-foreground capitalize">
              {finding.type.replace(/_/g, ' ')}
            </span>
            <Badge variant="outline" className={SEVERITY_COLORS[finding.severity]}>
              {finding.severity}
            </Badge>
          </div>
          <blockquote className="border-l-4 border-border pl-3 text-sm text-muted-foreground italic mb-3">
            {finding.excerpt}
          </blockquote>
          <p className="text-sm text-foreground">
            <span className="font-medium">Recommendation: </span>
            {finding.recommendation}
          </p>
        </div>
      ))}
    </div>
  );
}