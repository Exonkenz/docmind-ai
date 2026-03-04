'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Upload, GitBranch, AlertCircle, BookOpen } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
  { href: '/diagrams', label: 'Diagrams', icon: <GitBranch className="w-4 h-4" /> },
  { href: '/findings', label: 'Findings', icon: <AlertCircle className="w-4 h-4" /> },
  { href: '/summary', label: 'Summary', icon: <BookOpen className="w-4 h-4" /> },
];

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Upload Document',
    description: 'No document selected',
  },
  '/diagrams': {
    title: 'Flow Diagrams',
    description: 'sample-document.pdf',
  },
  '/findings': {
    title: 'Risk Findings',
    description: 'sample-document.pdf',
  },
  '/summary': {
    title: 'Document Summaries',
    description: 'sample-document.pdf',
  },
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] || { title: 'DocMind', description: '' };

  return (
    <div className="flex h-screen bg-background text-foreground flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-sidebar-border bg-sidebar p-6 flex flex-col order-2 lg:order-1">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-sidebar-border">
          <Link href="/" className="block group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-bold text-sidebar-primary-foreground">D</span>
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">DocMind</h1>
            </div>
            <p className="text-xs text-muted-foreground">AI Documentation Parser</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-hover/50 hover:text-sidebar-primary'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-sidebar-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse-subtle" />
            <p className="text-sidebar-foreground/70">Processing...</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col order-1 lg:order-2 bg-background">
        {/* Header */}
        <header className="border-b border-border px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{pageInfo.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{pageInfo.description}</p>
          </div>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
            <Plus className="w-4 h-4" />
            New Document
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
