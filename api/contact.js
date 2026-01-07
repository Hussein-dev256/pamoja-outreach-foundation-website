module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (e) { res.status(400).json({ error: 'Invalid JSON' }); return; }
  }
  const name = (data?.name || '').trim();
  const email = (data?.email || '').trim();
  const phone = (data?.phone || '').trim();
  const subject = (data?.subject || '').trim();
  const message = (data?.message || '').trim();
  const website = (data?.website || '').trim();
  if (website) { res.status(200).json({ ok: true }); return; }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || name.length < 2 || !emailOk || !subject || subject.length < 2 || !message || message.length < 10) {
    res.status(400).json({ error: 'Please provide valid form inputs' });
    return;
  }
  const to = process.env.TO_EMAIL || 'husseintech256@gmail.com';
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Email service not configured' });
    return;
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
      res.status(200).json({ ok: true });
    } else {
      const text = await resp.text();
      res.status(500).json({ error: 'Failed to send email', detail: text });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
