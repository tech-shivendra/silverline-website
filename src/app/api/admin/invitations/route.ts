import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('admin_invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, invitations: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Only Super Admins can invite new administrators' }, { status: 403 });
  }

  const body = await req.json();
  const { email, role } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
  }

  const validRoles = ['super_admin', 'admin', 'editor'];
  const assignedRole = validRoles.includes(role) ? role : 'admin';

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  // Check if user is already an admin
  const { data: existingAdmin } = await client
    .from('admin_users')
    .select('id, email')
    .eq('email', email.toLowerCase())
    .single();

  if (existingAdmin) {
    return NextResponse.json({ success: false, error: 'An admin account with this email already exists' }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const { data: invitation, error } = await client
    .from('admin_invitations')
    .upsert({
      email: email.toLowerCase(),
      role: assignedRole,
      invited_by: admin.userId,
      token,
      expires_at: expiresAt,
      accepted_at: null
    }, { onConflict: 'email' })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('INVITE_ADMIN', 'admin_invitations', invitation.id, { email, role: assignedRole });

  return NextResponse.json({
    success: true,
    invitation,
    inviteLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/login?invite=${token}&email=${encodeURIComponent(email)}`
  }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Invitation ID required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { error } = await client.from('admin_invitations').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('REVOKE_INVITATION', 'admin_invitations', id);

  return NextResponse.json({ success: true, message: 'Invitation revoked' });
}
