import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity, SUPER_ADMIN_EMAIL } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, users: data || [] });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Only Super Admins can update admin accounts' }, { status: 403 });
  }

  const body = await req.json();
  const { id, role, is_active } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  // Protect the initial Super Admin owner from being demoted or deactivated
  const { data: targetUser } = await client.from('admin_users').select('email').eq('id', id).single();
  if (targetUser && targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    if (role && role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'The primary owner account role cannot be changed' }, { status: 400 });
    }
    if (is_active === false) {
      return NextResponse.json({ success: false, error: 'The primary owner account cannot be deactivated' }, { status: 400 });
    }
  }

  const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (role) updateFields.role = role;
  if (typeof is_active === 'boolean') updateFields.is_active = is_active;

  const { data, error } = await client
    .from('admin_users')
    .update(updateFields)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_ADMIN_USER', 'admin_users', id, { role, is_active });

  return NextResponse.json({ success: true, user: data });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Only Super Admins can remove admins' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  if (id === admin.userId) {
    return NextResponse.json({ success: false, error: 'You cannot delete your own account' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  // Check email
  const { data: targetUser } = await client.from('admin_users').select('email').eq('id', id).single();
  if (targetUser && targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ success: false, error: 'Cannot remove primary owner account' }, { status: 400 });
  }

  const { error } = await client.from('admin_users').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_ADMIN_USER', 'admin_users', id);

  return NextResponse.json({ success: true, message: 'Admin user deleted' });
}
