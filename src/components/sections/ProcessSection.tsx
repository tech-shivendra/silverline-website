import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/data/siteConfig';
import { Reveal } from '@/components/animations/Reveal';

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-background-primary relative">
      <Container>
        <SectionHeading
          eyebrow="HOW WE BUILD"
          title="Clarity in process. Precision in execution."
          description="Every successful product follows a disciplined journey from user discovery to production telemetry."
        />

        {/* Timeline Stages */}
        <div className="relative border-l border-border md:border-l-0 md:grid md:grid-cols-5 md:gap-6 pl-6 md:pl-0">
          {siteConfig.process.map((stage, index) => (
            <Reveal key={stage.number} delay={index * 0.1}>
              <div className="relative mb-10 md:mb-0 group">
                {/* Timeline node marker for mobile */}
                <div className="md:hidden absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-background-primary border-2 border-accent-blue" />

                {/* Horizontal line marker for desktop */}
                <div className="hidden md:flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-accent-blue" />
                  <div className="h-[1px] flex-1 bg-border group-last:bg-transparent" />
                </div>

                <div className="p-5 rounded-xl bg-surface/40 border border-border/70 hover:border-silver/40 transition-all duration-300">
                  <div className="font-mono text-xs font-semibold text-accent-blue mb-2">
                    {stage.number} — STAGE
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
