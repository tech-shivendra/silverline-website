// TypeScript Type Definitions for SilverLine Studio

export type ProjectCategory = 
  | 'All'
  | 'Web Applications'
  | 'Mobile Applications'
  | 'SaaS'
  | 'AI & Automation'
  | 'Experimental Concepts';

export type ProjectStatus = 
  | 'live'
  | 'completed'
  | 'in_progress'
  | 'internal_experiment'
  | 'concept';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: 'Web Applications' | 'Mobile Applications' | 'SaaS' | 'AI & Automation' | 'Experimental Concepts';
  project_status: ProjectStatus;
  thumbnail_url?: string;
  cover_url?: string;
  gallery: string[];
  tech_stack: string[];
  live_url?: string | null;
  github_url?: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  problem_statement?: string;
  objectives?: string;
  solution?: string;
  design_approach?: string;
  architecture?: string;
  major_features?: string[];
  results?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  capabilities: string[];
  icon: string;
  display_order: number;
  published: boolean;
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database and Infrastructure' | 'Mobile' | 'Tools';
  role: string;
  icon: string; // Identifier or SVG icon name
  associatedProjects?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string;
  skills: string[];
  linkedin_url?: string;
  github_url?: string;
  display_order: number;
  published: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  role?: string;
  testimonial: string;
  avatar_url?: string;
  project_title?: string;
  published: boolean;
  display_order: number;
}

// Product Architect Configurator Types
export interface ProductArchitectConfig {
  productType: string;
  designPreference: string;
  platform: string;
  features: string[];
  budget: string;
}

export interface ProductBlueprint {
  workingTitle: string;
  summary: string;
  selectedCapabilities: string[];
  suggestedTechStack: string[];
  suggestedStages: string[];
  estimatedComplexity: 'Low' | 'Medium' | 'High' | 'Enterprise';
  selectedBudgetRange: string;
  timestamp: string;
}

// Contact Inquiry Types
export type InquiryStatus = 
  | 'New'
  | 'Contacted'
  | 'Discussion'
  | 'Proposal Sent'
  | 'Converted'
  | 'Rejected'
  | 'Archived';

export interface InquirySubmission {
  project_type: string;
  description: string;
  platform?: string;
  features?: string[];
  budget: string;
  project_stage: string;
  design_preference?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferred_contact?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  referenceCode?: string;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
