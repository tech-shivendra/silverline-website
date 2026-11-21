import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductArchitect } from '@/components/playground/ProductArchitect';
import { InteractiveTerminal } from '@/components/playground/InteractiveTerminal';
import { PixelRushGame } from '@/components/playground/PixelRushGame';

export const metadata: Metadata = {
  title: 'Interactive Playground & Lab',
  description: 'Experience SilverLine Studio engineering firsthand: Product Architect, Developer Terminal, and Pixel Rush arcade.'
};

export default function PlaygroundPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="ENGINEERING PLAYGROUND"
          title="Interactive Product Systems."
          description="Our studio is built by engineers who love creating. Explore our live configurator, browser developer CLI, and interactive experiments."
        />

        <div className="space-y-24">
          {/* Section 1: Product Architect */}
          <section>
            <div className="mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-blue block mb-1">
                EXPERIENCE 01
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Product Architect Configurator
              </h2>
              <p className="text-sm text-muted mt-1">
                Design and scope your application concept. Generates a live blueprint and transfers directly into our inquiry system.
              </p>
            </div>
            <ProductArchitect />
          </section>

          {/* Section 2: Developer Terminal */}
          <section>
            <div className="mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-silver block mb-1">
                EXPERIENCE 02
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Interactive Developer Terminal
              </h2>
              <p className="text-sm text-muted mt-1">
                A sandbox command-line interface with history, autocomplete, and inspectable studio commands.
              </p>
            </div>
            <InteractiveTerminal />
          </section>

          {/* Section 3: Pixel Rush Arcade */}
          <section>
            <div className="mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-status-success block mb-1">
                EXPERIENCE 03
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Pixel Rush Micro-Arcade
              </h2>
              <p className="text-sm text-muted mt-1">
                A high-frame-rate canvas game demonstrating responsive collision mechanics, state management, and web audio synthesis.
              </p>
            </div>
            <PixelRushGame />
          </section>
        </div>
      </Container>
    </div>
  );
}
