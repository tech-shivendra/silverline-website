'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'unauthorized') {
      setErrorMessage('Access denied. Your account is not authorized as an administrator.');
    } else if (error === 'forbidden') {
      setErrorMessage('You do not possess the required permissions for that section.');
    }

    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      const redirectUrl = searchParams.get('redirect') || '/admin';
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col justify-center items-center p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle variant="minimal" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo size="lg" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent-blue mt-2">
            ADMINISTRATIVE CMS PORTAL
          </div>
          <p className="text-xs text-muted mt-1">
            Secure owner-controlled access and content management engine.
          </p>
        </div>

        <Card className="p-8 bg-surface border-border shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="techshivendraa@gmail.com"
                  className="w-full bg-background-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-silver/50 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-silver">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-background-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 mt-2"
            >
              <span>Authenticate to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Owner Bootstrap Notice */}
          <div className="mt-8 pt-6 border-t border-border/80">
            <div className="flex items-start gap-2.5 text-[11px] font-mono text-muted leading-relaxed">
              <ShieldCheck className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
              <div>
                <span className="text-silver font-semibold block mb-0.5">
                  Designated Super Admin Bootstrap:
                </span>
                <span>
                  The account associated with <code className="text-white bg-surface-elevated px-1 py-0.5 rounded">techshivendraa@gmail.com</code> is automatically granted Super Admin authority on first sign-in.
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Button href="/" variant="ghost" size="sm">
            ← Return to Public Website
          </Button>
        </div>
      </div>
    </div>
  );
}
