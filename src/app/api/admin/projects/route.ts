import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { projectsData } from '@/data/projects';

// GET all projects (including drafts for admins)
export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  try {
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, projects: projectsData });
    }

    return NextResponse.json({ success: true, projects: data });
  } catch (err) {
    return NextResponse.json({ success: true, projects: projectsData });
  }
}

// POST create a new project
export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

    const projectPayload = {
      title: body.title,
      slug: body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: body.description || '',
      long_description: body.long_description || body.description || '',
      category: body.category || 'Web Applications',
      project_status: body.project_status || 'completed',
      thumbnail_url: body.thumbnail_url || null,
      cover_url: body.cover_url || null,
      gallery: body.gallery || [],
      tech_stack: body.tech_stack || [],
      live_url: body.live_url || null,
      github_url: body.github_url || null,
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      display_order: Number(body.display_order) || 0,
      problem_statement: body.problem_statement || null,
      objectives: body.objectives || null,
      solution: body.solution || null,
      design_approach: body.design_approach || null,
      architecture: body.architecture || null,
      major_features: body.major_features || [],
      results: body.results || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('projects')
      .insert(projectPayload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await logActivity(
      'CREATE_PROJECT',
      'projects',
      data.id,
      { title: data.title, slug: data.slug }
    );

    return NextResponse.json({ success: true, project: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
