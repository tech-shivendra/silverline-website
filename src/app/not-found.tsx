import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow" className="text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-3">
          ERROR 404 — ROUTE NOT FOUND
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl font-bold text-white mb-6">
          Lost in Coordinates.
        </h1>
        <p className="text-base text-muted max-w-md mx-auto mb-8 leading-relaxed">
          The requested coordinate or project file does not exist or has been relocated to another cluster.
        </p>
        <div className="flex justify-center gap-4">
          <Button href="/" variant="primary" size="md" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Studio Home</span>
          </Button>
          <Button href="/work" variant="outline" size="md">
            Browse All Work
          </Button>
        </div>
      </Container>
    </div>
  );
}
