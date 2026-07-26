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

  const { FORMSUBMIT_TO_EMAIL } = process.env;
  if (!FORMSUBMIT_TO_EMAIL) {
    console.error("Missing FORMSUBMIT_TO_EMAIL environment variable");
    return json(res, 500, { error: "Email delivery is not configured yet." });
  }

  const safe = { firstName: escapeHtml(firstName), email: escapeHtml(email), organisation: escapeHtml(organisation), interest: escapeHtml(interest) };
  const text = `New demo request\n\nName: ${firstName}\nEmail: ${email}\nOrganisation: ${organisation}\nInterested in: ${interest}`;
  const html = `<h2>New demo request</h2><p><strong>Name:</strong> ${safe.firstName}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Organisation:</strong> ${safe.organisation}</p><p><strong>Interested in:</strong> ${safe.interest}</p>`;

  try {
    const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_TO_EMAIL)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: `Demo request from ${firstName}`, _replyto: email, message: text, html }),
    });

    if (!formSubmitResponse.ok) {
      console.error("FormSubmit rejected the email", await formSubmitResponse.text());
      return json(res, 502, { error: "We could not send your request. Please try again." });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Resend request failed", error);
    return json(res, 502, { error: "We could not send your request. Please try again." });
  }
}
