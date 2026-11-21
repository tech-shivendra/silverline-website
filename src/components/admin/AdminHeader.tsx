'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AdminUser } from '@/types';
import {
  ExternalLink,
  LogOut,
  Shield,
  ShieldAlert,
  User,
  Menu
} from 'lucide-react';

interface AdminHeaderProps {
  adminUser: AdminUser;
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminUser,
  onToggleSidebar
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const roleStyles = {
    super_admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    admin: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
    editor: 'bg-status-success/10 text-status-success border-status-success/30'
  };

  const roleLabels = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    editor: 'Editor'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-muted hover:text-white hover:bg-surface-elevated border border-border"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-dark">
            SILVERLINE
          </span>
          <span className="text-muted-dark">/</span>
          <span className="font-mono text-xs text-silver font-medium">
            ADMIN CMS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Public Website Preview Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-muted hover:text-white transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle variant="minimal" />

        {/* Admin Role Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="hidden md:block text-right">
            <div className="text-xs font-semibold text-white leading-tight">
              {adminUser.name || adminUser.email.split('@')[0]}
            </div>
            <div className="text-[10px] font-mono text-muted">
              {adminUser.email}
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border ${
              roleStyles[adminUser.role]
            }`}
          >
            {adminUser.role === 'super_admin' ? (
              <ShieldAlert className="h-3 w-3" />
            ) : (
              <Shield className="h-3 w-3" />
            )}
            <span>{roleLabels[adminUser.role]}</span>
          </span>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg text-muted hover:text-status-error hover:bg-status-error/10 transition-colors ml-1"
            title="Log out from Admin Dashboard"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
