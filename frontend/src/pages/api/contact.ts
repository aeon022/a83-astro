import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// In-memory rate limit: max 5 submissions per IP per hour
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown';

    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
    }

    const data = await request.formData();

    // Honeypot: if filled, silently succeed (bot detected)
    const honeypot = data.get('website')?.toString() || '';
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Timing check: reject if submitted in under 2s or older than 2 hours
    const timestamp = parseInt(data.get('_t')?.toString() || '0', 10);
    const elapsed = Date.now() - timestamp;
    if (!timestamp || elapsed < 2_000 || elapsed > 7_200_000) {
      return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400 });
    }

    const name    = data.get('name')?.toString().trim();
    const email   = data.get('email')?.toString().trim();
    const service = data.get('service')?.toString().trim() || '—';
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || '37.252.190.170',
      port:   Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from:    `"ABTEILUNG83" <${process.env.SMTP_FROM || 'glitch@abteilung83.at'}>`,
      to:      'post@abteilung83.com',
      replyTo: email,
      subject: `[A83] New contact: ${name} — ${service}`,
      text:
        `Name:    ${name}\n` +
        `Email:   ${email}\n` +
        `Service: ${service}\n\n` +
        `${message}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e8e8e8;padding:32px;border-left:4px solid #ff4b12;">
          <h2 style="color:#ff4b12;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 24px">New Contact // ABTEILUNG83</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:8px 0;color:#888;width:80px;">NAME</td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">EMAIL</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#ff4b12;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">SERVICE</td><td style="padding:8px 0;">${service}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #333;margin:24px 0;">
          <p style="font-size:13px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error('CRITICAL_SMTP_ERROR:', error.message);

    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      details: error.message
    }), { status: 500 });
  }
};
