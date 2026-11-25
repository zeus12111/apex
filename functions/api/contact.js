import { sendMail, EMAIL_RE, clean, reply } from './_mail.js';

// POST /api/contact : the "Start a project" form
export async function onRequestPost({ request, env }) {
  let form;
  try { form = await request.formData(); } catch { return reply(request, 400, { error: 'The form could not be read.' }); }

  // Honeypot: real visitors never fill a field named "website"
  if (clean(form.get('website'))) return reply(request, 200, { message: 'Thank you.' });

  const name = clean(form.get('name'), 200);
  const email = clean(form.get('email'), 200);
  const phone = clean(form.get('phone'), 60);
  const business = clean(form.get('business'), 200);
  const service = clean(form.get('service'), 120);
  const message = clean(form.get('message'), 5000);

  if (!name || !EMAIL_RE.test(email) || !message) {
    return reply(request, 422, { error: 'Please fill in your name, a valid email and a line about your business.' });
  }

  const text = [
    `New project inquiry from the website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone || '-'}`,
    `Business: ${business || '-'}`,
    `Service: ${service || '-'}`,
    ``,
    message,
  ].join('\n');

  const sent = await sendMail(env, { subject: `Project inquiry: ${business || name}`, text, replyTo: email });
  if (!sent.ok) return reply(request, sent.status, { error: sent.error });
  return reply(request, 200, { message: 'Your project request is in. We usually reply within one business day.' });
}

export const onRequest = ({ request }) => reply(request, 405, { error: 'Use the form on the website.' });
