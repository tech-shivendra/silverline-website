'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Technology } from '@/types';

export default function AdminTechnologiesPage() {
  const [techList, setTechList] = useState<Technology[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Frontend' as Technology['category'],
    role: '',
    icon: 'code',
    associated_projects: '',
    display_order: 1,
    published: true
  });

  const fetchTech = async () => {
    try {
      const res = await fetch('/api/admin/technologies');
      const data = await res.json();
      if (data.success) {
        setTechList(data.technologies || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTech();
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingTech(null);
    setForm({
      name: '',
      category: activeCategory as Technology['category'],
      role: '',
      icon: 'code',
      associated_projects: '',
      display_order: techList.length + 1,
      published: true
    });
  };

  const startEdit = (t: Technology) => {
    setEditingTech(t);
    setIsCreating(false);
    setForm({
      name: t.name,
      category: t.category,
      role: t.role,
      icon: t.icon,
      associated_projects: (t.associated_projects || []).join(', '),
      display_order: t.display_order,
      published: t.published
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const associated_projects = form.associated_projects.split(',').map((p) => p.trim()).filter(Boolean);

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/technologies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, associated_projects })
        });
        if (res.ok) {
          setIsCreating(false);
          fetchTech();
        }
      } else if (editingTech) {
        const res = await fetch('/api/admin/technologies', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingTech.id, ...form, associated_projects })
        });
        if (res.ok) {
          setEditingTech(null);
          fetchTech();
        }
      }
    } catch {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete technology "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/technologies?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTech();
    } catch {
      alert('Delete failed');
    }
  };

  const categories = ['Frontend', 'Backend', 'Database and Infrastructure', 'Mobile', 'Tools'];
  const filtered = techList.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            STACK MANAGEMENT
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Technology Ecosystem
          </h1>
        </div>

        <Button onClick={startCreate} variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Technology</span>
        </Button>
      </div>

      {/* Drawer */}
      {(isCreating || editingTech) && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-white">
              {isCreating ? 'Add New Technology' : `Edit: ${editingTech?.name}`}
            </h2>
            <button onClick={() => { setIsCreating(false); setEditingTech(null); }} className="text-muted hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Technology Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Technology['category'] })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Icon Identifier</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Studio Role & Architectural Purpose *</label>
              <textarea
                rows={2}
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Associated Project Slugs (Comma separated)</label>
              <input
                type="text"
                value={form.associated_projects}
                onChange={(e) => setForm({ ...form, associated_projects: e.target.value })}
                placeholder="aether-os, nexus-core..."
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => { setIsCreating(false); setEditingTech(null); }} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Technology</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeCategory === cat
                ? 'bg-surface-elevated text-white border border-silver/40 font-semibold'
                : 'text-muted hover:text-white bg-surface'
            }`}
          >
            {cat} ({techList.filter((t) => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tech) => (
          <Card key={tech.id || tech.name} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-base font-bold text-white">{tech.name}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => startEdit(tech)} className="p-1 text-muted hover:text-white">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(tech.id, tech.name)} className="p-1 text-muted hover:text-status-error">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted mb-3 leading-relaxed">{tech.role}</p>
            </div>

            {tech.associated_projects && tech.associated_projects.length > 0 && (
              <div className="pt-3 border-t border-border flex flex-wrap gap-1">
                {tech.associated_projects.map((p) => (
                  <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary text-silver">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
