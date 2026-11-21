'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Testimonial } from '@/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    client_name: '',
    company: '',
    role: '',
    testimonial: '',
    avatar_url: '',
    published: true,
    display_order: 1
  });

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setForm({
      client_name: '',
      company: '',
      role: 'Founder & CEO',
      testimonial: '',
      avatar_url: '',
      published: true,
      display_order: testimonials.length + 1
    });
  };

  const startEdit = (t: Testimonial) => {
    setEditingItem(t);
    setIsCreating(false);
    setForm({
      client_name: t.client_name,
      company: t.company,
      role: t.role || '',
      testimonial: t.testimonial,
      avatar_url: t.avatar_url || '',
      published: t.published,
      display_order: t.display_order
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setIsCreating(false);
          fetchTestimonials();
        }
      } else if (editingItem) {
        const res = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...form })
        });
        if (res.ok) {
          setEditingItem(null);
          fetchTestimonials();
        }
      }
    } catch {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTestimonials();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            CLIENT ENDORSEMENTS
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Client Testimonials
          </h1>
        </div>

        <Button onClick={startCreate} variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-surface border border-border text-xs font-mono text-silver leading-relaxed">
        <strong>PRD Rule 4.8 Compliance:</strong> If genuine testimonials are not published, the testimonial section automatically remains hidden on the public website to maintain authenticity.
      </div>

      {(isCreating || editingItem) && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-white">
              {isCreating ? 'Add Genuine Testimonial' : `Edit Testimonial`}
            </h2>
            <button onClick={() => { setIsCreating(false); setEditingItem(null); }} className="text-muted hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Role / Title</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Testimonial Quote *</label>
              <textarea
                rows={3}
                required
                value={form.testimonial}
                onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-silver">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <span>Published to website</span>
              </label>

              <div className="flex gap-2">
                <Button type="button" onClick={() => { setIsCreating(false); setEditingItem(null); }} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>Save Testimonial</span>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {testimonials.length === 0 ? (
        <Card className="p-8 text-center text-xs font-mono text-muted">
          No testimonials added yet. Click &quot;Add Testimonial&quot; when verified client feedback is supplied.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-5 flex flex-col justify-between">
              <div>
                <p className="text-sm text-silver-light italic mb-4">&quot;{t.testimonial}&quot;</p>
                <div className="font-heading text-sm font-bold text-white">{t.client_name}</div>
                <div className="text-xs text-muted">{t.role} • {t.company}</div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${t.published ? 'bg-status-success/10 text-status-success' : 'bg-muted/10 text-muted'}`}>
                  {t.published ? 'Published' : 'Draft'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(t)} className="text-muted hover:text-white p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id, t.client_name)} className="text-muted hover:text-status-error p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
