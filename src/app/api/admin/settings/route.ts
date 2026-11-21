import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { siteConfig } from '@/data/siteConfig';

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
      .from('site_settings')
      .select('*');

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        settings: {
          general: {
            heroEyebrow: siteConfig.heroEyebrow,
            heroHeading: siteConfig.heroHeading,
            heroSupportingText: siteConfig.heroSupportingText,
            brandStatement: siteConfig.brandStatement,
            supportingStatement: siteConfig.supportingStatement,
            contactEmail: siteConfig.links.email,
            githubUrl: siteConfig.links.github,
            linkedinUrl: siteConfig.links.linkedin,
            twitterUrl: siteConfig.links.twitter
          },
          seo: {
            defaultTitle: 'SilverLine Studio | Product Development & Digital Innovation',
            titleTemplate: '%s | SilverLine Studio',
            defaultDescription: siteConfig.supportingStatement,
            ogImage: '/images/og-image.svg'
          }
        }
      });
    }

    const settingsMap: Record<string, unknown> = {};
    data.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch {
    return NextResponse.json({ success: true, settings: {} });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (admin.role === 'editor') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { key, value } = body;

  if (!key || !value) {
    return NextResponse.json({ success: false, error: 'Key and value are required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const client = isSupabaseAdminConfigured() ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('site_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
      updated_by: admin.userId
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_SETTINGS', 'site_settings', key, { key });

  return NextResponse.json({ success: true, setting: data });
}
