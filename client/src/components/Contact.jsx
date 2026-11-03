
import { useState } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send your message.');
      }

      setFeedback({
        type: 'success',
        message: 'Thank you! Your message has been received.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    'w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white placeholder:text-gray-500 outline-none transition duration-300 focus:border-purple-500 focus:bg-white/[0.09] focus:ring-4 focus:ring-purple-500/10';

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-[#100d1c] px-6 py-24 text-white"
    >
      {/* Background decorative effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-purple-700/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
            Contact Pulse Fitness
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            LET'S TALK{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
              FITNESS.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Ready to take the next step in your fitness journey?
            Have a question about our classes or memberships?
            Send us a message.
          </p>
        </div>

        {/* Contact layout */}
        <div className="grid items-stretch gap-8 lg:grid-cols-5">
          {/* Left information panel */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/70 via-[#211633] to-[#171222] p-8 shadow-2xl lg:col-span-2 lg:p-10">
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-300">
                Get Started
              </p>

              <h3 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Your fitness journey starts with a conversation.
              </h3>

              <p className="mt-6 leading-7 text-purple-100/70">
                Whether you're new to fitness or looking to reach your next
                goal, we're here to help you find the right class and
                membership.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-300">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 015.5 3h13A2.5 2.5 0 0121 5.5v13a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 18.5v-13z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 6 8 6 8-6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/60">Send us a message</p>
                    <p className="font-semibold">Contact form</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-300">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-200/60">Explore</p>
                    <a
                      href="#classes"
                      className="font-semibold transition-colors hover:text-purple-300"
                    >
                      Our fitness classes
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[35px] border-white/[0.04]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full border border-purple-300/10"
            />
          </div>

          {/* Form panel */}
          <div className="rounded-3xl border border-white/10 bg-[#1b1728]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10 lg:col-span-3">
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Send us a message</h3>
              <p className="mt-2 text-sm text-gray-400">
                Fill in the details below and we'll receive your enquiry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-semibold text-gray-200"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete="name"
                    required
                    className={inputStyle}
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-semibold text-gray-200"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={255}
                    autoComplete="email"
                    required
                    className={inputStyle}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold text-gray-200"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  className={inputStyle}
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold text-gray-200"
                >
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={5000}
                  rows={6}
                  required
                  className={`${inputStyle} resize-y`}
                  placeholder="Tell us a little more about your enquiry..."
                />
                <p className="mt-2 text-right text-xs text-gray-500">
                  {formData.message.length}/5000 characters
                </p>
              </div>

              {feedback.message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    feedback.type === 'success'
                      ? 'border-green-500/30 bg-green-500/10 text-green-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                    </svg>
                  ) : null}
                  <span>{feedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4 font-bold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:-translate-y-1 hover:from-purple-500 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-purple-900/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
                {!loading && (
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Your enquiry will be securely saved so our team can review it.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
