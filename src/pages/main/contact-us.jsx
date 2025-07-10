import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="max-w-xl mx-auto p-8 font-sans">
      <h1 className="display-3 fw-bold mb-4">Contact Us</h1>
      <p className="lead mb-6 text-blue-gray-700">
        Our committed team is always available to answer questions and assist you.
      </p>
      <div className="mb-6">
        <p className="fw-bold mb-1">Pyxis Discovery</p>
        <p className="mb-0">
          Matrix Innovation Center
          <br />
          Science Park 408
          <br />
          1098XH Amsterdam
          <br />
          The Netherlands
        </p>
        <p className="mt-2 mb-0">
          Email:{" "}
          <a
            href="mailto:info@pyxis-discovery.com"
            className="text-blue-600 underline"
          >
            info@pyxis-discovery.com
          </a>
        </p>
      </div>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Thank you for contacting us! We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={form.name}
              onChange={handleChange}
              required
              className="form-control form-control-lg"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
              className="form-control form-control-lg"
            />
          </div>
          <div>
            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              value={form.subject}
              onChange={handleChange}
              required
              className="form-control form-control-lg"
            />
          </div>
          <div>
            <textarea
              name="message"
              placeholder="Message *"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="form-control form-control-lg resize-none"
            />
          </div>
          {error && <div className="text-danger text-sm">{error}</div>}
          <button
            type="submit"
            className="btn btn-success w-100 fw-bold py-2 text-lg"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
