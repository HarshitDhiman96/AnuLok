import React, { useState } from 'react';
import { Mail, Phone, Send, Clock, HelpCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import StoreLocation from '../components/common/StoreLocation';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consultation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! An Anulok design concierge will contact you within 24 hours.');
  };

  return (
    <div className="bg-anulok-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
            Concierge & Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-anulok-espresso mt-2">
            Get in Touch
          </h1>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            Whether inquiring about custom dimensioning, showroom walkthroughs, or trade collaborations, our team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-bold text-anulok-espresso">Atelier Concierge</h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-anulok-wood shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-anulok-espresso text-sm">Get in touch</strong>
                    <a href="tel:+919410540096" className="block hover:text-anulok-wood">Calling - 9410540096</a>
                    <a href="https://wa.me/919368656212" target="_blank" rel="noreferrer" className="block hover:text-anulok-wood">
                      WhatsApp - 9368656212
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-anulok-wood shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-anulok-espresso text-sm">Email Inquiries</strong>
                    <a href="mailto:dhimanwoodworks91@gmail.com" className="break-all hover:text-anulok-wood">
                      dhimanwoodworks91@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-anulok-wood shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-anulok-espresso text-sm">Hours of Operation</strong>
                    <p>Monday - Sunday: 10:00 AM – 8:00 PM IST</p>
                  </div>
                </div>

              </div>
            </div>

            {/* FAQ Box */}
            <div className="bg-anulok-linen p-5 sm:p-8 rounded-3xl border border-stone-200">
              <h4 className="font-serif text-lg font-bold text-anulok-espresso flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-anulok-amber" /> Common Questions
              </h4>
              <div className="space-y-3 text-xs text-stone-600">
                <p>
                  <strong className="text-anulok-espresso block">Can I customize dimensions or fabrics?</strong>
                  Yes, for select sectionals, dining tables, and beds, custom lengths are available upon request.
                </p>
                <p>
                  <strong className="text-anulok-espresso block">How does white-glove delivery work?</strong>
                  Our 2-person delivery crew unboxes, places, levels, and installs your pieces with zero hassle.
                </p>
              </div>

            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-5 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-anulok-espresso mb-6">Send A Message</h3>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h4 className="font-serif text-xl font-bold text-anulok-espresso">Message Received</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Thank you for reaching out. One of our interior specialists will connect with you via email or phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Aditi Sen"
                        className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="aditi@example.com"
                        className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                      >
                        <option value="Consultation">Design Consultation</option>
                        <option value="Showroom">Studio Appointment</option>
                        <option value="Custom">Custom Order</option>
                        <option value="Trade">Trade / Architect Partnership</option>
                        <option value="Order Support">Order & Delivery Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your home, project timeline, or questions about specific pieces..."
                      className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-3 text-xs outline-none focus:border-anulok-wood"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-4 h-4 text-anulok-amber" /> Send Message to Concierge
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 sm:mt-16">
          <StoreLocation />
        </div>
      </div>
    </div>
  );
}
