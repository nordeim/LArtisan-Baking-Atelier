import { Metadata } from 'next';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | L\'Artisan Baking Atelier',
  description: 'Get in touch with L\'Artisan Baking Atelier. Visit our Singapore atelier, email us, or call for inquiries about courses and wholesale orders.',
  openGraph: {
    title: 'Contact Us | L\'Artisan Baking Atelier',
    description: 'We would love to hear from you. Reach out for course inquiries or wholesale orders.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            We Would Love to Hear From You
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Whether you have questions about our courses, want to place a wholesale order, 
            or just want to say hello, we are here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: MapPin,
                title: 'Visit Us',
                details: ['123 Tiong Bahru Road', 'Singapore 168123'],
              },
              {
                icon: Mail,
                title: 'Email Us',
                details: ['hello@artisan-baking-atelier.com', 'courses@artisan-baking-atelier.com'],
              },
              {
                icon: Phone,
                title: 'Call Us',
                details: ['+65 6123 4567', '+65 6123 4568 (Courses)'],
              },
              {
                icon: Clock,
                title: 'Opening Hours',
                details: ['Mon-Sat: 7am - 7pm', 'Sunday: 8am - 4pm'],
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-crust-700" />
                </div>
                <h3 className="font-display text-lg font-semibold text-crust-900 mb-2">
                  {item.title}
                </h3>
                {item.details.map((detail) => (
                  <p key={detail} className="text-crust-600 text-sm">{detail}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-crust-900 mb-6">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-crust-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-crust-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-crust-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="courses">Course Inquiry</option>
                    <option value="wholesale">Wholesale Order</option>
                    <option value="general">General Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-crust-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="bg-crust-200 rounded-3xl h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-crust-500 mx-auto mb-4" />
                <p className="text-crust-600 font-medium">Map Integration</p>
                <p className="text-crust-500 text-sm mt-2">
                  Google Maps or similar map service<br />would be integrated here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
