import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const Arrow = () => <span aria-hidden="true">↗</span>;

function ProductPreview() {
  return (
    <div className="preview-window">
      <div className="preview-topbar">
        <div className="window-dots"><i /><i /><i /></div>
        <div className="preview-address">app.caseload.ai / notes / review</div>
        <div className="preview-avatar">JD</div>
      </div>
      <div className="preview-body">
        <aside className="preview-rail">
          <div className="mini-logo">C</div>
          <div className="rail-item active"><span>◈</span> Overview</div>
          <div className="rail-item"><span>◌</span> New note</div>
          <div className="rail-item"><span>✓</span> Tasks</div>
          <div className="rail-item"><span>⌁</span> Library</div>
          <div className="rail-spacer" />
          <div className="rail-item"><span>⚙</span> Settings</div>
        </aside>
        <main className="preview-main">
          <div className="preview-heading"><div><small>MONDAY, 14 OCTOBER</small><h3>Good morning, Jamie.</h3></div><button>+ New note</button></div>
          <div className="metric-row">
            <div><small>NOTES THIS WEEK</small><strong>24</strong><em>+18% ↗</em></div>
            <div><small>TIME RETURNED</small><strong>6.4 hrs</strong><em>to your team</em></div>
            <div><small>OPEN FOLLOW-UPS</small><strong>08</strong><em className="warn">2 due today</em></div>
          </div>
          <div className="note-card">
            <div className="note-card-head"><div><small>RECENT NOTE · JUST NOW</small><h4>Progress note · Jordan Reyes</h4></div><span className="approved">✓ Approved</span></div>
            <p>Jordan shared that the new morning routine is helping them feel more confident before work. They would like to continue building...</p>
            <div className="note-footer"><span>Generated from a 12:08 conversation</span><b>View note <Arrow /></b></div>
          </div>
          <div className="activity-row"><div className="activity-line"><span className="pulse" /><div><small>AGENT ACTIVITY</small><p>Incident check completed <b>without escalation</b></p></div></div><span>12:08 PM</span></div>
        </main>
      </div>
    </div>
  );
}

const languageSamples = [
  { name: "English", native: "Good morning, how are you feeling today?", code: "EN" },
  { name: "Spanish", native: "Buenos días, ¿cómo te sientes hoy?", code: "ES" },
  { name: "Mandarin", native: "早上好，你今天感觉怎么样？", code: "中" },
  { name: "Arabic", native: "صباح الخير، كيف تشعر اليوم؟", code: "ع" },
  { name: "Vietnamese", native: "Chào buổi sáng, hôm nay bạn cảm thấy thế nào?", code: "VI" },
];

function LanguageStudio() {
  const [selectedLanguage, setSelectedLanguage] = useState(languageSamples[0]);

  return (
    <section id="languages" className="language-section section-pad">
      <div className="language-intro">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Every voice belongs here</div>
          <h2>Care doesn’t<br /><span>sound one way.</span></h2>
        </div>
        <div className="language-copy">
          <p>Capture the conversation in the language people feel most themselves in. Caseload supports voice-led notes across <strong>up to 15 languages</strong>, while keeping the record clear for every member of the team.</p>
          <div className="language-stat"><strong>15</strong><span>languages<br />supported</span></div>
        </div>
      </div>
      <div className="language-demo">
        <div className="language-demo-head"><span className="live-dot" /> Live voice capture <span className="demo-time">00:18</span></div>
        <div className="voice-panel">
          <div className="voice-orbit"><div className="voice-core"><span>✦</span></div></div>
          <div className="voice-content">
            <div className="voice-label">Listening in</div>
            <div className="voice-language">{selectedLanguage.name} <span>{selectedLanguage.code}</span></div>
            <p>“{selectedLanguage.native}”</p>
            <div className="waveform language-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="transcript-card"><span>AI DRAFT</span><p>Participant shared they are feeling positive about the week ahead.</p><b>Human review ready <Arrow /></b></div>
        </div>
        <div className="language-picker"><span>Try another language</span><div className="language-options">{languageSamples.map((language) => <button key={language.name} type="button" aria-pressed={selectedLanguage.name === language.name} className={selectedLanguage.name === language.name ? "selected" : ""} onClick={() => setSelectedLanguage(language)}><span>{language.code}</span>{language.name}</button>)}</div><small>+ 10 more languages</small></div>
      </div>
    </section>
  );
}

function DemoModal({ onClose }) {
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/send-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setStatus("error");
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("idle");
      setSent(true);
    } catch {
      setStatus("error");
      setError("We could not reach the email service. Please try again.");
    }
  }

  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      {!sent ? <>
        <div className="eyebrow">See Caseload in action</div><h2 id="demo-title">Make your team’s time count.</h2>
        <p>Tell us a little about your organisation and we’ll get in touch to arrange a walkthrough.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-grid"><label>First name<input name="firstName" required placeholder="Jamie" /></label><label>Work email<input name="email" required type="email" placeholder="jamie@organisation.com" /></label></div>
          <label>Organisation<input name="organisation" required placeholder="Your organisation" /></label>
          <label>What would you like to see?<select name="interest" required defaultValue=""><option value="" disabled>Select an option</option><option>Progress note workflow</option><option>Incident follow-up</option><option>Full platform overview</option></select></label>
          <button className="button button-dark full" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : <>Request a demo <Arrow /></>}</button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
      </> : <div className="success-state"><div className="success-icon">✓</div><div className="eyebrow">Request received</div><h2>We’ll be in touch soon.</h2><p>Thanks for your interest in Caseload AI. We’ve sent your request to the team.</p><button className="button button-dark" onClick={onClose}>Back to site <Arrow /></button></div>}
    </div>
  </div>;
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openDemo = () => setModalOpen(true);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return <div className="site-shell">
     <header className="nav"><a className="brand" href="#top"><span className="brand-mark">C</span><span>caseload<span className="brand-ai">AI</span></span></a><nav><a href="#product">Product</a><a href="#workflow">How it works</a><a href="#languages">Languages</a><a href="#why-now">Why now</a></nav><button className="button button-lime nav-button" onClick={openDemo}>Request a demo <Arrow /></button><button className="mobile-menu" onClick={() => scrollTo("product")} aria-label="Jump to product">☰</button></header>
    <main id="top">
      <section className="hero section-pad"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> Built for the people behind the care</div><h1>The operating layer for <span className="highlight">better support.</span></h1><p className="hero-lede">Caseload AI turns the conversations your team already has into clear, compliant NDIS records — so more energy goes back to the person, not the paperwork.</p><div className="hero-actions"><button className="button button-lime" onClick={openDemo}>Request a demo <Arrow /></button><button className="text-button" onClick={() => scrollTo("product")}>See how it works <span>↓</span></button></div><div className="social-proof"><div className="avatar-stack"><span>AM</span><span>JR</span><span>SK</span><span>+</span></div><div><strong>Built with support teams</strong><small>Designed around real NDIS workflows</small></div></div></div><div className="hero-visual"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="floating-tag tag-top"><span className="tag-icon">✦</span><div><b>AI-assisted</b><small>Human approved</small></div></div><ProductPreview /><div className="floating-tag tag-bottom"><span className="check-mark">✓</span><div><b>6.4 hrs returned</b><small>This week across your team</small></div></div></div></section>
      <section className="ticker"><div>TRUSTED BY TEAMS WHO CARE ABOUT THE DETAILS</div><div>NDIS READY <span>·</span> HUMAN FIRST <span>·</span> BUILT IN AUSTRALIA</div></section>
      <section id="product" className="section-pad problem-section"><div className="section-intro"><div className="eyebrow">The work behind the work</div><h2>Your team came to support people.<br /><i>Not chase paperwork.</i></h2><p>Every conversation contains the signal that matters. Caseload helps your team capture it, make sense of it, and act on it — without adding another heavy system to learn.</p></div><div className="problem-grid"><div className="problem-card card-dark"><div className="card-number">01</div><h3>Capture the moment</h3><p>Record a support conversation right from the browser. No double entry. No reconstructing the week on Friday afternoon.</p><div className="card-visual waveform"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div><div className="problem-card card-lime"><div className="card-number">02</div><h3>Find the signal</h3><p>Caseload listens for goals, outcomes, risks, and participant voice — then turns them into a structured first draft.</p><div className="card-visual signal"><b>participant voice</b><b>goals</b><b className="signal-accent">follow-up</b></div></div><div className="problem-card card-paper"><div className="card-number">03</div><h3>Keep momentum</h3><p>Human review stays at the centre. Once approved, the right follow-up tasks are already waiting for the right person.</p><div className="card-visual task-list"><span>✓ Progress note approved</span><span>○ Check in with Jordan</span><span>○ Review incident flag</span></div></div></div></section>
       <section id="workflow" className="section-pad workflow-section"><div className="workflow-copy"><div className="eyebrow">One clear record</div><h2>Less admin.<br /><span>More presence.</span></h2><p>Caseload brings the whole support note workflow into one calm, reviewable place. It does the sorting so your team can do the supporting.</p><button className="button button-outline" onClick={openDemo}>Explore the workflow <Arrow /></button></div><div className="steps"><div className="step active"><span>01</span><div><h3>Talk naturally</h3><p>Have the conversation as you normally would. Caseload captures the detail without getting in the way.</p></div><b>↗</b></div><div className="step"><span>02</span><div><h3>Review the signal</h3><p>Get a legible first draft with the participant’s voice, outcomes, and important details in context.</p></div><b>↗</b></div><div className="step"><span>03</span><div><h3>Move care forward</h3><p>Approve the note and let intelligent follow-ups keep everyone aligned and accountable.</p></div><b>↗</b></div></div></section>
       <LanguageStudio />
      <section id="why-now" className="quote-section"><div className="quote-mark">“</div><blockquote>Good care deserves<br /><span>a better record.</span></blockquote><div className="quote-source"><span className="source-line" />The idea behind Caseload AI</div></section>
      <section className="section-pad final-cta"><div><div className="eyebrow">Ready when you are</div><h2>Give your team<br /><span>their time back.</span></h2></div><div><p>See how Caseload can fit the way your organisation already works.</p><button className="button button-lime" onClick={openDemo}>Request a demo <Arrow /></button></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#top"><span className="brand-mark">C</span><span>caseload<span className="brand-ai">AI</span></span></a><span>© 2026 Caseload AI. Built for better support.</span><span>Made for the NDIS community <span className="footer-heart">✦</span></span></footer>
    {modalOpen && <DemoModal onClose={() => setModalOpen(false)} />}
  </div>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
