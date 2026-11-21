'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ActivityLog } from '@/types';
import { History, Filter, RefreshCw } from 'lucide-react';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filterEntity, setFilterEntity] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = filterEntity === 'All' ? '/api/admin/activity?limit=100' : `/api/admin/activity?limit=100&entity=${encodeURIComponent(filterEntity)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterEntity]);

  const entities = ['All', 'projects', 'services', 'technologies', 'team_members', 'testimonials', 'faqs', 'inquiries', 'site_settings', 'admin_users', 'admin_invitations', 'auth'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            SECURITY & AUDIT
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Administrative Activity Logs
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="p-2 rounded-lg bg-surface border border-border text-silver hover:text-white"
          title="Refresh logs"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {entities.map((ent) => (
          <button
            key={ent}
            onClick={() => setFilterEntity(ent)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterEntity === ent
                ? 'bg-surface-elevated text-white border border-silver/40 font-semibold'
                : 'text-muted hover:text-white bg-surface'
            }`}
          >
            {ent}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-elevated text-silver border-b border-border">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Target Entity</th>
              <th className="p-4">Operator</th>
              <th className="p-4">Details</th>
              <th className="p-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">
                  No activity logs recorded.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-elevated/40">
                  <td className="p-4 font-bold text-accent-blue">{log.action}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-silver">
                      {log.entity_type}
                    </span>
                  </td>
                  <td className="p-4 text-white">{log.user_email || 'System'}</td>
                  <td className="p-4 text-muted max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                  <td className="p-4 text-right text-muted-dark whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
