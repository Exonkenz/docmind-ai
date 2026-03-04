"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ReadingLevel = 'general' | 'technical' | 'executive';
type Tab = 'tl_dr' | 'executive' | 'technical';

interface Summary {
  tl_dr: string;
  executive: string;
  technical: string;
  level: string;
}

interface SummaryPanelProps {
  documentId: string;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function SummaryPanel({ documentId }: SummaryPanelProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tl_dr');
  const [level, setLevel] = useState<ReadingLevel>('technical');

  const fetchSummary = async (selectedLevel: ReadingLevel) => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(
        `${apiUrl}/api/v1/documents/${documentId}/summary?level=${selectedLevel}`
      );
      if (!res.ok) throw new Error('Failed to fetch summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchSummary(level);
  }, [documentId]);

  const handleLevelChange = (newLevel: ReadingLevel) => {
    setLevel(newLevel);
    fetchSummary(newLevel);
  };

  const handleRegenerate = () => {
    fetchSummary(level);
  };

  const tabs: { key: Tab; label: string; limit: number }[] = [
    { key: 'tl_dr', label: 'TL;DR', limit: 50 },
    { key: 'executive', label: 'Executive', limit: 200 },
    { key: 'technical', label: 'Technical', limit: 500 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Reading level:</span>
          <select
            value={level}
            onChange={e => handleLevelChange(e.target.value as ReadingLevel)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        <Button onClick={handleRegenerate} variant="outline" size="sm" disabled={loading}>
          {loading ? 'Generating...' : 'Regenerate'}
        </Button>
      </div>

      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        {loading && (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          </div>
        )}

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {!loading && !error && summary && (
          <>
            <p className="text-sm text-foreground leading-relaxed">
              {summary[activeTab]}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              {wordCount(summary[activeTab])} words
            </p>
          </>
        )}
      </div>
    </div>
  );
}