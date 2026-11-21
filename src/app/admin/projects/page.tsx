'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types';
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const togglePublished = async (project: Project) => {
    try {
      const updatedStatus = !project.published;
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: updatedStatus })
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: updatedStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update published status', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = projects.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            PORTFOLIO MANAGEMENT
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Projects & Case Studies
          </h1>
        </div>

        <Button href="/admin/projects/new" variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Project</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Web Applications', 'Mobile Applications', 'SaaS', 'AI & Automation', 'Experimental Concepts'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                categoryFilter === cat
                  ? 'bg-surface-elevated text-white border border-silver/40 font-semibold'
                  : 'text-muted hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All' : cat.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-background-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
          />
        </div>
      </Card>

      {/* Projects Table / Grid */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-elevated text-silver border-b border-border">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Live Site</th>
                <th className="p-4 text-center">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 rounded bg-surface-elevated border border-border overflow-hidden shrink-0">
                        {project.thumbnail_url && (
                          <Image
                            src={project.thumbnail_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-heading text-sm font-bold text-white">
                          {project.title}
                        </div>
                        <div className="text-[10px] text-muted">
                          /work/{project.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-silver">{project.category}</td>
                  <td className="p-4">
                    <Badge variant="status" status={project.project_status} />
                  </td>
                  <td className="p-4 text-center">
                    {project.published ? (
                      <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-accent-blue hover:underline"
                      >
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-muted-dark">Draft</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => togglePublished(project)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${
                        project.published
                          ? 'bg-status-success/10 text-status-success border-status-success/30'
                          : 'bg-muted/10 text-muted border-border hover:text-white'
                      }`}
                    >
                      {project.published ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        href={`/admin/projects/${project.id}`}
                        variant="ghost"
                        size="sm"
                        className="p-1.5 h-8 w-8"
                        title="Edit Project"
                      >
                        <Edit className="h-3.5 w-3.5 text-silver hover:text-white" />
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-1.5 h-8 w-8 rounded-lg hover:bg-status-error/10 text-muted hover:text-status-error transition-colors flex items-center justify-center"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
