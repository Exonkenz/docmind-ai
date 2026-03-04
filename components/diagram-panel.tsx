"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface DiagramPanelProps {
  documentId: string;
}

export function DiagramPanel({ documentId }: DiagramPanelProps) {
  const [mermaidSource, setMermaidSource] = useState<string>('');
  const [editSource, setEditSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchDiagram = async () => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/api/v1/documents/${documentId}/diagram`);
      if (!res.ok) throw new Error('Failed to fetch diagram');
      const data = await res.json();
      setMermaidSource(data.mermaidSource);
      setEditSource(data.mermaidSource);
    } catch (err) {
      setError('Could not connect to the server. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchDiagram();
  }, [documentId]);

  useEffect(() => {
    if (!editSource || !diagramRef.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        const { svg } = await mermaid.render('diagram-' + Date.now(), editSource);
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
        setError(null);
      } catch (err) {
        setError('Invalid diagram syntax.');
      }
    }, 500);
  }, [editSource]);

  const handleExportSVG = () => {
    if (!diagramRef.current) return;
    const svg = diagramRef.current.innerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    if (!diagramRef.current) return;
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = svg.clientWidth * scale;
    canvas.height = svg.clientHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-end">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <div className="h-96 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-96 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-end">
        <Button onClick={handleExportSVG} variant="outline" size="sm">Export SVG</Button>
        <Button onClick={handleExportPNG} variant="outline" size="sm">Export PNG</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Edit Mermaid source</p>
          <textarea
            value={editSource}
            onChange={e => setEditSource(e.target.value)}
            className="w-full h-96 text-xs font-mono border border-border rounded-lg p-3 bg-muted resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Preview</p>
          <div
            ref={diagramRef}
            className="border border-border rounded-lg p-4 bg-white min-h-96 overflow-auto"
          />
        </div>
      </div>
    </div>
  );
}