import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { servicesData } from '@/data/services';
import { projectsData } from '@/data/projects';
import {
  Compass,
  Palette,
  Globe,
  Smartphone,
  Server,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering & Product Services',
  description: 'Full-lifecycle software engineering, product strategy, UI/UX design, and AI integration capabilities.'
};

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Palette,
  Globe,
  Smartphone,
  Server,
  Cpu,
  Zap,
  Activity
};

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="STUDIO CAPABILITIES"
          title="From First Concept to Scaled Production."
          description="We provide comprehensive digital product capabilities designed to de-risk engineering and accelerate market delivery."
        />

        <div className="space-y-12 mb-20">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.icon] || Globe;
            // Related project sample
            const relatedProject = projectsData.find(p => p.tech_stack.some(t => service.title.toLowerCase().includes(t.toLowerCase())) || p.featured);

            return (
              <div
                key={service.id}
                id={service.slug}
                className="p-8 sm:p-10 rounded-2xl bg-surface border border-border hover:border-silver/40 transition-all duration-300 scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Title & Description (5 cols) */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent-blue">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs text-muted-dark">
                        CAPABILITY 0{index + 1}
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
                      {service.title}
                    </h2>

                    <p className="text-sm text-muted leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <Button
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      variant="primary"
                      size="sm"
                      className="gap-2"
                    >
                      <span>Inquire {service.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Right Capabilities & Details (7 cols) */}
                  <div className="lg:col-span-7 bg-surface-elevated/40 border border-border/80 rounded-xl p-6 sm:p-8">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-silver mb-4">
                      WHAT WE DELIVER
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {service.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-silver">
                          <CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    {relatedProject && (
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="font-mono text-xs text-muted">
                          Featured Reference:
                        </span>
                        <Link
                          href={`/work/${relatedProject.slug}`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-accent-blue hover:underline"
                        >
                          <span>{relatedProject.title}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="p-10 rounded-2xl bg-surface-elevated border border-silver/30 text-center max-w-3xl mx-auto">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Not sure which capability fits your idea?
          </h3>
          <p className="text-sm text-muted mb-6">
            Explore our interactive Product Architect configurator or schedule an exploratory architectural call.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/playground" variant="primary" size="md">
              Launch Product Architect
            </Button>
            <Button href="/contact" variant="outline" size="md">
              Contact Studio
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
