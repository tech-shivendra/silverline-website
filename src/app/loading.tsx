import React from 'react';
import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow" className="text-center flex flex-col items-center">
        <div className="relative h-12 w-12 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-border border-t-accent-blue animate-spin" />
          <div className="absolute inset-2 rounded-full border border-silver/20" />
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-silver animate-pulse">
          Synchronizing SilverLine Data...
        </div>
      </Container>
    </div>
  );
}
