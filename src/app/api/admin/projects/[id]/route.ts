import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET single project
export async function GET(req: NextRequest, { params }: RouteContext) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project: data });
}

// PUT update project
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const updateData = {
    ...body,
    updated_at: new Date().toISOString()
  };
  delete updateData.id;

  const { data, error } = await client
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_PROJECT', 'projects', id, { title: data.title });

  return NextResponse.json({ success: true, project: data });
}

// DELETE project
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Editors cannot delete projects
  if (admin.role === 'editor') {
    return NextResponse.json({ success: false, error: 'Editors cannot delete projects' }, { status: 403 });
  }

  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { error } = await client
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_PROJECT', 'projects', id);

  return NextResponse.json({ success: true, message: 'Project deleted' });
}
