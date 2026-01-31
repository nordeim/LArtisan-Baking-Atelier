import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ | L\'Artisan Baking Atelier',
  description: 'Find answers to frequently asked questions about our baking courses, enrollment, payment, and more.',
  openGraph: {
    title: 'FAQ | L\'Artisan Baking Atelier',
    description: 'Get answers to your questions about our courses and services.',
    type: 'website',
  },
};

const faqs = [
  {
    category: 'Courses',
    questions: [
      {
        q: 'Do I need prior baking experience to join your courses?',
        a: 'Not at all! We offer courses for all skill levels, from complete beginners to experienced bakers looking to refine their techniques. Each course clearly indicates the recommended skill level.',
      },
      {
        q: 'What is the class size?',
        a: 'Our hands-on classes are kept intimate with a maximum of 8 students per instructor. This ensures personalized attention and plenty of opportunity to ask questions.',
      },
      {
        q: 'Do I get to take home what I bake?',
        a: 'Absolutely! One of the joys of our classes is taking home your creations to share with family and friends. Please bring containers for transport.',
      },
      {
        q: 'Are ingredients and equipment provided?',
        a: 'Yes, all ingredients and professional-grade equipment are provided. You just need to bring an apron and your enthusiasm!',
      },
    ],
  },
  {
    category: 'Enrollment & Payment',
    questions: [
      {
        q: 'How do I enroll in a course?',
        a: 'Simply browse our courses, select the one you are interested in, and click "Enroll Now." You will be guided through the checkout process.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayNow, and bank transfer for corporate bookings.',
      },
      {
        q: 'Can I get a refund if I need to cancel?',
        a: 'Yes, we offer full refunds for cancellations made 14 days or more before the course start date. Cancellations within 7-14 days receive a 50% refund. No refunds for cancellations within 7 days.',
      },
      {
        q: 'Can I reschedule my course?',
        a: 'Yes, you can reschedule once at no charge if you provide at least 7 days notice. Additional rescheduling may incur a $50 administrative fee.',
      },
    ],
  },
  {
    category: 'Gift Cards & Corporate',
    questions: [
      {
        q: 'Do you offer gift cards?',
        a: 'Yes! Our gift cards make perfect presents for baking enthusiasts. They are available in denominations from $50 to $500 and never expire.',
      },
      {
        q: 'Do you offer corporate team building events?',
        a: 'Absolutely! We host corporate baking workshops for teams of 8-24 people. Contact us at corporate@artisan-baking-atelier.com for customized packages.',
      },
    ],
  },
  {
    category: 'Digital Courses',
    questions: [
      {
        q: 'How long do I have access to digital courses?',
        a: 'Once purchased, you have lifetime access to all digital course content, including any future updates we make to the material.',
      },
      {
        q: 'Can I download the videos?',
        a: 'Videos are available for streaming only through our platform. This helps us protect our content while ensuring you always have access to the latest versions.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Support
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Find answers to common questions about our courses, enrollment process, 
            and policies. Can not find what you are looking for? Contact us directly.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-16">
            {faqs.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-3 mb-8">
                  <HelpCircle className="w-6 h-6 text-crust-700" />
                  <h2 className="font-display text-2xl font-semibold text-crust-900">
                    {category.category}
                  </h2>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-2xl shadow-sm"
                    >
                      <h3 className="font-semibold text-crust-900 mb-3">
                        {faq.q}
                      </h3>
                      <p className="text-crust-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-crust-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-crust-600 mb-8 max-w-lg mx-auto">
            Our team is here to help. Reach out and we will get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
