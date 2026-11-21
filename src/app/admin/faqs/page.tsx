'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { FAQ } from '@/types';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    display_order: 1,
    published: true
  });

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (data.success) setFaqs(data.faqs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingFaq(null);
    setForm({
      question: '',
      answer: '',
      category: 'General',
      display_order: faqs.length + 1,
      published: true
    });
  };

  const startEdit = (f: FAQ) => {
    setEditingFaq(f);
    setIsCreating(false);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
      display_order: f.display_order,
      published: f.published
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreating) {
        const res = await fetch('/api/admin/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setIsCreating(false);
          fetchFaqs();
        }
      } else if (editingFaq) {
        const res = await fetch('/api/admin/faqs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingFaq.id, ...form })
        });
        if (res.ok) {
          setEditingFaq(null);
          fetchFaqs();
        }
      }
    } catch {
      alert('Save failed');
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Delete question "${q}"?`)) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFaqs();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mb-1">
            KNOWLEDGE BASE
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h1>
        </div>

        <Button onClick={startCreate} variant="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </Button>
      </div>

      {(isCreating || editingFaq) && (
        <Card className="p-6 border-silver/50 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="font-heading text-lg font-bold text-white">
              {isCreating ? 'Add FAQ Item' : `Edit FAQ`}
            </h2>
            <button onClick={() => { setIsCreating(false); setEditingFaq(null); }} className="text-muted hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-silver block mb-1">Question *</label>
              <input
                type="text"
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-silver block mb-1">Answer *</label>
              <textarea
                rows={3}
                required
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl p-2.5 text-sm text-white"
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
                <Button type="button" onClick={() => { setIsCreating(false); setEditingFaq(null); }} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>Save FAQ</span>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Card key={faq.id || index} className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="font-heading text-base font-bold text-white">{faq.question}</div>
              <p className="text-xs text-muted leading-relaxed">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(faq)} className="p-1.5 rounded text-silver hover:text-white hover:bg-surface-elevated">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(faq.id, faq.question)} className="p-1.5 rounded text-muted hover:text-status-error hover:bg-status-error/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
