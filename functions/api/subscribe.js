import { sendMail, EMAIL_RE, clean, reply } from './_mail.js';

// POST /api/subscribe : the newsletter field in the footer.
// It emails the address to your inbox; add it to your mailing tool from there
// (or swap this for your newsletter provider's API later).
export async function onRequestPost({ request, env }) {
  let form;
  try { form = await request.formData(); } catch { return reply(request, 400, { error: 'The form could not be read.' }); }
  const email = clean(form.get('email'), 200);
  if (!EMAIL_RE.test(email)) return reply(request, 422, { error: 'Please write a valid email address.' });

  const sent = await sendMail(env, {
    subject: 'New newsletter subscriber',
    text: `Add this address to the newsletter list:\n\n${email}`,
    replyTo: email,
  });
  if (!sent.ok) return reply(request, sent.status, { error: sent.error });
  return reply(request, 200, { message: 'You are on the list. Expect a few notes a year.' });
}

export const onRequest = ({ request }) => reply(request, 405, { error: 'Use the form on the website.' });
