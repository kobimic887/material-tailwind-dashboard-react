import React, { useState } from "react";
import { Input, Textarea, Button, Typography } from "@material-tailwind/react";

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
    <div className="max-w-xl mx-auto p-8">
      <Typography variant="h3" className="mb-4 font-bold">
        Contact Us
      </Typography>
      <Typography className="mb-6 text-blue-gray-700">
        Our committed team is always available to answer questions and assist you.
      </Typography>
      <div className="mb-6">
        <Typography variant="small" className="font-bold">
          Pyxis Discovery
        </Typography>
        <Typography variant="small">
          Matrix Innovation Center
          <br />
          Science Park 408
          <br />
          1098XH Amsterdam
          <br />
          The Netherlands
        </Typography>
        <Typography variant="small" className="mt-2">
          Email:{" "}
          <a
            href="mailto:info@pyxis-discovery.com"
            className="text-blue-600 underline"
          >
            info@pyxis-discovery.com
          </a>
        </Typography>
      </div>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Thank you for contacting us! We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <Input
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <Input
              label="Subject *"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <Textarea
              label="Message *"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="resize-none"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" color="blue" className="w-full">
            Send
          </Button>
        </form>
      )}
    </div>
  );
}
