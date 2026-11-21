import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { Sliders, Terminal, Gamepad2, ArrowRight } from 'lucide-react';

export const PlaygroundTeaserSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-background-primary relative">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="INTERACTIVE LAB"
            title="The SilverLine Playground."
            description="Experience our design and engineering philosophy firsthand with interactive tools, developer terminals, and micro-games."
            className="mb-0"
          />
          <div className="mt-6 md:mt-0">
            <Button href="/playground" variant="outline" size="md">
              Enter Full Playground
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool 1: Product Architect */}
          <Reveal delay={0.1}>
            <Card className="h-full flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent-blue mb-6 group-hover:scale-105 transition-transform">
                  <Sliders className="h-6 w-6" />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-muted-dark mb-2">
                  CONFIGURATOR
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  Product Architect
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Select product type, architecture preferences, platform targets, and features to generate a live product blueprint. Transfer directly to an inquiry.
                </p>
              </div>

              <Link
                href="/playground#architect"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-silver hover:text-white group-hover:text-accent-blue transition-colors"
              >
                <span>Launch Configurator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </Reveal>

          {/* Tool 2: Terminal */}
          <Reveal delay={0.2}>
            <Card className="h-full flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-silver mb-6 group-hover:scale-105 transition-transform">
                  <Terminal className="h-6 w-6" />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-muted-dark mb-2">
                  DEVELOPER CLI
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  Interactive Terminal
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  A sandboxed developer terminal supporting command navigation, history, autocomplete, and quick inspection of our stack and services.
                </p>
              </div>

              <Link
                href="/playground#terminal"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-silver hover:text-white group-hover:text-accent-blue transition-colors"
              >
                <span>Open Terminal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </Reveal>

          {/* Tool 3: Pixel Rush */}
          <Reveal delay={0.3}>
            <Card className="h-full flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-status-success mb-6 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-muted-dark mb-2">
                  MINI ARCADE
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  Pixel Rush Game
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Pilot a starcraft through orbital hazards, harvest silver energy nodes, and compete for the local high score. Built for mobile and desktop.
                </p>
              </div>

              <Link
                href="/playground#arcade"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-silver hover:text-white group-hover:text-status-success transition-colors"
              >
                <span>Play Game</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
