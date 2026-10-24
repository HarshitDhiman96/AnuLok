import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory OTP storage with TTL
// Map<normalizedEmail, { code: string, createdAt: number, expiresAt: number, attempts: number, lastSentAt: number, name: string }>
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

// Clean up expired OTPs periodically every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

/**
 * Creates a nodemailer transport if free SMTP credentials exist in env.
 * Supports standard Gmail App Passwords (free) or any custom SMTP server.
 */
function getEmailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_USER, EMAIL_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const port = Number(SMTP_PORT) || 587;
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  if (EMAIL_USER && EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }

  return null;
}

/**
 * Generate 6-digit numeric OTP code
 */
function generateOtpCode() {
  return String(crypto.randomInt(100000, 999999));
}

/**
 * Luxury branded HTML email template for Anulok
 */
function buildOtpEmailHtml({ name, code }) {
  const patronName = name ? name.trim() : 'Valued Patron';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anulok Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1F1D1B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F5EE; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="580" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; width: 100%; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E5DFD5; box-shadow: 0 16px 40px rgba(31,29,27,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1F1D1B; padding: 36px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FAF7F2; font-size: 26px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;">
                A N U L O K
              </h1>
              <p style="margin: 6px 0 0 0; color: #C2935D; font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; font-weight: 500;">
                • CRAFTED LIVING •
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 36px;">
              <p style="margin: 0 0 8px 0; color: #8C6239; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">
                Private Atelier Account Verification
              </p>
              <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #1F1D1B; line-height: 1.3;">
                Welcome to Anulok, ${patronName}
              </h2>
              <p style="margin: 0 0 24px 0; color: #6E6862; font-size: 14px; line-height: 1.65;">
                Thank you for choosing Anulok for your living sanctuary. To complete your account registration and authenticate your email address, please use the 6-digit one-time verification code below:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FBF8F3; border: 1.5px dashed #C2935D; border-radius: 16px; margin: 24px 0;">
                <tr>
                  <td align="center" style="padding: 24px 20px;">
                    <div style="font-size: 40px; font-weight: 700; letter-spacing: 0.32em; color: #7B3F00; font-family: 'Courier New', Courier, monospace; line-height: 1;">
                      ${code}
                    </div>
                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #8F8880; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600;">
                      Code expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; color: #8F8880; font-size: 12px; line-height: 1.6;">
                <strong>Security Notice:</strong> Never share this code with anyone. Anulok concierges will never ask you for your verification code or account password.
              </p>

              <p style="margin: 0; color: #A0988E; font-size: 12px; line-height: 1.5;">
                If you did not initiate this registration request, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 24px 30px; text-align: center; border-top: 1px solid #EFEAE1; color: #8F8880; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #6E6862;">
                ANULOK CRAFTED LIVING ATELIER
              </p>
              <p style="margin: 0 0 6px 0;">
                Handcrafted Solid Teak, Honed Marble & Italian Bouclé
              </p>
              <p style="margin: 0; color: #B0A89E;">
                Bengaluru, Karnataka, India • support@anulok.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send or re-send registration OTP
 */
export async function sendRegistrationOtp({ email, name }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const now = Date.now();

  const existing = otpStore.get(normalizedEmail);
  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const remainingSecs = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
    throw new Error(`Please wait ${remainingSecs} seconds before requesting another verification code.`);
  }

  const code = generateOtpCode();
  otpStore.set(normalizedEmail, {
    code,
    name: name || '',
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now
  });

  const transporter = getEmailTransporter();
  let emailSent = false;

  if (transporter) {
    try {
      const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER || 'no-reply@anulok.com';
      await transporter.sendMail({
        from: `"Anulok Crafted Living" <${fromAddress}>`,
        to: normalizedEmail,
        subject: `${code} is your Anulok account verification code`,
        text: `Your Anulok verification code is: ${code}. It expires in 10 minutes. Please do not share it with anyone.`,
        html: buildOtpEmailHtml({ name, code })
      });
      emailSent = true;
      console.log(`[Anulok Email OTP] Verification email dispatched to ${normalizedEmail} successfully.`);
    } catch (err) {
      console.warn(`[Anulok Email OTP] Transporter dispatch error: ${err.message}`);
    }
  }

  // Always log to server console for developer convenience and transparency
  console.log('===========================================================');
  console.log(`[Anulok Email OTP] Verification code for ${normalizedEmail}: ${code}`);
  console.log(`[Anulok Email OTP] Email dispatched via SMTP: ${emailSent ? 'YES' : 'NO (Console Fallback)'}`);
  console.log('===========================================================');

  return {
    success: true,
    emailSent,
    message: emailSent
      ? `Verification code sent to ${normalizedEmail}. Please check your inbox.`
      : `Verification code generated for ${normalizedEmail}.`,
    // If SMTP is not yet configured, provide devCode for instantaneous testing
    ...(!emailSent ? { devCode: code } : {})
  };
}

/**
 * Verify submitted OTP code
 */
export function verifyRegistrationOtp({ email, code }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const submittedCode = String(code || '').trim();

  const record = otpStore.get(normalizedEmail);
  if (!record) {
    return { valid: false, error: 'No verification code was requested for this email, or it has expired.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'Too many incorrect attempts. Please request a fresh code.' };
  }

  if (record.code !== submittedCode) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      valid: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // Success: consume the OTP
  otpStore.delete(normalizedEmail);
  return { valid: true };
}
