import { Resend } from 'resend';
import { InquirySubmission } from '@/types';

const resendApiKey = process.env.RESEND_API_KEY;
export const isResendConfigured = () => {
  return !!resendApiKey && !resendApiKey.includes('placeholder') && resendApiKey.startsWith('re_');
};

const resend = isResendConfigured() ? new Resend(resendApiKey) : null;

const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'studio@silverline.design';
const emailFrom = process.env.EMAIL_FROM || 'SilverLine Studio <inquiries@silverline.design>';

/**
 * Sends internal notification to the studio team
 */
export async function sendInternalInquiryNotification(
  inquiry: InquirySubmission,
  referenceCode: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.log(`[Email Mock - Internal Notification] Received inquiry ${referenceCode} from ${inquiry.email}`);
    return { success: true, messageId: `mock-internal-${referenceCode}` };
  }

  try {
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #08090B; color: #F5F5F5; padding: 32px; border: 1px solid #282C33; border-radius: 12px;">
        <h2 style="color: #FFFFFF; font-size: 24px; margin-bottom: 8px;">New Project Inquiry</h2>
        <p style="color: #8DA8FF; font-family: monospace; font-size: 14px; margin-top: 0;">Ref: ${referenceCode}</p>
        <hr style="border: 0; border-top: 1px solid #282C33; margin: 24px 0;" />
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #858B94; width: 140px;">Client Name:</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #858B94;">Email:</td>
            <td style="padding: 8px 0; color: #8DA8FF;"><a href="mailto:${inquiry.email}" style="color: #8DA8FF;">${inquiry.email}</a></td>
          </tr>
          ${inquiry.phone ? `<tr><td style="padding: 8px 0; color: #858B94;">Phone:</td><td style="padding: 8px 0; color: #FFFFFF;">${inquiry.phone}</td></tr>` : ''}
          ${inquiry.company ? `<tr><td style="padding: 8px 0; color: #858B94;">Company:</td><td style="padding: 8px 0; color: #FFFFFF;">${inquiry.company}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #858B94;">Category:</td>
            <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.project_type}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #858B94;">Budget Range:</td>
            <td style="padding: 8px 0; color: #8EC7A5; font-weight: 600;">${inquiry.budget}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #858B94;">Current Stage:</td>
            <td style="padding: 8px 0; color: #FFFFFF;">${inquiry.project_stage}</td>
          </tr>
          ${inquiry.platform ? `<tr><td style="padding: 8px 0; color: #858B94;">Target Platform:</td><td style="padding: 8px 0; color: #FFFFFF;">${inquiry.platform}</td></tr>` : ''}
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #101216; border: 1px solid #282C33; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #C6C9CE; font-size: 12px; text-transform: uppercase;">Project Description:</h4>
          <p style="margin: 0; color: #D1D5DB; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${inquiry.description}</p>
        </div>

        <p style="margin-top: 32px; font-size: 11px; color: #5A606A; font-family: monospace;">
          SilverLine Studio Automated Telemetry — ${new Date().toISOString()}
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: notificationEmail,
      subject: `New Project Inquiry [${referenceCode}] — ${inquiry.name} (${inquiry.project_type})`,
      html: htmlContent,
      text: `New Inquiry ${referenceCode}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nType: ${inquiry.project_type}\nBudget: ${inquiry.budget}\nDetails: ${inquiry.description}`
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Sends visitor acknowledgement receipt
 */
export async function sendVisitorAcknowledgement(
  inquiry: InquirySubmission,
  referenceCode: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.log(`[Email Mock - Visitor Acknowledgement] Sent receipt ${referenceCode} to ${inquiry.email}`);
    return { success: true, messageId: `mock-ack-${referenceCode}` };
  }

  try {
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #08090B; color: #F5F5F5; padding: 32px; border: 1px solid #282C33; border-radius: 12px;">
        <h2 style="color: #FFFFFF; font-size: 24px; margin-bottom: 8px;">We received your project inquiry.</h2>
        <p style="color: #8DA8FF; font-family: monospace; font-size: 14px; margin-top: 0;">Reference: ${referenceCode}</p>
        <hr style="border: 0; border-top: 1px solid #282C33; margin: 24px 0;" />

        <p style="font-size: 15px; color: #D1D5DB; line-height: 1.6;">
          Hello ${inquiry.name},
        </p>
        <p style="font-size: 15px; color: #D1D5DB; line-height: 1.6;">
          Thank you for reaching out to SilverLine Studio. We have received your project details for <strong style="color: #FFFFFF;">${inquiry.project_type}</strong>.
        </p>
        <p style="font-size: 15px; color: #D1D5DB; line-height: 1.6;">
          Our engineering leadership reviews all inquiries within 24 to 48 business hours to evaluate technical feasibility and schedule an introductory architecture discovery call.
        </p>

        <div style="margin: 24px 0; padding: 16px; background: #101216; border: 1px solid #282C33; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #C6C9CE; font-size: 12px; text-transform: uppercase;">Submitted Summary:</h4>
          <p style="margin: 0; color: #858B94; font-size: 13px;"><strong>Category:</strong> ${inquiry.project_type}</p>
          <p style="margin: 4px 0 0 0; color: #858B94; font-size: 13px;"><strong>Budget:</strong> ${inquiry.budget}</p>
          <p style="margin: 4px 0 0 0; color: #858B94; font-size: 13px;"><strong>Stage:</strong> ${inquiry.project_stage}</p>
        </div>

        <p style="font-size: 14px; color: #858B94;">
          If you have additional files or architecture briefs to share, you can reply directly to this email.
        </p>

        <hr style="border: 0; border-top: 1px solid #282C33; margin: 24px 0;" />
        <p style="font-size: 13px; color: #C6C9CE; font-weight: 600; margin-bottom: 2px;">
          SilverLine Studio
        </p>
        <p style="font-size: 12px; color: #858B94; margin-top: 0;">
          We don't just build products. We build what comes next.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: inquiry.email,
      subject: `We received your project inquiry [${referenceCode}] — SilverLine Studio`,
      html: htmlContent,
      text: `Hello ${inquiry.name},\nThank you for reaching out to SilverLine Studio. We received your project inquiry (${referenceCode}) for ${inquiry.project_type}. Our team will review your specifications within 24-48 business hours.\n\nSilverLine Studio`
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
