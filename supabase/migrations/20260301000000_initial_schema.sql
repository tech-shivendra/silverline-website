-- SilverLine Studio Database Schema Migration
-- Migration: 20260301000000_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Web Applications', 'Mobile Applications', 'SaaS', 'AI & Automation', 'Experimental Concepts'
    project_status TEXT NOT NULL DEFAULT 'completed', -- 'live', 'completed', 'in_progress', 'internal_experiment', 'concept'
    thumbnail_url TEXT,
    cover_url TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    problem_statement TEXT,
    objectives TEXT,
    solution TEXT,
    design_approach TEXT,
    architecture TEXT,
    major_features JSONB DEFAULT '[]'::jsonb,
    results TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index on slug, category, published, and featured
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);

-- 2. Inquiries Table (Leads)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT NOT NULL,
    description TEXT NOT NULL,
    platform TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    budget TEXT NOT NULL,
    project_stage TEXT NOT NULL,
    design_preference TEXT,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Discussion', 'Proposal Sent', 'Converted', 'Rejected', 'Archived'
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_ref_code ON public.inquiries(reference_code);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    skills TEXT[] DEFAULT '{}',
    linkedin_url TEXT,
    github_url TEXT,
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_published ON public.team_members(published);
CREATE INDEX IF NOT EXISTS idx_team_display_order ON public.team_members(display_order);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    capabilities JSONB DEFAULT '[]'::jsonb,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(published);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT,
    testimonial TEXT NOT NULL,
    avatar_url TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published);

-- 6. Email Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE CASCADE,
    recipient TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'internal_notification', 'visitor_acknowledgement'
    delivery_status TEXT NOT NULL, -- 'sent', 'failed', 'queued'
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_inquiry ON public.email_logs(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(delivery_status);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Projects: Public read-only for published projects
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (published = true);

-- Services: Public read-only for published services
CREATE POLICY "Public can view published services"
    ON public.services FOR SELECT
    USING (published = true);

-- Team Members: Public read-only for published members
CREATE POLICY "Public can view published team members"
    ON public.team_members FOR SELECT
    USING (published = true);

-- Testimonials: Public read-only for published testimonials
CREATE POLICY "Public can view published testimonials"
    ON public.testimonials FOR SELECT
    USING (published = true);

-- Inquiries: Public can insert new inquiries (anonymously or authenticated)
CREATE POLICY "Public can submit project inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

-- Inquiries: Deny public select/update/delete (only service_role key can read/manage)
-- No SELECT policy for anon/authenticated roles = blocked by default in RLS

-- Email Logs: Deny public select/insert/update/delete (only service_role key)
-- No public policies = blocked by default in RLS
