'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductArchitectConfig, ProductBlueprint } from '@/types';
import {
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';

const PRODUCT_TYPES = [
  'Website',
  'Mobile application',
  'SaaS platform',
  'Marketplace',
  'Dashboard',
  'AI-powered product'
];

const DESIGN_PREFERENCES = [
  'Minimal',
  'Futuristic',
  'Corporate',
  'Experimental'
];

const PLATFORMS = [
  'Web',
  'Android',
  'iOS',
  'Cross-platform'
];

const FEATURES = [
  'Authentication',
  'Payment integration',
  'Admin dashboard',
  'Analytics',
  'Notifications',
  'AI integration',
  'Real-time functionality',
  'Third-party APIs'
];

const BUDGET_RANGES = [
  'Under ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1 lakh',
  '₹1 lakh–₹2 lakh',
  '₹2 lakh+'
];

export const ProductArchitect: React.FC = () => {
  const router = useRouter();

  const [config, setConfig] = useState<ProductArchitectConfig>({
    productType: 'SaaS platform',
    designPreference: 'Futuristic',
    platform: 'Web',
    features: ['Authentication', 'Admin dashboard', 'AI integration'],
    budget: '₹1 lakh–₹2 lakh'
  });

  const [blueprint, setBlueprint] = useState<ProductBlueprint | null>(null);

  // Restore draft if saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem('silverline_architect_config');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Compute live blueprint
  useEffect(() => {
    // Generate suggested tech stack
    const stack: string[] = [];
    if (config.platform.includes('Web') || config.platform === 'Cross-platform') {
      stack.push('Next.js', 'TypeScript', 'Tailwind CSS');
    }
    if (config.platform.includes('Android') || config.platform.includes('iOS') || config.platform === 'Cross-platform') {
      stack.push('React Native', 'Expo');
    }
    if (config.features.includes('AI integration')) {
      stack.push('Python', 'FastAPI', 'LLM API');
    }
    if (config.features.includes('Authentication') || config.features.includes('Real-time functionality')) {
      stack.push('PostgreSQL', 'Supabase Realtime');
    } else {
      stack.push('PostgreSQL');
    }
    if (config.features.includes('Payment integration')) {
      stack.push('Stripe / Razorpay');
    }

    // Complexity calculation
    let complexity: 'Low' | 'Medium' | 'High' | 'Enterprise' = 'Low';
    const score = config.features.length + (config.platform === 'Cross-platform' ? 3 : 1);
    if (score <= 3) complexity = 'Low';
    else if (score <= 5) complexity = 'Medium';
    else if (score <= 7) complexity = 'High';
    else complexity = 'Enterprise';

    const workingTitle = `${config.designPreference} ${config.productType} Concept`;
    const summary = `A ${config.designPreference.toLowerCase()}-styled ${config.productType.toLowerCase()} targeting ${config.platform} platforms with ${config.features.length} core capability integrations.`;

    const generated: ProductBlueprint = {
      workingTitle,
      summary,
      selectedCapabilities: config.features,
      suggestedTechStack: Array.from(new Set(stack)),
      suggestedStages: [
        '01. Technical Architecture & Data Schema',
        '02. Interactive Design System & UI Prototyping',
        '03. Full-Stack Engineering & API Integration',
        '04. Security Audit & Production Edge Deployment'
      ],
      estimatedComplexity: complexity,
      selectedBudgetRange: config.budget,
      timestamp: new Date().toISOString()
    };

    setBlueprint(generated);

    try {
      localStorage.setItem('silverline_architect_config', JSON.stringify(config));
    } catch {
      // Ignore storage errors
    }
  }, [config]);

  const toggleFeature = (feat: string) => {
    setConfig((prev) => {
      const exists = prev.features.includes(feat);
      const nextFeatures = exists
        ? prev.features.filter((f) => f !== feat)
        : [...prev.features, feat];
      return { ...prev, features: nextFeatures };
    });
  };

  const handleTransferToContact = () => {
    try {
      localStorage.setItem('silverline_transferred_blueprint', JSON.stringify(config));
    } catch {
      // Ignore storage error
    }
    router.push('/contact?from=architect');
  };

  const handleReset = () => {
    setConfig({
      productType: 'SaaS platform',
      designPreference: 'Futuristic',
      platform: 'Web',
      features: ['Authentication', 'Admin dashboard', 'AI integration'],
      budget: '₹1 lakh–₹2 lakh'
    });
  };

  return (
    <div id="architect" className="space-y-8 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Configurator Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Product Type */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-3">
              01 — Product Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConfig({ ...config, productType: type })}
                  className={`p-3 text-xs font-mono rounded-xl border text-left transition-all ${
                    config.productType === type
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Design Preference */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-3">
              02 — Design Aesthetic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESIGN_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setConfig({ ...config, designPreference: pref })}
                  className={`p-3 text-xs font-mono rounded-xl border text-center transition-all ${
                    config.designPreference === pref
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Platform */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-3">
              03 — Target Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setConfig({ ...config, platform })}
                  className={`p-3 text-xs font-mono rounded-xl border text-center transition-all ${
                    config.platform === platform
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Core Capabilities / Features */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex items-center justify-between mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-silver block">
                04 — Key Capabilities & Integrations
              </label>
              <span className="font-mono text-[11px] text-muted-dark">
                {config.features.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {FEATURES.map((feat) => {
                const selected = config.features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`p-3 text-xs font-mono rounded-xl border flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-surface-elevated text-white border-silver/50'
                        : 'bg-background-secondary text-muted border-border hover:text-white'
                    }`}
                  >
                    <span>{feat}</span>
                    {selected && <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Budget Range */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-3">
              05 — Anticipated Budget Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUDGET_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setConfig({ ...config, budget: range })}
                  className={`p-3 text-xs font-mono rounded-xl border text-center transition-all ${
                    config.budget === range
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Blueprint Output Display (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 p-6 sm:p-8 rounded-2xl bg-surface border border-silver/40 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-blue" />
                <span className="font-mono text-xs uppercase tracking-widest text-silver">
                  LIVE PRODUCT BLUEPRINT
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                title="Reset to default"
                className="text-muted hover:text-white transition-colors"
                aria-label="Reset configurator"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {blueprint && (
              <div className="space-y-6 text-sm">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
                    WORKING CONCEPT
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-1">
                    {blueprint.workingTitle}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mt-2">
                    {blueprint.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
                      ESTIMATED COMPLEXITY
                    </span>
                    <span className="font-mono text-sm font-semibold text-accent-blue mt-0.5 inline-block">
                      {blueprint.estimatedComplexity}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
                      TARGET BUDGET
                    </span>
                    <span className="font-mono text-sm font-semibold text-status-success mt-0.5 inline-block">
                      {blueprint.selectedBudgetRange}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block mb-2">
                    RECOMMENDED TECH STACK
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {blueprint.suggestedTechStack.map((tech) => (
                      <Badge key={tech} variant="tech">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block mb-2">
                    SUGGESTED SPRINT STAGES
                  </span>
                  <ul className="space-y-1.5 text-xs text-silver">
                    {blueprint.suggestedStages.map((stg, i) => (
                      <li key={i} className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="h-1 w-1 rounded-full bg-accent-blue" />
                        <span>{stg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-border">
                  <Button
                    onClick={handleTransferToContact}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2 group"
                  >
                    <span>Let's Build This Together</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <p className="text-[11px] font-mono text-muted text-center mt-3">
                    Transfers your configured specifications directly to the inquiry form.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
