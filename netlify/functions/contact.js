const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]{7,}$/;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function validatePayload(payload) {
  const errors = [];

  if (payload.name.length < 2) {
    errors.push("name");
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    errors.push("email");
  }

  if (payload.phone && !PHONE_PATTERN.test(payload.phone)) {
    errors.push("phone");
  }

  if (payload.subject.length < 2) {
    errors.push("subject");
  }

  if (payload.message.length < 10) {
    errors.push("message");
  }

  return errors;
}

function buildEmailHtml(payload) {
  const sanitizedMessage = escapeHtml(payload.message).replace(/\r?\n/g, "<br>");

  return [
    "<h2>New Contact Form Submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(payload.phone || "-")}</p>`,
    `<p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${sanitizedMessage}</p>`
  ].join("");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const payload = {
    name: (data.name || "").trim(),
    email: (data.email || "").trim(),
    phone: (data.phone || "").trim(),
    subject: (data.subject || "").trim(),
    message: (data.message || "").trim(),
    website: (data.website || "").trim()
  };

  if (payload.website) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const validationErrors = validatePayload(payload);
  if (validationErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Please provide valid form inputs",
        fields: validationErrors
      })
    };
  }

  const to = process.env.TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Email service not configured" }) };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Pamoja Outreach <onboarding@resend.dev>",
        to,
        reply_to: payload.email,
        subject: `New Contact Form Submission: ${payload.subject}`,
        html: buildEmailHtml(payload)
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return { statusCode: 502, body: JSON.stringify({ error: "Failed to send email", detail }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
