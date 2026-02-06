import React, { useState } from "react";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

      <select name="subject" value={form.subject} onChange={handleChange} required>
        <option value="">Select Subject</option>
        <option>Flight Booking</option>
        <option>Cancellation/Change</option>
        <option>Baggage Inquiry</option>
        <option>Refund Request</option>
        <option>Feedback/Complaint</option>
        <option>Other</option>
      </select>

      <textarea
        name="message"
        placeholder="Your message"
        value={form.message}
        onChange={handleChange}
        required
      />

      <button type="submit">Send Message</button>

      {success && <p style={{ color: "green" }}>Message sent successfully ✔</p>}
    </form>
  );
};

export default ContactUs;
