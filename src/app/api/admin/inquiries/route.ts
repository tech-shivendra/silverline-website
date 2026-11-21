import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  try {
    let query = client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, inquiries: data || [] });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, internal_notes } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Inquiry ID is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };
  if (status) updatePayload.status = status;
  if (typeof internal_notes === 'string') updatePayload.internal_notes = internal_notes;

  const { data, error } = await client
    .from('inquiries')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_INQUIRY', 'inquiries', id, { status, ref: data.reference_code });

  return NextResponse.json({ success: true, inquiry: data });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Only Super Admins can delete inquiries' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Inquiry ID is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { error } = await client.from('inquiries').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_INQUIRY', 'inquiries', id);

  return NextResponse.json({ success: true, message: 'Inquiry deleted' });
}
