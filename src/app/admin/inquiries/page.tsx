'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle,
  MessageSquare,
  FileText,
  Clock,
  Trash2,
  X
} from 'lucide-react';

const STATUS_OPTIONS = [
  'All',
  'New',
  'Contacted',
  'Discussion',
  'Proposal Sent',
  'Converted',
  'Rejected',
  'Archived'
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInquiries = async () => {
    try {
      const url = statusFilter === 'All' ? '/api/admin/inquiries' : `/api/admin/inquiries?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const openDetail = (inq: any) => {
    setSelectedInquiry(inq);
    setInternalNotes(inq.internal_notes || '');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const saveInternalNotes = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedInquiry.id, internal_notes: internalNotes })
      });
      if (res.ok) {
        setSelectedInquiry({ ...selectedInquiry, internal_notes: internalNotes });
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? { ...i, internal_notes: internalNotes } : i))
        );
      }
    } catch {
      alert('Failed to save notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.reference_code?.toLowerCase().includes(q) ||
      inq.project_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            LEAD ENGINE CRM
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Client Inquiries & Proposals
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-surface-elevated text-white border border-silver/40 font-semibold'
                  : 'text-muted hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, ref..."
            className="w-full bg-background-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
          />
        </div>
      </Card>

      {/* Leads Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (8 cols or 12 if no selection) */}
        <div className={selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-elevated text-silver border-b border-border">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Project Scope</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted">
                        No inquiries found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => openDetail(inq)}
                        className={`hover:bg-surface-elevated/40 cursor-pointer transition-colors ${
                          selectedInquiry?.id === inq.id ? 'bg-surface-elevated/60' : ''
                        }`}
                      >
                        <td className="p-4 font-bold text-accent-blue">{inq.reference_code}</td>
                        <td className="p-4">
                          <div className="text-white font-medium">{inq.name}</div>
                          <div className="text-[10px] text-muted">{inq.email}</div>
                        </td>
                        <td className="p-4 text-silver">{inq.project_type}</td>
                        <td className="p-4 text-status-success font-medium">{inq.budget}</td>
                        <td className="p-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-background-secondary text-silver">
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            className="text-xs text-accent-blue hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Selected Inquiry Detail Inspector (5 cols) */}
        {selectedInquiry && (
          <div className="lg:col-span-5 sticky top-20">
            <Card className="p-6 border-silver/40 shadow-2xl relative space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <div className="font-mono text-[10px] text-muted-dark uppercase tracking-wider">
                    INQUIRY RECORD
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {selectedInquiry.reference_code}
                  </h3>
                </div>
                <button onClick={() => setSelectedInquiry(null)} className="text-muted hover:text-white p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Selector */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Pipeline Status
                </label>
                <div className="flex flex-wrap gap-1">
                  {STATUS_OPTIONS.filter((s) => s !== 'All').map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateStatus(selectedInquiry.id, st)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                        selectedInquiry.status === st
                          ? 'bg-accent-blue/20 text-accent-blue border-accent-blue font-bold'
                          : 'bg-background-secondary text-muted border-border hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-2 text-xs divide-y divide-border/60">
                <div className="pt-2 flex justify-between">
                  <span className="text-muted font-mono">Client:</span>
                  <span className="text-white font-medium">{selectedInquiry.name}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted font-mono">Email:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-accent-blue underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-muted font-mono">Phone:</span>
                    <span className="text-white">{selectedInquiry.phone}</span>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-muted font-mono">Company:</span>
                    <span className="text-white">{selectedInquiry.company}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-between">
                  <span className="text-muted font-mono">Stage:</span>
                  <span className="text-silver">{selectedInquiry.project_stage}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted font-mono">Budget:</span>
                  <span className="text-status-success font-semibold">{selectedInquiry.budget}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-muted font-mono">Received:</span>
                  <span className="text-silver">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Scope Description */}
              <div className="p-3.5 rounded-xl bg-background-secondary border border-border">
                <div className="font-mono text-[10px] uppercase text-silver mb-1">
                  Submitted Requirements:
                </div>
                <p className="text-xs text-muted-light whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.description}
                </p>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Internal Engineering Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add private technical notes, call summary, or pricing estimates..."
                  className="w-full bg-background-secondary border border-border rounded-xl p-3 text-xs text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={saveInternalNotes}
                    isLoading={isUpdating}
                    disabled={isUpdating}
                    variant="primary"
                    size="sm"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
