-- SilverLine Studio Database Schema Migration
-- Migration: 20260302000000_admin_cms_and_theme.sql
-- Adds Admin CMS, Role Management, Activity Logging, and Dynamic Site Settings

-- 1. Technologies Table
CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Frontend', 'Backend', 'Database and Infrastructure', 'Mobile', 'Tools'
    role TEXT NOT NULL,
    icon TEXT NOT NULL,
    associated_projects TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_technologies_category ON public.technologies(category);
CREATE INDEX IF NOT EXISTS idx_technologies_published ON public.technologies(published);
CREATE INDEX IF NOT EXISTS idx_technologies_display_order ON public.technologies(display_order);

-- 2. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(published);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON public.faqs(display_order);

-- 3. Site Settings Table (Key-Value configuration for CMS)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON public.media_assets(created_at DESC);

-- 5. Extend Inquiries Table with internal administrative notes
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- 6. Admin Users Table (Profiles linked to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'editor',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- 7. Admin Invitations Table
CREATE TABLE IF NOT EXISTS public.admin_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'admin',
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);

-- 8. Activity Logs Table (Audit trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- -----------------------------------------------------------------------------
-- SECURITY DEFINER HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Helper: Check if current authenticated user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
          AND is_active = true
    );
$$;

-- Helper: Check if current authenticated user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
          AND role = 'super_admin'
          AND is_active = true
    );
$$;

-- -----------------------------------------------------------------------------
-- OWNER BOOTSTRAP TRIGGER & INVITATION ACCEPTANCE
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_admin_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_invitation RECORD;
BEGIN
    -- 1. Owner bootstrap check: techshivendraa@gmail.com is automatically Super Admin
    IF lower(NEW.email) = 'techshivendraa@gmail.com' THEN
        INSERT INTO public.admin_users (id, email, name, role, is_active)
        VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Shivendra Pratap Singh'), 'super_admin', true)
        ON CONFLICT (id) DO UPDATE
        SET role = 'super_admin', is_active = true, updated_at = now();

        -- Also ensure record exists if email matched
        INSERT INTO public.activity_logs (user_id, user_email, action, entity_type, entity_id, details)
        VALUES (NEW.id, NEW.email, 'SUPER_ADMIN_BOOTSTRAP', 'admin_users', NEW.id::text, '{"source": "system_bootstrap"}'::jsonb);

        RETURN NEW;
    END IF;

    -- 2. Check for pending valid invitation
    SELECT * INTO v_invitation
    FROM public.admin_invitations
    WHERE lower(email) = lower(NEW.email)
      AND accepted_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
        -- Accept invitation and provision admin user
        INSERT INTO public.admin_users (id, email, name, role, is_active)
        VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Studio Administrator'), v_invitation.role, true)
        ON CONFLICT (id) DO UPDATE
        SET role = v_invitation.role, is_active = true, updated_at = now();

        UPDATE public.admin_invitations
        SET accepted_at = now()
        WHERE id = v_invitation.id;

        INSERT INTO public.activity_logs (user_id, user_email, action, entity_type, entity_id, details)
        VALUES (NEW.id, NEW.email, 'INVITATION_ACCEPTED', 'admin_users', NEW.id::text, json_build_object('role', v_invitation.role)::jsonb);

        RETURN NEW;
    END IF;

    -- Uninvited users do not receive any admin profile
    RETURN NEW;
END;
$$;

-- Trigger on auth.users for bootstrap and invitation handling
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT OR UPDATE OF email ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_auth_user();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES FOR ADMIN CMS
-- -----------------------------------------------------------------------------

ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Technologies RLS
CREATE POLICY "Public can view published technologies"
    ON public.technologies FOR SELECT
    USING (published = true);

CREATE POLICY "Admins have full access to technologies"
    ON public.technologies FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. FAQs RLS
CREATE POLICY "Public can view published faqs"
    ON public.faqs FOR SELECT
    USING (published = true);

CREATE POLICY "Admins have full access to faqs"
    ON public.faqs FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Site Settings RLS
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins have full access to site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Media Assets RLS
CREATE POLICY "Public can view media assets"
    ON public.media_assets FOR SELECT
    USING (true);

CREATE POLICY "Admins have full access to media assets"
    ON public.media_assets FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. Projects RLS (Update existing table to allow admin full access)
CREATE POLICY "Admins have full access to projects"
    ON public.projects FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Services RLS (Update existing table to allow admin full access)
CREATE POLICY "Admins have full access to services"
    ON public.services FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. Team Members RLS (Update existing table to allow admin full access)
CREATE POLICY "Admins have full access to team members"
    ON public.team_members FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8. Testimonials RLS (Update existing table to allow admin full access)
CREATE POLICY "Admins have full access to testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 9. Inquiries RLS (Admins can view and update leads)
CREATE POLICY "Admins can view all inquiries"
    ON public.inquiries FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update inquiries"
    ON public.inquiries FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 10. Admin Users RLS
CREATE POLICY "Active admins can view admin profiles"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Super admins can manage admin users"
    ON public.admin_users FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- 11. Admin Invitations RLS
CREATE POLICY "Super admins can manage admin invitations"
    ON public.admin_invitations FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- 12. Activity Logs RLS
CREATE POLICY "Admins can view activity logs"
    ON public.activity_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (public.is_admin());
