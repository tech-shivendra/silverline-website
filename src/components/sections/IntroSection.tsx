import React from 'react';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/siteConfig';
import { Reveal } from '@/components/animations/Reveal';

export const IntroSection: React.FC = () => {
  return (
    <section id="introduction" className="py-24 md:py-32 bg-background-primary relative">
      <Container>
        {/* Section Heading */}
        <Reveal>
          <div className="max-w-4xl mb-16 md:mb-24">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-silver">
                OUR PHILOSOPHY
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              {siteConfig.philosophyHeading}
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
              We operate at the convergence of design precision and resilient engineering. We do not build throwaway prototypes or generic agency templates — we architect enduring digital assets.
            </p>
          </div>
        </Reveal>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-border">
          {siteConfig.principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 0.15}>
              <div className="relative group p-6 rounded-xl bg-surface/40 border border-border/80 hover:border-silver/40 transition-all duration-300">
                <div className="font-mono text-xs font-semibold text-accent-blue mb-4 tracking-widest">
                  {principle.number} — PRINCIPLE
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
