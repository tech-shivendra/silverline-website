'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TeamMember } from '@/types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Image from 'next/image';

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    avatar_url: '/images/team/shivendra.svg',
    skillsInput: '',
    linkedin_url: '',
    github_url: '',
    display_order: 1,
    published: true
  });

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success) setMembers(data.team || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingMember(null);
    setForm({
      name: '',
      role: '',
      bio: '',
      avatar_url: '/images/team/collective.svg',
      skillsInput: 'TypeScript, Next.js, Architecture',
      linkedin_url: '',
      github_url: '',
      display_order: members.length + 1,
      published: true
    });
  };

  const startEdit = (m: TeamMember) => {
    setEditingMember(m);
    setIsCreating(false);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      avatar_url: m.avatar_url || '/images/team/collective.svg',
      skillsInput: (m.skills || []).join(', '),
      linkedin_url: m.linkedin_url || '',
      github_url: m.github_url || '',
      display_order: m.display_order,
      published: m.published
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = form.skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, skills })
        });
        if (res.ok) {
          setIsCreating(false);
          fetchTeam();
        }
      } else if (editingMember) {
        const res = await fetch('/api/admin/team', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...form, skills })
        });
        if (res.ok) {
          setEditingMember(null);
          fetchTeam();
        }
      }
    } catch {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove team member "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTeam();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            PEOPLE & COLLECTIVE
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Team Members
          </h1>
        </div>

        <Button onClick={startCreate} variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
      </div>

      {(isCreating || editingMember) && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-white">
              {isCreating ? 'Add Team Member' : `Edit: ${editingMember?.name}`}
            </h2>
            <button onClick={() => { setIsCreating(false); setEditingMember(null); }} className="text-muted hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Role / Job Title *</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Biography *</label>
              <textarea
                rows={2}
                required
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Skills (Comma separated)</label>
              <input
                type="text"
                value={form.skillsInput}
                onChange={(e) => setForm({ ...form, skillsInput: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => { setIsCreating(false); setEditingMember(null); }} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Member</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-surface-elevated border border-border shrink-0">
                  {member.avatar_url && (
                    <Image src={member.avatar_url} alt={member.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">{member.name}</h3>
                  <div className="font-mono text-xs text-accent-blue">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => startEdit(member)} className="p-1.5 rounded-lg hover:bg-surface-elevated text-silver hover:text-white">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(member.id, member.name)} className="p-1.5 rounded-lg hover:bg-status-error/10 text-muted hover:text-status-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted mt-3">{member.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
