import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { projectsData } from '@/data/projects';
import { getPublishedProjects, getPublishedProjectBySlug } from '@/lib/cms/content';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Case Study`,
    description: project.description
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  // Related projects
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.featured))
    .slice(0, 2);

  return (
    <article className="py-12 md:py-20">
      <Container size="default">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Work</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="status" status={project.project_status} />
            <Badge variant="category">{project.category}</Badge>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8">
            {project.long_description || project.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            {project.live_url && (
              <Button
                href={project.live_url}
                external
                variant="primary"
                size="md"
                className="gap-2"
              >
                <span>Visit Live Platform</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            {project.github_url && (
              <Button
                href={project.github_url}
                external
                variant="outline"
                size="md"
                className="gap-2"
              >
                <Github className="h-4 w-4" />
                <span>View Source Code</span>
              </Button>
            )}
            <Button
              href={`/contact?projectRef=${encodeURIComponent(project.title)}`}
              variant="metallic"
              size="md"
            >
              Build Something Similar
            </Button>
          </div>
        </div>

        {/* Cover Image Showcase */}
        {project.cover_url && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-elevated border border-border mb-16 shadow-2xl">
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Structured Case Study Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Main Narrative (8 columns) */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Problem Statement */}
            {project.problem_statement && (
              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">
                    01 — THE CHALLENGE
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-4">
                  Problem Statement
                </h2>
                <p className="text-muted leading-relaxed">
                  {project.problem_statement}
                </p>
              </div>
            )}

            {/* 2. Objectives & Solution */}
            {(project.objectives || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.objectives && (
                  <div className="p-6 rounded-2xl bg-surface border border-border">
                    <div className="font-mono text-xs uppercase tracking-widest text-silver mb-2">
                      02 — OBJECTIVES
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-3">
                      Target Goals
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {project.objectives}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-6 rounded-2xl bg-surface border border-border">
                    <div className="font-mono text-xs uppercase tracking-widest text-status-success mb-2">
                      03 — THE SOLUTION
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white mb-3">
                      Engineered Outcome
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Design Approach & Architecture */}
            {(project.design_approach || project.architecture) && (
              <div className="p-8 rounded-2xl bg-surface border border-border space-y-8">
                {project.design_approach && (
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-2">
                      04 — VISUAL CRAFT
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-white mb-3">
                      Design Approach
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {project.design_approach}
                    </p>
                  </div>
                )}

                {project.architecture && (
                  <div className="pt-6 border-t border-border">
                    <div className="font-mono text-xs uppercase tracking-widest text-silver mb-2">
                      05 — TECHNICAL INFRASTRUCTURE
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-white mb-3">
                      System Architecture
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {project.architecture}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Major Features */}
            {project.major_features && project.major_features.length > 0 && (
              <div className="p-8 rounded-2xl bg-surface border border-border">
                <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-2">
                  06 — CAPABILITIES
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-6">
                  Key Technical Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.major_features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-elevated border border-border flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                      <span className="text-sm text-white font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Results & Metrics */}
            {project.results && (
              <div className="p-8 rounded-2xl bg-surface border border-accent-blue/30 relative overflow-hidden">
                <div className="font-mono text-xs uppercase tracking-widest text-status-success mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>07 — MEASURED OUTCOMES</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mb-4">
                  Results & Business Impact
                </h2>
                <p className="text-base text-silver-light leading-relaxed">
                  {project.results}
                </p>
              </div>
            )}

            {/* 6. Visual Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-white mb-6">
                  Interface & Architecture Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-elevated border border-border"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} detail view ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-28">
              <h3 className="font-mono text-xs uppercase tracking-widest text-silver mb-4">
                PROJECT METADATA
              </h3>

              <div className="space-y-4 text-sm divide-y divide-border">
                <div className="pt-2">
                  <span className="font-mono text-xs text-muted block mb-1">
                    STATUS
                  </span>
                  <Badge variant="status" status={project.project_status} />
                </div>

                <div className="pt-4">
                  <span className="font-mono text-xs text-muted block mb-1">
                    CATEGORY
                  </span>
                  <span className="text-white font-medium">{project.category}</span>
                </div>

                <div className="pt-4">
                  <span className="font-mono text-xs text-muted block mb-2">
                    TECHNOLOGY STACK
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.map((t) => (
                      <Badge key={t} variant="tech">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.live_url && (
                  <div className="pt-4">
                    <span className="font-mono text-xs text-muted block mb-1">
                      LIVE DEPLOYMENT
                    </span>
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:underline break-all text-xs font-mono inline-flex items-center gap-1"
                    >
                      <span>{project.live_url}</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  href={`/contact?projectRef=${encodeURIComponent(project.title)}`}
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                >
                  Inquire This Scope
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold text-white">
                Related Work
              </h2>
              <Link
                href="/work"
                className="text-xs font-mono uppercase tracking-wider text-silver hover:text-white"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/work/${rel.slug}`}
                  className="group block p-6 rounded-2xl bg-surface border border-border hover:border-silver/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-silver-light">
                      {rel.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-white" />
                  </div>
                  <p className="text-xs text-muted line-clamp-2">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}
