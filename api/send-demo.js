const json = (res, status, body) => res.status(status).json(body);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const { firstName, email, organisation, interest } = req.body || {};
  if (!firstName || !email || !organisation || !interest) {
    return json(res, 400, { error: "Please complete all fields." });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return json(res, 400, { error: "Please enter a valid email address." });
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !RESEND_TO_EMAIL) {
    console.error("Missing Resend environment variables");
    return json(res, 500, { error: "Email delivery is not configured yet." });
  }

  const safe = { firstName: escapeHtml(firstName), email: escapeHtml(email), organisation: escapeHtml(organisation), interest: escapeHtml(interest) };
  const text = `New demo request\n\nName: ${firstName}\nEmail: ${email}\nOrganisation: ${organisation}\nInterested in: ${interest}`;
  const html = `<h2>New demo request</h2><p><strong>Name:</strong> ${safe.firstName}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Organisation:</strong> ${safe.organisation}</p><p><strong>Interested in:</strong> ${safe.interest}</p>`;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [RESEND_TO_EMAIL], reply_to: email, subject: `Demo request from ${firstName}`, text, html }),
    });

    if (!resendResponse.ok) {
      console.error("Resend rejected the email", await resendResponse.text());
      return json(res, 502, { error: "We could not send your request. Please try again." });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Resend request failed", error);
    return json(res, 502, { error: "We could not send your request. Please try again." });
  }
}
