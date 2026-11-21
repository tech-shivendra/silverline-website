'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save, CheckCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [general, setGeneral] = useState({
    heroEyebrow: siteConfig.heroEyebrow,
    heroHeading: siteConfig.heroHeading,
    heroSupportingText: siteConfig.heroSupportingText,
    brandStatement: siteConfig.brandStatement,
    supportingStatement: siteConfig.supportingStatement,
    contactEmail: siteConfig.links.email,
    githubUrl: siteConfig.links.github,
    linkedinUrl: siteConfig.links.linkedin,
    twitterUrl: siteConfig.links.twitter
  });

  const [seo, setSeo] = useState({
    defaultTitle: 'SilverLine Studio | Product Development & Digital Innovation',
    titleTemplate: '%s | SilverLine Studio',
    defaultDescription: siteConfig.supportingStatement,
    ogImage: '/images/og-image.svg'
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.general) setGeneral((prev) => ({ ...prev, ...data.settings.general }));
          if (data.settings.seo) setSeo((prev) => ({ ...prev, ...data.settings.seo }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(false);

    try {
      await Promise.all([
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'general', value: general })
        }),
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'seo', value: seo })
        })
      ]);

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            GLOBAL CONFIGURATION
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Site Settings & Copy
          </h1>
        </div>

        {successMsg && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success/10 text-status-success border border-status-success/30 text-xs font-mono">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Homepage Hero Copy */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-blue">
            01 — HOMEPAGE HERO SECTION
          </h2>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Hero Eyebrow</label>
            <input
              type="text"
              value={general.heroEyebrow}
              onChange={(e) => setGeneral({ ...general, heroEyebrow: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Hero Main Heading</label>
            <input
              type="text"
              value={general.heroHeading}
              onChange={(e) => setGeneral({ ...general, heroHeading: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-heading font-bold"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Hero Supporting Text</label>
            <textarea
              rows={2}
              value={general.heroSupportingText}
              onChange={(e) => setGeneral({ ...general, heroSupportingText: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
            />
          </div>
        </Card>

        {/* Brand & Social Endpoints */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-silver">
            02 — BRAND STATEMENTS & CONTACT
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Primary Brand Statement</label>
              <input
                type="text"
                value={general.brandStatement}
                onChange={(e) => setGeneral({ ...general, brandStatement: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Contact Email</label>
              <input
                type="email"
                value={general.contactEmail}
                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">GitHub URL</label>
              <input
                type="url"
                value={general.githubUrl}
                onChange={(e) => setGeneral({ ...general, githubUrl: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={general.linkedinUrl}
                onChange={(e) => setGeneral({ ...general, linkedinUrl: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={general.twitterUrl}
                onChange={(e) => setGeneral({ ...general, twitterUrl: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </Card>

        {/* SEO Metadata */}
        <Card className="p-6 space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-status-success">
            03 — SEARCH ENGINE OPTIMIZATION & OG
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Default Site Title</label>
              <input
                type="text"
                value={seo.defaultTitle}
                onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Social Preview Image (OG Image)</label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-silver block mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={seo.defaultDescription}
              onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
              className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            disabled={isSaving}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
