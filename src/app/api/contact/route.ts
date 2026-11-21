import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/contact';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  sendInternalInquiryNotification,
  sendVisitorAcknowledgement
} from '@/lib/email/resend';
import { generateReferenceCode } from '@/lib/utils';
import { ApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Client IP Identification & Rate Limiting (5 requests per minute)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(ip, 5, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please wait a moment before trying again.'
        },
        { status: 429 }
      );
    }

    // 2. Body Parsing & JSON Validation
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload provided.'
        },
        { status: 400 }
      );
    }

    // 3. Zod Server-Side Schema Validation
    const validationResult = contactFormSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((err) => {
        const fieldName = err.path.join('.');
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(err.message);
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Please correct the highlighted form errors.',
          fieldErrors
        },
        { status: 422 }
      );
    }

    const data = validationResult.data;
    const referenceCode = generateReferenceCode();

    let inquiryId: string | null = null;

    // 4. Supabase Database Insertion
    const clientToUse = isSupabaseAdminConfigured()
      ? supabaseAdmin
      : isSupabaseConfigured()
      ? supabaseClient
      : null;

    if (clientToUse) {
      try {
        const { data: inserted, error: dbError } = await clientToUse
          .from('inquiries')
          .insert({
            reference_code: referenceCode,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            project_type: data.project_type,
            description: data.description,
            platform: data.platform || null,
            features: data.features || [],
            budget: data.budget,
            project_stage: data.project_stage,
            design_preference: data.design_preference || null,
            status: 'New',
            source: 'website'
          })
          .select('id')
          .single();

        if (dbError) {
          console.error('[Supabase DB Error]', dbError.message);
        } else if (inserted) {
          inquiryId = inserted.id;
        }
      } catch (dbErr) {
        console.error('[Supabase Unexpected Exception]', dbErr);
      }
    } else {
      console.log(`[Supabase Mock] Inquiry ${referenceCode} received from ${data.email}. (Supabase credentials not yet configured)`);
    }

    // 5. Asynchronous Email Triggering (Internal + Visitor Acknowledgement)
    const [internalRes, visitorRes] = await Promise.allSettled([
      sendInternalInquiryNotification(data, referenceCode),
      sendVisitorAcknowledgement(data, referenceCode)
    ]);

    // 6. Record Email Logs if Supabase is active and inquiry was inserted
    if (inquiryId && isSupabaseAdminConfigured()) {
      const logs = [];

      if (internalRes.status === 'fulfilled') {
        logs.push({
          inquiry_id: inquiryId,
          recipient: process.env.CONTACT_NOTIFICATION_EMAIL || 'studio@silverline.design',
          email_type: 'internal_notification',
          delivery_status: internalRes.value.success ? 'sent' : 'failed',
          provider_message_id: internalRes.value.messageId || null,
          error_message: internalRes.value.error || null
        });
      }

      if (visitorRes.status === 'fulfilled') {
        logs.push({
          inquiry_id: inquiryId,
          recipient: data.email,
          email_type: 'visitor_acknowledgement',
          delivery_status: visitorRes.value.success ? 'sent' : 'failed',
          provider_message_id: visitorRes.value.messageId || null,
          error_message: visitorRes.value.error || null
        });
      }

      if (logs.length > 0) {
        await supabaseAdmin.from('email_logs').insert(logs);
      }
    }

    // 7. Verified Success Response
    return NextResponse.json(
      {
        success: true,
        referenceCode,
        message: 'Your project inquiry has been received. Our engineering leadership will review your specifications within 24 to 48 hours.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Contact API Fatal Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while processing your inquiry. Please try again or email us directly at studio@silverline.design.'
      },
      { status: 500 }
    );
  }
}
