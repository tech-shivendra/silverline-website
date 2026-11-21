import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/animations/Reveal';
import { servicesData } from '@/data/services';
import {
  Compass,
  Palette,
  Globe,
  Smartphone,
  Server,
  Cpu,
  Zap,
  Activity,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import { Service } from '@/types';

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

interface ServicesSectionProps {
  initialServices?: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ initialServices }) => {
  const services = initialServices && initialServices.length > 0 ? initialServices : servicesData.filter((s) => s.published);

  return (
    <section id="services" className="py-24 md:py-32 bg-background-primary relative">
      <Container>
        <SectionHeading
          eyebrow="ENGINEERING CAPABILITIES"
          title="Full-Lifecycle Product Development."
          description="From early conceptual feasibility to high-concurrency production architectures, we build across the modern software engineering continuum."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <Reveal key={service.id} delay={index * 0.08}>
                <Card className="h-full flex flex-col justify-between hover:border-silver/50 transition-all duration-300">
                  <div>
                    {/* Icon & Index */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-11 w-11 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent-blue group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs text-muted-dark font-medium">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-silver-light transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Capabilities bullets */}
                    <ul className="space-y-2 border-t border-border pt-4 mb-6">
                      {service.capabilities.slice(0, 3).map((cap, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-silver">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom CTA */}
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-silver hover:text-white gap-1.5 transition-colors pt-2"
                  >
                    <span>Inquire Service</span>
                    <ArrowRight className="h-3.5 w-3.5 text-accent-blue" />
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Global Services CTA */}
        <div className="mt-14 text-center">
          <Button href="/services" variant="secondary" size="md">
            Explore Detailed Capabilities & Architecture
          </Button>
        </div>
      </Container>
    </section>
  );
};
