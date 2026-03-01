import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name    = data.get('name')?.toString().trim();
    const email   = data.get('email')?.toString().trim();
    const service = data.get('service')?.toString().trim() || '—';
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host:   import.meta.env.SMTP_HOST,
      port:   Number(import.meta.env.SMTP_PORT) || 465,
      secure: (import.meta.env.SMTP_PORT ?? '465') !== '587',
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
      // Hinzugefügt: Verhindert Zertifikats-Fehler bei manchen Plesk-Setups
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from:    `"ABTEILUNG83" <${import.meta.env.SMTP_FROM}>`,
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
    // Das schreibt den exakten SMTP Fehler in deine 'docker logs'
    console.error('CRITICAL_SMTP_ERROR:', error.message);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error.message 
    }), { status: 500 });
  }
};