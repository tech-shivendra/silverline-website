'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Service } from '@/types';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Save, X } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Globe',
    capabilitiesInput: '',
    display_order: 1,
    published: true
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const startEdit = (s: Service) => {
    setEditingService(s);
    setIsCreating(false);
    setForm({
      title: s.title,
      slug: s.slug,
      description: s.description,
      icon: s.icon,
      capabilitiesInput: (s.capabilities || []).join('\n'),
      display_order: s.display_order,
      published: s.published
    });
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingService(null);
    setForm({
      title: '',
      slug: '',
      description: '',
      icon: 'Globe',
      capabilitiesInput: 'Capability 1\nCapability 2\nCapability 3',
      display_order: services.length + 1,
      published: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const capabilities = form.capabilitiesInput.split('\n').map((c) => c.trim()).filter(Boolean);

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, capabilities })
        });
        if (res.ok) {
          setIsCreating(false);
          fetchServices();
        }
      } else if (editingService) {
        const res = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingService.id, ...form, capabilities })
        });
        if (res.ok) {
          setEditingService(null);
          fetchServices();
        }
      }
    } catch {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete capability "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
      }
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            STUDIO CAPABILITIES
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Engineering & Product Services
          </h1>
        </div>

        <Button onClick={startCreate} variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Inline Create / Edit Drawer */}
      {(isCreating || editingService) && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-white">
              {isCreating ? 'Create New Capability' : `Edit: ${editingService?.title}`}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingService(null);
              }}
              className="text-muted hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Icon (Lucide)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Globe, Compass, Cpu..."
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Description *</label>
              <textarea
                rows={2}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Capabilities List (One per line)</label>
              <textarea
                rows={3}
                value={form.capabilitiesInput}
                onChange={(e) => setForm({ ...form, capabilitiesInput: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
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
                <Button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingService(null);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>Save Capability</span>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Services List Table */}
      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-elevated text-silver border-b border-border">
            <tr>
              <th className="p-4">Capability</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service, index) => (
              <tr key={service.id || index} className="hover:bg-surface-elevated/40 transition-colors">
                <td className="p-4">
                  <div className="font-heading text-sm font-bold text-white">
                    {service.title}
                  </div>
                  <div className="text-[10px] text-muted">/{service.slug}</div>
                </td>
                <td className="p-4 text-muted max-w-md truncate">
                  {service.description}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] ${
                      service.published
                        ? 'bg-status-success/10 text-status-success'
                        : 'bg-muted/10 text-muted'
                    }`}
                  >
                    {service.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(service)}
                      className="p-1.5 rounded-lg hover:bg-surface-elevated text-silver hover:text-white"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id, service.title)}
                      className="p-1.5 rounded-lg hover:bg-status-error/10 text-muted hover:text-status-error"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
