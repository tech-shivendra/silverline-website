'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project, ProjectCategory } from '@/types';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Search } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

interface WorkPortfolioViewProps {
  initialProjects: Project[];
}

export const WorkPortfolioView: React.FC<WorkPortfolioViewProps> = ({
  initialProjects
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { id: 'All', label: 'All', count: initialProjects.length },
    { id: 'Web Applications', label: 'Web', count: initialProjects.filter(p => p.category === 'Web Applications').length },
    { id: 'Mobile Applications', label: 'Mobile', count: initialProjects.filter(p => p.category === 'Mobile Applications').length },
    { id: 'SaaS', label: 'SaaS', count: initialProjects.filter(p => p.category === 'SaaS').length },
    { id: 'AI & Automation', label: 'AI', count: initialProjects.filter(p => p.category === 'AI & Automation').length },
    { id: 'Experimental Concepts', label: 'Experiments', count: initialProjects.filter(p => p.category === 'Experimental Concepts').length }
  ];

  const filtered = initialProjects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-2xl bg-surface border border-border">
        <Tabs
          tabs={filterTabs}
          activeTab={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="relative min-w-[240px] px-2 md:px-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tech..."
            className="w-full bg-background-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8">
          <p className="font-mono text-sm text-muted">
            No projects matched your criteria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-mono text-accent-blue hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08}>
              <Link
                href={`/work/${project.slug}`}
                className="group block relative rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 hover:border-silver/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-elevated">
                  {project.thumbnail_url && (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="status" status={project.project_status} />
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="category">{project.category}</Badge>
                  </div>
                </div>

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

                  <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="tech">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};
