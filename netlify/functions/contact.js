exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  let data;
  try { data = JSON.parse(event.body || '{}'); } catch (_) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }
  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const subject = (data.subject || '').trim();
  const message = (data.message || '').trim();
  const website = (data.website || '').trim();
  if (website) { return { statusCode: 200, body: JSON.stringify({ ok: true }) }; }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || name.length < 2 || !emailOk || !subject || subject.length < 2 || !message || message.length < 10) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Please provide valid form inputs' }) };
  }
  const to = process.env.TO_EMAIL || 'husseintech256@gmail.com';
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }
  const html =
    `<h2>New Contact Form Submission</h2>` +
    `<p><strong>Name:</strong> ${name}</p>` +
    `<p><strong>Email:</strong> ${email}</p>` +
    `<p><strong>Phone:</strong> ${phone || '-'}</p>` +
    `<p><strong>Subject:</strong> ${subject}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<p>${message.replace(/\n/g, '<br>')}</p>`;
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Pamoja Outreach <onboarding@resend.dev>',
        to,
        reply_to: email,
        subject: `New Contact Form Submission: ${subject}`,
        html
      })
    });
    if (resp.ok) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } else {
      const text = await resp.text();
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email', detail: text }) };
    }
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
}
