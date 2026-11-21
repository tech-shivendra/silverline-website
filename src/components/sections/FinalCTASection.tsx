import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { ArrowUpRight } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-24 md:py-36 bg-background-primary relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-silver">
              START A CONVERSATION
            </span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Have something in mind?
          </h2>

          <p className="text-base sm:text-xl text-muted max-w-xl mx-auto leading-relaxed mb-10">
            Every great product begins with a conversation. Tell us what you're thinking and let's explore what we can build together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2 group"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              href="/playground"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Configure in Product Architect
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
