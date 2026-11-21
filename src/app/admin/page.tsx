'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Inbox,
  FolderGit2,
  Briefcase,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  Plus
} from 'lucide-react';
import { Project, InquirySubmission } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalProjects: 0,
    publishedProjects: 0,
    totalServices: 8,
    totalTeam: 2
  });

  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, inqRes, actRes] = await Promise.all([
          fetch('/api/admin/projects'),
          fetch('/api/admin/inquiries'),
          fetch('/api/admin/activity?limit=6')
        ]);

        const projData = await projRes.json();
        const inqData = await inqRes.json();
        const actData = await actRes.json();

        const projects: Project[] = projData.projects || [];
        const inquiries: any[] = inqData.inquiries || [];
        const logs: any[] = actData.logs || [];

        setStats({
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter((i) => i.status === 'New').length,
          totalProjects: projects.length,
          publishedProjects: projects.filter((p) => p.published).length,
          totalServices: 8,
          totalTeam: 2
        });

        setRecentInquiries(inquiries.slice(0, 5));
        setRecentActivity(logs);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            CONTROL CENTER
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Studio Telemetry & CMS
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button href="/admin/projects/new" variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
          <Button href="/admin/inquiries" variant="outline" size="sm" className="gap-1.5">
            <Inbox className="h-4 w-4" />
            <span>Manage Leads</span>
          </Button>
          <Button href="/admin/settings" variant="secondary" size="sm">
            Site Settings
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
              TOTAL INQUIRIES
            </span>
            <div className="text-2xl font-heading font-bold text-white mt-1">
              {stats.totalInquiries}
            </div>
            <div className="text-xs font-mono text-status-success mt-1">
              {stats.newInquiries} action required
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
            <Inbox className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
              CASE STUDIES
            </span>
            <div className="text-2xl font-heading font-bold text-white mt-1">
              {stats.totalProjects}
            </div>
            <div className="text-xs font-mono text-silver mt-1">
              {stats.publishedProjects} published live
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FolderGit2 className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
              CAPABILITIES
            </span>
            <div className="text-2xl font-heading font-bold text-white mt-1">
              {stats.totalServices}
            </div>
            <div className="text-xs font-mono text-muted mt-1">
              Core studio services
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-status-success/10 border border-status-success/30 flex items-center justify-center text-status-success">
            <Briefcase className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
              TEAM CORE
            </span>
            <div className="text-2xl font-heading font-bold text-white mt-1">
              {stats.totalTeam}
            </div>
            <div className="text-xs font-mono text-muted mt-1">
              Active engineering collective
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Inquiries + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Inbox className="h-4 w-4 text-accent-blue" />
              <span>Recent Inquiries & Leads</span>
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-mono text-silver hover:text-white uppercase tracking-wider"
            >
              View All
            </Link>
          </div>

          <Card className="overflow-hidden p-0">
            {recentInquiries.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-muted">
                No inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-elevated/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-white">
                          {inq.name}
                        </span>
                        <span className="font-mono text-[10px] text-accent-blue bg-surface-elevated px-1.5 py-0.5 rounded">
                          {inq.reference_code}
                        </span>
                      </div>
                      <div className="text-xs text-muted">
                        {inq.project_type} • <span className="text-status-success">{inq.budget}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border bg-surface text-silver">
                        {inq.status}
                      </span>
                      <Link
                        href={`/admin/inquiries?id=${inq.id}`}
                        className="text-xs font-mono text-accent-blue hover:underline"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Audit Activity Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-silver" />
              <span>Audit Activity Stream</span>
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs font-mono text-silver hover:text-white uppercase tracking-wider"
            >
              All Logs
            </Link>
          </div>

          <Card className="p-4 sm:p-5 space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs font-mono text-muted py-4 text-center">
                No recent activity logged.
              </p>
            ) : (
              recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-surface-elevated/50 border border-border/80 flex items-start gap-2.5 text-xs font-mono"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-blue shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {log.action}
                    </div>
                    <div className="text-[10px] text-muted-dark truncate">
                      {log.user_email || 'System'} • {new Date(log.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
