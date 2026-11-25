// Shared helper for the two form endpoints. Sends an email through Resend (https://resend.com).
// Cloudflare Pages > Settings > Variables and Secrets:
//   RESEND_API_KEY  (secret)  your Resend API key
//   CONTACT_TO      (text)    the inbox that receives inquiries, e.g. you@yourdomain.com
//   CONTACT_FROM    (text)    a sender on a domain verified in Resend, e.g. "Apex Trio Website <website@yourdomain.com>"
export async function sendMail(env, { subject, text, replyTo }) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return { ok: false, status: 503, error: 'Email is not configured on the server.' };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) return { ok: false, status: 502, error: 'The email service refused the message.' };
  return { ok: true };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const clean = (v, max = 2000) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);

export function reply(request, status, body) {
  // A form posted without JavaScript gets a plain page back; the site's script asks for JSON.
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  if (wantsJson) return Response.json(body, { status });
  const msg = status < 300 ? body.message : body.error;
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Apex Trio</title>
<body style="font:18px/1.5 system-ui,sans-serif;background:#e6dbc7;color:#062b8a;max-width:36rem;margin:15vh auto;padding:0 24px">
<p>${msg}</p><p><a href="/" style="color:#062b8a">Back to the website</a></p></body>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
