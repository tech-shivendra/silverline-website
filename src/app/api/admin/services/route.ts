import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { servicesData } from '@/data/services';

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
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, services: servicesData });
    }

    return NextResponse.json({ success: true, services: data });
  } catch {
    return NextResponse.json({ success: true, services: servicesData });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('services')
    .insert({
      title: body.title,
      slug: body.slug,
      description: body.description,
      capabilities: body.capabilities || [],
      icon: body.icon || 'Globe',
      display_order: body.display_order || 0,
      published: body.published ?? true
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('CREATE_SERVICE', 'services', data.id, { title: data.title });

  return NextResponse.json({ success: true, service: data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updateFields } = body;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('services')
    .update({ ...updateFields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_SERVICE', 'services', id, { title: data?.title });

  return NextResponse.json({ success: true, service: data });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role === 'editor') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { error } = await client.from('services').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_SERVICE', 'services', id);

  return NextResponse.json({ success: true, message: 'Service deleted' });
}
