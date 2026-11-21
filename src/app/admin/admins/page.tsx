'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminUser, AdminInvitation, AdminRole } from '@/types';
import { ShieldCheck, Mail, UserPlus, Trash2, CheckCircle, Copy, Check } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('admin');
  const [isInviting, setIsInviting] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{ email: string; link: string } | null>(null);

  const fetchData = async () => {
    try {
      const [uRes, iRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/invitations')
      ]);

      const uData = await uRes.json();
      const iData = await iRes.json();

      if (uData.success) setUsers(uData.users || []);
      if (iData.success) setInvitations(iData.invitations || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedInvite({ email: inviteEmail, link: data.inviteLink });
        setInviteEmail('');
        fetchData();
      } else {
        alert(data.error || 'Invitation failed');
      }
    } catch {
      alert('Error creating invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const updateRole = async (id: string, newRole: AdminRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } catch {
      alert('Update failed');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !current })
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: !current } : u)));
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } catch {
      alert('Update failed');
    }
  };

  const revokeInvitation = async (id: string) => {
    if (!confirm('Revoke this invitation?')) return;
    try {
      const res = await fetch(`/api/admin/invitations?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch {
      alert('Revoke failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-purple-400 mb-1">
          SUPER ADMIN PRIVILEGES
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
          Administrator & Role Governance
        </h1>
        <p className="text-xs text-muted mt-1">
          Invite studio administrators, designate granular access roles, and monitor account statuses.
        </p>
      </div>

      {/* Invite Administrator Form */}
      <Card className="p-6 border-silver/40 shadow-xl">
        <h2 className="font-heading text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-accent-blue" />
          <span>Invite New Administrator</span>
        </h2>

        <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="font-mono text-xs text-silver block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@silverline.design"
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="font-mono text-xs text-silver block mb-1">Access Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AdminRole)}
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
            >
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={isInviting}
              isLoading={isInviting}
              variant="primary"
              size="md"
              className="w-full justify-center"
            >
              Send Invitation
            </Button>
          </div>
        </form>

        {generatedInvite && (
          <div className="mt-4 p-4 rounded-xl bg-surface-elevated border border-accent-blue/40 text-xs font-mono space-y-2 animate-in fade-in">
            <div className="text-status-success font-semibold flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              <span>Invitation generated for {generatedInvite.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInvite.link}
                className="w-full bg-background-secondary border border-border rounded p-2 text-white text-[11px]"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedInvite.link);
                  setCopiedLink('gen');
                  setTimeout(() => setCopiedLink(null), 2000);
                }}
                className="px-3 py-2 rounded bg-surface border border-border text-silver hover:text-white shrink-0"
              >
                {copiedLink === 'gen' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Active Administrators Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-4 bg-surface-elevated border-b border-border">
          <h3 className="font-heading text-sm font-bold text-white">Active Studio Administrators</h3>
        </div>
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface text-silver border-b border-border">
            <tr>
              <th className="p-4">Administrator</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-elevated/40">
                <td className="p-4">
                  <div className="text-white font-medium">{u.name || u.email.split('@')[0]}</div>
                  <div className="text-[10px] text-muted">{u.email}</div>
                </td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={u.email === 'techshivendraa@gmail.com'}
                    onChange={(e) => updateRole(u.id, e.target.value as AdminRole)}
                    className="bg-background-secondary border border-border rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Administrator</option>
                    <option value="editor">Editor</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    disabled={u.email === 'techshivendraa@gmail.com'}
                    onClick={() => toggleActive(u.id, u.is_active)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] border ${
                      u.is_active
                        ? 'bg-status-success/10 text-status-success border-status-success/30'
                        : 'bg-status-error/10 text-status-error border-status-error/30'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Suspended'}
                  </button>
                </td>
                <td className="p-4 text-right text-muted">
                  {u.email === 'techshivendraa@gmail.com' ? (
                    <span className="text-[10px] text-accent-blue font-bold">Primary Owner</span>
                  ) : (
                    <span>Member</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 bg-surface-elevated border-b border-border">
            <h3 className="font-heading text-sm font-bold text-white">Pending Invitations ({invitations.length})</h3>
          </div>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface text-silver border-b border-border">
              <tr>
                <th className="p-4">Invited Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Expires</th>
                <th className="p-4 text-right">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invitations.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-4 text-white font-medium">{inv.email}</td>
                  <td className="p-4 text-silver capitalize">{inv.role}</td>
                  <td className="p-4 text-muted">{new Date(inv.expires_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => revokeInvitation(inv.id)}
                      className="text-muted hover:text-status-error p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
