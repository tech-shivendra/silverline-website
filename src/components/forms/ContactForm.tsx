'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContactFormData, contactFormSchema } from '@/lib/validations/contact';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  'Website',
  'Mobile application',
  'SaaS',
  'AI solution',
  'UI/UX design',
  'Custom software',
  'Other'
];

const PROJECT_STAGES = [
  'Just an idea',
  'Planning',
  'Design completed',
  'Development started',
  'Existing product requiring improvements'
];

const BUDGET_OPTIONS = [
  'Under ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1 lakh',
  '₹1 lakh–₹2 lakh',
  'Above ₹2 lakh',
  'Not decided'
];

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ContactFormData>({
    project_type: 'SaaS',
    description: '',
    platform: 'Web',
    features: [],
    budget: '₹1 lakh–₹2 lakh',
    project_stage: 'Just an idea',
    design_preference: 'Futuristic',
    name: '',
    email: '',
    phone: '',
    company: '',
    preferred_contact: 'email'
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Check for transferred config from Product Architect or URL parameters
  useEffect(() => {
    try {
      // 1. From URL service query
      const serviceParam = searchParams.get('service');
      if (serviceParam) {
        setFormData((prev) => ({ ...prev, project_type: serviceParam }));
      }

      // 2. From URL project reference
      const projectRef = searchParams.get('projectRef');
      if (projectRef) {
        setFormData((prev) => ({
          ...prev,
          description: `Interested in architecture similar to ${projectRef}. \n`
        }));
      }

      // 3. From Product Architect transfer
      const fromArchitect = searchParams.get('from') === 'architect';
      const transferred = localStorage.getItem('silverline_transferred_blueprint');
      if (fromArchitect && transferred) {
        const config = JSON.parse(transferred);
        setFormData((prev) => ({
          ...prev,
          project_type: config.productType || prev.project_type,
          platform: config.platform || prev.platform,
          features: config.features || prev.features,
          budget: config.budget || prev.budget,
          design_preference: config.designPreference || prev.design_preference,
          description: `Configured via Product Architect:\n- Type: ${config.productType}\n- Platform: ${config.platform}\n- Design: ${config.designPreference}\n- Core Features: ${(config.features || []).join(', ')}\n\nProject Scope & Goals: `
        }));
      } else {
        // Restore local draft if saved
        const draft = localStorage.getItem('silverline_contact_draft');
        if (draft) {
          setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [searchParams]);

  // Persist draft while typing (prevent accidental loss)
  useEffect(() => {
    if (!submissionSuccess) {
      try {
        localStorage.setItem('silverline_contact_draft', JSON.stringify(formData));
      } catch {
        // Storage unavailable
      }
    }
  }, [formData, submissionSuccess]);

  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.project_type) errors.project_type = 'Please select a project category.';
    } else if (currentStep === 2) {
      if (!formData.description || formData.description.trim().length < 10) {
        errors.description = 'Please provide at least 10 characters describing your project.';
      }
      if (!formData.project_stage) {
        errors.project_stage = 'Please specify your current project stage.';
      }
    } else if (currentStep === 3) {
      if (!formData.budget) {
        errors.budget = 'Please select an estimated budget range.';
      }
    } else if (currentStep === 4) {
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Please provide your full name.';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please provide a valid email address.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setGeneralError(null);
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setGeneralError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          const formatted: Record<string, string> = {};
          for (const key in data.fieldErrors) {
            formatted[key] = data.fieldErrors[key][0];
          }
          setFieldErrors(formatted);
        }
        setGeneralError(data.error || 'Failed to submit inquiry. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success
      setReferenceCode(data.referenceCode || 'SL-SUCCESS');
      setSubmissionSuccess(true);
      setStep(5);
      try {
        localStorage.removeItem('silverline_contact_draft');
        localStorage.removeItem('silverline_transferred_blueprint');
      } catch {
        // Storage unavailable
      }
    } catch {
      setGeneralError('Network error connecting to the server. Your input has been saved, please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefCode = () => {
    if (referenceCode) {
      navigator.clipboard.writeText(referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-surface border-border shadow-2xl relative">
      {/* Step Progress Indicators */}
      {!submissionSuccess && (
        <div className="mb-10 pb-6 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-silver">
              STEP 0{step} OF 04
            </span>
            <span className="font-mono text-xs text-muted">
              {step === 1 && 'Category'}
              {step === 2 && 'Project Scope'}
              {step === 3 && 'Budget Scope'}
              {step === 4 && 'Contact Information'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s < step
                    ? 'bg-status-success'
                    : s === step
                    ? 'bg-accent-blue'
                    : 'bg-surface-elevated'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* STEP 1: Project Category */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                What are you looking to build?
              </h2>
              <p className="text-xs text-muted">
                Select the primary focus of your product or technical requirement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, project_type: cat })}
                  className={`p-4 text-left rounded-xl border text-sm font-mono transition-all flex items-center justify-between ${
                    formData.project_type === cat
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white hover:border-silver/40'
                  }`}
                >
                  <span>{cat}</span>
                  {formData.project_type === cat && (
                    <CheckCircle2 className="h-4 w-4 text-accent-blue" />
                  )}
                </button>
              ))}
            </div>
            {fieldErrors.project_type && (
              <p className="text-xs text-status-error font-mono">{fieldErrors.project_type}</p>
            )}

            <div className="pt-6 flex justify-end">
              <Button type="button" onClick={handleNext} variant="primary" size="md" className="gap-2">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Project Details & Stage */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                Tell us about the project.
              </h2>
              <p className="text-xs text-muted">
                Describe the problem you are solving, core requirements, and current stage.
              </p>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-2">
                Project Scope & Requirements *
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Give us an overview of your product idea, target users, and key features..."
                className={`w-full bg-background-secondary border rounded-xl p-4 text-sm text-white placeholder:text-muted focus:outline-none ${
                  fieldErrors.description ? 'border-status-error' : 'border-border focus:border-silver/50'
                }`}
              />
              {fieldErrors.description && (
                <p className="text-xs text-status-error font-mono mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-2">
                Current Project Stage *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROJECT_STAGES.map((stg) => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => setFormData({ ...formData, project_stage: stg })}
                    className={`p-3 text-left rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                      formData.project_stage === stg
                        ? 'bg-surface-elevated text-white border-accent-blue'
                        : 'bg-background-secondary text-muted border-border hover:text-white'
                    }`}
                  >
                    <span>{stg}</span>
                    {formData.project_stage === stg && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <Button type="button" onClick={handleBack} variant="outline" size="md" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button type="button" onClick={handleNext} variant="primary" size="md" className="gap-2">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Budget Range */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                Anticipated Investment Scope
              </h2>
              <p className="text-xs text-muted">
                This helps us calibrate architecture scale, milestone sprints, and engineering capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: b })}
                  className={`p-4 text-left rounded-xl border text-sm font-mono transition-all flex items-center justify-between ${
                    formData.budget === b
                      ? 'bg-surface-elevated text-white border-accent-blue shadow-sm'
                      : 'bg-background-secondary text-muted border-border hover:text-white hover:border-silver/40'
                  }`}
                >
                  <span>{b}</span>
                  {formData.budget === b && (
                    <CheckCircle2 className="h-4 w-4 text-accent-blue" />
                  )}
                </button>
              ))}
            </div>
            {fieldErrors.budget && (
              <p className="text-xs text-status-error font-mono">{fieldErrors.budget}</p>
            )}

            <div className="pt-6 flex justify-between">
              <Button type="button" onClick={handleBack} variant="outline" size="md" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button type="button" onClick={handleNext} variant="primary" size="md" className="gap-2">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact Information */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                Where should we send the proposal?
              </h2>
              <p className="text-xs text-muted">
                Your direct information is strictly confidential and protected under our Privacy Policy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Vance"
                  className={`w-full bg-background-secondary border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none ${
                    fieldErrors.name ? 'border-status-error' : 'border-border focus:border-silver/50'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-status-error font-mono mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className={`w-full bg-background-secondary border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none ${
                    fieldErrors.email ? 'border-status-error' : 'border-border focus:border-silver/50'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-status-error font-mono mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="w-full bg-background-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-silver block mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-silver/50"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <Button type="button" onClick={handleBack} variant="outline" size="md" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                variant="primary"
                size="md"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit Inquiry</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmation View */}
        {step === 5 && (
          <div className="py-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="h-16 w-16 rounded-full bg-status-success/10 border border-status-success/40 flex items-center justify-center text-status-success mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-status-success">
                TRANSMISSION VERIFIED
              </div>
              <h2 className="font-heading text-3xl font-bold text-white">
                Inquiry Received.
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Thank you, <span className="text-white font-medium">{formData.name}</span>. Our engineering collective has received your specifications and will follow up within 24 to 48 business hours.
              </p>
            </div>

            {/* Reference Code Box */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-elevated border border-border">
              <div className="text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark block">
                  INQUIRY REFERENCE CODE
                </span>
                <span className="font-mono text-base font-bold text-accent-blue">
                  {referenceCode}
                </span>
              </div>
              <button
                type="button"
                onClick={copyRefCode}
                className="p-2 rounded-lg bg-surface border border-border text-silver hover:text-white transition-colors"
                title="Copy reference code"
                aria-label="Copy reference code"
              >
                {copied ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="pt-6">
              <Button href="/" variant="outline" size="md">
                Return to Studio Homepage
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};
