'use client';

import React, { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow" className="text-center">
        <div className="h-12 w-12 rounded-xl bg-status-error/10 border border-status-error/30 flex items-center justify-center text-status-error mx-auto mb-6">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-status-error mb-2">
          SYSTEM EXCEPTION
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          Unexpected Runtime Interrupt
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto mb-8 leading-relaxed">
          An error occurred while rendering this interface. Our telemetry systems have logged the event.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </Button>
          <Button href="/" variant="outline" size="md">
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
