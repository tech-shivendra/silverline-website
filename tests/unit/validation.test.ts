import { describe, it, expect } from 'vitest';
import { contactFormSchema } from '@/lib/validations/contact';

describe('Contact Form Validation Schema', () => {
  it('validates a correct inquiry submission', () => {
    const validData = {
      project_type: 'SaaS',
      description: 'We need an institutional portfolio risk analytics platform with real-time charts.',
      platform: 'Web',
      features: ['Authentication', 'Admin dashboard'],
      budget: '₹1 lakh–₹2 lakh',
      project_stage: 'Planning',
      design_preference: 'Futuristic',
      name: 'Alex Vance',
      email: 'alex@blackmesa.org',
      phone: '+1 555-0199',
      company: 'Black Mesa Tech',
      preferred_contact: 'email'
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const invalidEmail = {
      project_type: 'SaaS',
      description: 'A valid description of more than ten characters.',
      budget: '₹50,000–₹1 lakh',
      project_stage: 'Just an idea',
      name: 'Alex',
      email: 'not-an-email'
    };

    const result = contactFormSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.errors.find(e => e.path.includes('email'));
      expect(emailError?.message).toBe('Please enter a valid email address');
    }
  });

  it('rejects an empty or too short description', () => {
    const shortDesc = {
      project_type: 'Website',
      description: 'Short',
      budget: 'Under ₹25,000',
      project_stage: 'Just an idea',
      name: 'Alex Vance',
      email: 'alex@example.com'
    };

    const result = contactFormSchema.safeParse(shortDesc);
    expect(result.success).toBe(false);
    if (!result.success) {
      const descError = result.error.errors.find(e => e.path.includes('description'));
      expect(descError).toBeDefined();
    }
  });

  it('rejects missing required fields', () => {
    const missingData = {};
    const result = contactFormSchema.safeParse(missingData);
    expect(result.success).toBe(false);
  });
});
