'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MediaAsset } from '@/types';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    name: '',
    file_url: '',
    alt_text: ''
  });

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsAdding(false);
        setForm({ name: '', file_url: '', alt_text: '' });
        fetchMedia();
      }
    } catch {
      alert('Failed to register media asset');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media asset "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMedia();
    } catch {
      alert('Delete failed');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            ASSET MANAGEMENT
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Media Library
          </h1>
        </div>

        <Button onClick={() => setIsAdding(!isAdding)} variant="primary" size="md" className="gap-2">
          <Upload className="h-4 w-4" />
          <span>Add Media Asset</span>
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <h2 className="font-heading text-lg font-bold text-white mb-4">
            Register Media Asset
          </h2>
          <form onSubmit={handleAddMedia} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-silver block mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. AetherOS Cover Diagram"
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-silver block mb-1">File URL / Path *</label>
                <input
                  type="text"
                  required
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  placeholder="/images/projects/aetheros-cover.svg"
                  className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Alt Text</label>
              <input
                type="text"
                value={form.alt_text}
                onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                placeholder="Accessible image description"
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setIsAdding(false)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Asset
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((asset) => (
          <Card key={asset.id} className="p-4 flex flex-col justify-between group">
            <div>
              <div className="relative aspect-[16/10] rounded-lg bg-surface-elevated border border-border overflow-hidden mb-3">
                <Image
                  src={asset.file_url}
                  alt={asset.alt_text || asset.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-mono text-xs font-bold text-white truncate">{asset.name}</h3>
              <p className="font-mono text-[10px] text-muted truncate mt-0.5">{asset.file_url}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
              <button
                type="button"
                onClick={() => copyUrl(asset.file_url, asset.id)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-silver hover:text-white"
              >
                {copiedId === asset.id ? <Check className="h-3 w-3 text-status-success" /> : <Copy className="h-3 w-3" />}
                <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(asset.id, asset.name)}
                className="text-muted hover:text-status-error p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
