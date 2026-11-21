'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { AdminRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Cpu,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  History,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  role: AdminRole;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  role,
  isOpen,
  onClose
}) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects & Case Studies', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Technology Stack', href: '/admin/technologies', icon: Cpu },
    { name: 'Team Members', href: '/admin/team', icon: Users },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Inquiries & Leads', href: '/admin/inquiries', icon: Inbox },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    // Super admin exclusive
    ...(role === 'super_admin'
      ? [{ name: 'Admin Users', href: '/admin/admins', icon: ShieldCheck }]
      : []),
    { name: 'Activity Audit Log', href: '/admin/activity', icon: History }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Logo Bar */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between">
            <Logo size="sm" />
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-muted hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-dark px-3 py-1.5 block">
              MANAGEMENT CMS
            </span>

            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all',
                    isActive
                      ? 'bg-surface-elevated text-white font-semibold border border-silver/30 shadow-sm'
                      : 'text-muted hover:text-white hover:bg-surface-elevated/50'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isActive ? 'text-accent-blue' : 'text-muted-dark'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status */}
        <div className="p-4 border-t border-border bg-background-secondary/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted">
            <span>Status:</span>
            <span className="flex items-center gap-1.5 text-status-success">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
              <span>Connected</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
