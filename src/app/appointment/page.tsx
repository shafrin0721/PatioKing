"use client";

import { useState } from "react";
import { PageFrame } from "@/components/PatioShell";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

const whatsappNumber = "94773424994";

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const message = [
      "Patio King visit request",
      `Name: ${values.firstName} ${values.lastName}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Consultation: ${values.consultation}`,
      `Preferred date: ${values.date}`,
      `Preferred time: ${values.time}`,
      `Project details: ${values.details || "Not provided"}`,
    ].join("\n");
    setPendingMessage(message);
  };

  const sendToWhatsApp = () => {
    if (!pendingMessage) return;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(pendingMessage)}`, "_blank", "noopener,noreferrer");
    setPendingMessage(null);
    setSubmitted(true);
  };

  return <PageFrame><section className="appointment-page"><div className="appointment-hero"><small>PRIVATE CONSULTATION</small><h1>Let&apos;s make space<br /><em>for your ideas.</em></h1><p>Visit the Patio King studio for a one-to-one consultation. Bring your measurements, moodboards or simply a feeling you want to create.</p></div><div className="appointment-content"><div><small>BOOK A VISIT</small><h2>A considered conversation<br />starts here.</h2><p>Tell us a little about your project and preferred time. Our team will confirm your appointment by email or phone.</p><div className="appointment-details"><p><b>Studio hours</b><br />Monday - Sunday | 9:00-17:00<br /></p><p><b>Location</b><br />Colombo, Sri Lanka<br />Appointments by arrangement</p></div></div>{submitted ? <div className="appointment-success"><span>OK</span><h3>Request received.</h3><p>Thank you. We&apos;ll be in touch shortly to confirm your consultation.</p><button className="dark-button" onClick={() => setSubmitted(false)}>Book another visit</button></div> : <form className="appointment-form" onSubmit={handleSubmit}><div className="form-row"><label>First name<input name="firstName" required placeholder="Your first name" /></label><label>Last name<input name="lastName" required placeholder="Your last name" /></label></div><label>Email address<input name="email" required type="email" placeholder="you@example.com" /></label><label>Phone number<input name="phone" required placeholder="+94 77 342 4994" /></label><label>What are you visiting for?<select name="consultation" defaultValue="" required><option value="" disabled>Select a consultation type</option><option>Custom furniture</option><option>Home furnishing</option><option>Outdoor project</option><option>Trade consultation</option></select></label><div className="form-row"><label>Preferred date<input name="date" required type="date" /></label><label>Preferred time<select name="time" defaultValue="" required><option value="" disabled>Select a time</option><option>09:00 - 11:00</option><option>11:00 - 13:00</option><option>14:00 - 16:00</option></select></label></div><label>Tell us about your project<textarea name="details" placeholder="Room type, approximate size, timeline or anything else that will help us prepare..." /></label><button className="dark-button" type="submit">Request appointment -&gt;</button></form>}</div></section><ConfirmationDialog open={Boolean(pendingMessage)} title="Ready to send your visit request?" message="Your request will open in WhatsApp with all of the details you entered. You can review it once more before sending." onConfirm={sendToWhatsApp} onCancel={() => setPendingMessage(null)} /></PageFrame>;
}
