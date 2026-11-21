'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Reveal } from '@/components/animations/Reveal';
import { projectsData } from '@/data/projects';
import { ArrowUpRight } from 'lucide-react';

export const SelectedProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filterTabs = [
    { id: 'All', label: 'All' },
    { id: 'Web Applications', label: 'Web' },
    { id: 'Mobile Applications', label: 'Mobile' },
    { id: 'SaaS', label: 'SaaS' },
    { id: 'AI & Automation', label: 'AI' },
    { id: 'Experimental Concepts', label: 'Experiments' }
  ];

  const filteredProjects = projectsData.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="work" className="py-24 md:py-32 bg-background-secondary relative border-t border-border/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="SELECTED CASE STUDIES"
            title="Engineered for Impact."
            description="Explore production platforms, decentralized engines, and experimental laboratories built with meticulous attention to detail."
            className="mb-0"
          />

          <div className="mt-6 md:mt-0">
            <Tabs
              tabs={filterTabs}
              activeTab={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.1}>
              <Link
                href={`/work/${project.slug}`}
                className="group block relative rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 hover:border-silver/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
              >
                {/* Visual Cover Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-elevated">
                  {project.thumbnail_url && (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  {/* Status overlay badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="status" status={project.project_status} />
                  </div>
                  {/* Category overlay badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="category">{project.category}</Badge>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-silver-light transition-colors">
                      {project.title}
                    </h3>
                    <div className="p-2 rounded-lg bg-surface-elevated text-muted group-hover:text-white group-hover:bg-accent-blue/10 transition-colors shrink-0">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-2">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="tech">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-[11px] font-mono text-muted-dark self-center">
                        +{project.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* View all work CTA */}
        <div className="mt-14 text-center">
          <Button href="/work" variant="outline" size="lg">
            View All Projects & Architecture
          </Button>
        </div>
      </Container>
    </section>
  );
};
