'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Trash2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Web Applications',
    project_status: 'completed',
    description: '',
    long_description: '',
    thumbnail_url: '',
    cover_url: '',
    live_url: '',
    github_url: '',
    featured: false,
    published: true,
    display_order: 1,
    problem_statement: '',
    objectives: '',
    solution: '',
    design_approach: '',
    architecture: '',
    results: '',
    techStackInput: '',
    majorFeaturesInput: ''
  });

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        const data = await res.json();
        if (data.success && data.project) {
          const p = data.project;
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            category: p.category || 'Web Applications',
            project_status: p.project_status || 'completed',
            description: p.description || '',
            long_description: p.long_description || '',
            thumbnail_url: p.thumbnail_url || '',
            cover_url: p.cover_url || '',
            live_url: p.live_url || '',
            github_url: p.github_url || '',
            featured: Boolean(p.featured),
            published: Boolean(p.published),
            display_order: p.display_order || 1,
            problem_statement: p.problem_statement || '',
            objectives: p.objectives || '',
            solution: p.solution || '',
            design_approach: p.design_approach || '',
            architecture: p.architecture || '',
            results: p.results || '',
            techStackInput: (p.tech_stack || []).join(', '),
            majorFeaturesInput: (p.major_features || []).join('\n')
          });
        } else {
          setErrorMsg('Project not found');
        }
      } catch {
        setErrorMsg('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const tech_stack = form.techStackInput.split(',').map((t) => t.trim()).filter(Boolean);
    const major_features = form.majorFeaturesInput.split('\n').map((f) => f.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tech_stack,
          major_features
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to update project');
        setIsSaving(false);
        return;
      }

      router.push('/admin/projects');
      router.refresh();
    } catch {
      setErrorMsg('Connection error');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 font-mono text-xs text-muted">Loading project details...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button href="/admin/projects" variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Button>

        <div className="flex items-center gap-3">
          {form.published && (
            <Link
              href={`/work/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-mono text-accent-blue hover:underline"
            >
              <span>View Live Case Study</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <h1 className="font-heading text-xl font-bold text-white">Edit Case Study</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-blue">
            01 — BASIC IDENTIFIERS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-silver/50"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-silver/50 font-mono"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
              >
                <option value="Web Applications">Web Applications</option>
                <option value="Mobile Applications">Mobile Applications</option>
                <option value="SaaS">SaaS</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Experimental Concepts">Experimental Concepts</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Project Status</label>
              <select
                value={form.project_status}
                onChange={(e) => setForm({ ...form, project_status: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
              >
                <option value="live">Live Product</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="internal_experiment">Internal Lab</option>
                <option value="concept">Concept</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-silver cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-border"
              />
              <span>Published Live (Visible to public)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-mono text-silver cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-border"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>
        </Card>

        {/* Narrative */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-silver">
            02 — CASE STUDY NARRATIVE
          </h2>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Short Description *</label>
            <textarea
              rows={2}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Long Description / Hero Overview</label>
            <textarea
              rows={3}
              value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Problem Statement</label>
              <textarea
                rows={3}
                value={form.problem_statement}
                onChange={(e) => setForm({ ...form, problem_statement: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Engineered Solution</label>
              <textarea
                rows={3}
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Technical Stack */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-status-success">
            03 — TECHNICAL SPECIFICATIONS
          </h2>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Technology Stack (Comma separated)</label>
            <input
              type="text"
              value={form.techStackInput}
              onChange={(e) => setForm({ ...form, techStackInput: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Major Features (One per line)</label>
            <textarea
              rows={3}
              value={form.majorFeaturesInput}
              onChange={(e) => setForm({ ...form, majorFeaturesInput: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Live URL (Optional)</label>
              <input
                type="url"
                value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">GitHub URL (Optional)</label>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button href="/admin/projects" variant="outline" size="md">
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
            disabled={isSaving}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
