import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedAdmin, logActivity } from '@/lib/auth/admin';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { faqData } from '@/data/faq';

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
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, faqs: faqData.map((f, idx) => ({ id: `faq-${idx}`, ...f, category: 'General', display_order: idx + 1, published: true })) });
    }

    return NextResponse.json({ success: true, faqs: data });
  } catch {
    return NextResponse.json({ success: true, faqs: faqData });
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
    .from('faqs')
    .insert({
      question: body.question,
      answer: body.answer,
      category: body.category || 'General',
      display_order: body.display_order || 0,
      published: body.published ?? true
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('CREATE_FAQ', 'faqs', data.id, { question: data.question });

  return NextResponse.json({ success: true, faq: data }, { status: 201 });
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
    .from('faqs')
    .update({ ...updateFields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('UPDATE_FAQ', 'faqs', id, { question: data?.question });

  return NextResponse.json({ success: true, faq: data });
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

  const { error } = await client.from('faqs').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  await logActivity('DELETE_FAQ', 'faqs', id);

  return NextResponse.json({ success: true, message: 'FAQ deleted' });
}
