import { z } from 'zod';

export const contactFormSchema = z.object({
  project_type: z
    .string()
    .min(1, 'Please select a project category'),
  description: z
    .string()
    .min(10, 'Please provide a brief description (minimum 10 characters)')
    .max(3000, 'Description must not exceed 3000 characters'),
  platform: z
    .string()
    .optional(),
  features: z
    .array(z.string())
    .optional()
    .default([]),
  budget: z
    .string()
    .min(1, 'Please select a budget range'),
  project_stage: z
    .string()
    .min(1, 'Please select current project stage'),
  design_preference: z
    .string()
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(25, 'Phone number must be under 25 characters')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name must be under 100 characters')
    .optional()
    .or(z.literal('')),
  preferred_contact: z
    .string()
    .optional()
    .or(z.literal(''))
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
