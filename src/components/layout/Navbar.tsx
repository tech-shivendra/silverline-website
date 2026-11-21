'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/siteConfig';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background-primary/80 backdrop-blur-md border-b border-border/80 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
            : 'bg-transparent py-5'
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 bg-surface/50 border border-border/60 rounded-full px-4 py-1.5 backdrop-blur-md"
            aria-label="Main Navigation"
          >
            {siteConfig.navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors relative',
                    isActive
                      ? 'text-white font-medium'
                      : 'text-muted hover:text-white'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute inset-0 bg-surface-elevated border border-silver/20 rounded-full -z-10" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href="/contact"
              variant="metallic"
              size="sm"
              className="gap-1.5"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-accent-blue" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-silver hover:text-white hover:bg-surface border border-border"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>
      </header>

      {/* Mobile Full-Screen Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background-primary/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-12 flex flex-col justify-between animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Navigation
            </span>
            {siteConfig.navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-3 text-2xl font-heading font-medium tracking-tight border-b border-border/50 flex items-center justify-between',
                    isActive ? 'text-white' : 'text-muted hover:text-silver'
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-accent-blue" />}
                </Link>
              );
            })}
          </div>

          <div className="space-y-4 pt-6">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              Start a Project
            </Button>
            <div className="flex justify-between items-center text-xs font-mono text-muted pt-4 border-t border-border">
              <span>{siteConfig.links.email}</span>
              <span>Available Globally</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
