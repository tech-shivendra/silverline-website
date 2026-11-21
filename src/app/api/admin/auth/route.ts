import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password, action } = await req.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (action === 'logout') {
      await supabase.auth.signOut();
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid login credentials' },
        { status: 401 }
      );
    }

    // Verify admin status server-side
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      // User is not an active admin, sign them out
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error: 'Your account does not have administrative access. Please contact the studio owner.'
        },
        { status: 403 }
      );
    }

    await logActivity(
      'ADMIN_LOGIN',
      'auth',
      admin.userId,
      { email: admin.email, role: admin.role },
      admin.userId,
      admin.email
    );

    return NextResponse.json({
      success: true,
      user: {
        id: admin.userId,
        email: admin.email,
        role: admin.role,
        name: admin.adminUser.name
      }
    });
  } catch (error) {
    console.error('[Admin Auth API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
