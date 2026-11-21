'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tabs } from '@/components/ui/Tabs';
import { Reveal } from '@/components/animations/Reveal';
import { technologiesData } from '@/data/technologies';
import { TechnologyItem } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface TechEcosystemSectionProps {
  initialTechnologies?: TechnologyItem[];
}

export const TechEcosystemSection: React.FC<TechEcosystemSectionProps> = ({ initialTechnologies }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');

  const technologies = initialTechnologies && initialTechnologies.length > 0 ? initialTechnologies : technologiesData;

  const categories = [
    { id: 'Frontend', label: 'Frontend' },
    { id: 'Backend', label: 'Backend' },
    { id: 'Database and Infrastructure', label: 'Database & Infra' },
    { id: 'Mobile', label: 'Mobile' },
    { id: 'Tools', label: 'Tools' }
  ];

  const filteredTech = technologies.filter(
    (t) => t.category === activeCategory
  );

  return (
    <section className="py-24 md:py-32 bg-background-secondary relative border-t border-border/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="ENGINEERING STACK"
            title="Modern Technology Ecosystem."
            description="We build strictly with battle-tested, high-performance technologies that ensure long-term stability and effortless horizontal scalability."
            className="mb-0"
          />

          <div className="mt-6 md:mt-0">
            <Tabs
              tabs={categories}
              activeTab={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTech.map((tech, index) => (
            <Reveal key={tech.name} delay={index * 0.08}>
              <div className="h-full rounded-xl bg-surface border border-border p-6 hover:border-silver/40 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Tech icon identifier symbol */}
                    <div className="h-10 w-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center font-mono font-bold text-xs text-white group-hover:border-silver/50 group-hover:text-accent-blue transition-colors">
                      {tech.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white">
                        {tech.name}
                      </h3>
                      <span className="font-mono text-[11px] text-muted-dark">
                        {tech.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-4">
                  {tech.role}
                </p>

                {tech.associatedProjects && tech.associatedProjects.length > 0 && (
                  <div className="pt-3 border-t border-border/60">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block mb-1.5">
                      Implemented in:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.associatedProjects.map((pSlug) => (
                        <Link
                          key={pSlug}
                          href={`/work/${pSlug}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-silver hover:text-white px-2 py-0.5 rounded bg-background-secondary border border-border hover:border-silver/30 transition-colors"
                        >
                          <span>{pSlug}</span>
                          <ArrowUpRight className="h-2.5 w-2.5 text-accent-blue" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
