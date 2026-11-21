import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { AdminUser, AdminRole } from '@/types';
import { redirect } from 'next/navigation';

export const SUPER_ADMIN_EMAIL = 'techshivendraa@gmail.com';

/**
 * Retrieves the currently authenticated admin user server-side.
 * Enforces database role verification and handles automatic owner bootstrap.
 */
export async function getAuthenticatedAdmin(): Promise<{
  userId: string;
  email: string;
  role: AdminRole;
  adminUser: AdminUser;
} | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return null;
  }

  const userEmail = user.email.toLowerCase();
  const isOwner = userEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  // Query admin_users table
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  let { data: adminRecord, error: dbError } = await client
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  // If user is the designated owner and not yet in admin_users, bootstrap immediately
  if ((!adminRecord || dbError) && isOwner) {
    const bootstrapData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || 'Shivendra Pratap Singh',
      role: 'super_admin' as AdminRole,
      is_active: true
    };

    const { data: created, error: insertError } = await client
      .from('admin_users')
      .upsert(bootstrapData)
      .select('*')
      .single();

    if (!insertError && created) {
      adminRecord = created;
      // Log bootstrap activity
      await logActivity(
        'OWNER_BOOTSTRAP',
        'admin_users',
        user.id,
        { source: 'server_auth_check', email: user.email },
        user.id,
        user.email
      );
    }
  }

  if (!adminRecord || !adminRecord.is_active) {
    return null;
  }

  return {
    userId: user.id,
    email: adminRecord.email,
    role: adminRecord.role as AdminRole,
    adminUser: adminRecord as AdminUser
  };
}

/**
 * Enforces admin authentication for Server Components.
 * Redirects to /admin/login if not logged in or unauthorized.
 */
export async function requireAdmin() {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    redirect('/admin/login');
  }
  return auth;
}

/**
 * Enforces super admin authentication for sensitive operations.
 */
export async function requireSuperAdmin() {
  const auth = await requireAdmin();
  if (auth.role !== 'super_admin') {
    redirect('/admin?error=unauthorized_access');
  }
  return auth;
}

/**
 * Records an entry into the activity_logs table for auditability.
 */
export async function logActivity(
  action: string,
  entity_type: string,
  entity_id?: string | null,
  details: Record<string, unknown> = {},
  user_id?: string | null,
  user_email?: string | null
) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

    let finalUserId = user_id;
    let finalUserEmail = user_email;

    if (!finalUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        finalUserId = user.id;
        finalUserEmail = user.email || null;
      }
    }

    await client.from('activity_logs').insert({
      user_id: finalUserId || null,
      user_email: finalUserEmail || null,
      action,
      entity_type,
      entity_id: entity_id || null,
      details
    });
  } catch (err) {
    console.error('[ActivityLog Error]', err);
  }
}
