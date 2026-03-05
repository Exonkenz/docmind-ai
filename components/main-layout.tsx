'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Upload' },
  { href: '/diagrams', label: 'Diagrams' },
  { href: '/findings', label: 'Findings' },
  { href: '/summary', label: 'Summary' },
];

const DATA_PAGES = ['/diagrams', '/findings', '/summary'];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasDocument, setHasDocument] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('docmind_document_id');
    setHasDocument(!!stored);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href;
        const showDot = hasDocument && DATA_PAGES.includes(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {item.label}
            {showDot && (
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r border-border bg-muted/30 p-4 flex-col gap-1">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-foreground">DocMind AI</h1>
          <p className="text-xs text-muted-foreground">Document Intelligence</p>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div>
          <h1 className="text-base font-bold text-foreground">DocMind AI</h1>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-background border-r border-border p-4 flex flex-col gap-1 transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 mt-2">
          <h1 className="text-lg font-bold text-foreground">DocMind AI</h1>
          <p className="text-xs text-muted-foreground">Document Intelligence</p>
        </div>
        <NavLinks />
      </div>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}