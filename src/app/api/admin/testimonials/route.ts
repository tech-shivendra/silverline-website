import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { testimonialsData } from '@/data/testimonials';

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
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, testimonials: testimonialsData });
    }

    return NextResponse.json({ success: true, testimonials: data });
  } catch {
    return NextResponse.json({ success: true, testimonials: testimonialsData });
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
    .from('testimonials')
    .insert({
      client_name: body.client_name,
      company: body.company,
      role: body.role || null,
      testimonial: body.testimonial,
      avatar_url: body.avatar_url || null,
      project_id: body.project_id || null,
      published: body.published ?? false,
      display_order: body.display_order || 0
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('CREATE_TESTIMONIAL', 'testimonials', data.id, { client: data.client_name });

  return NextResponse.json({ success: true, testimonial: data }, { status: 201 });
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
    .from('testimonials')
    .update(updateFields)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_TESTIMONIAL', 'testimonials', id, { client: data?.client_name });

  return NextResponse.json({ success: true, testimonial: data });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role === 'editor') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { error } = await client.from('testimonials').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_TESTIMONIAL', 'testimonials', id);

  return NextResponse.json({ success: true, message: 'Testimonial deleted' });
}
