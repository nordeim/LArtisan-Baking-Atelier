import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | L\'Artisan Baking Atelier',
  description: 'Terms and conditions for using L\'Artisan Baking Atelier website and services. Please read carefully before enrolling in our courses.',
  openGraph: {
    title: 'Terms of Service | L\'Artisan Baking Atelier',
    description: 'Terms and conditions for our services.',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-semibold text-crust-900 mb-8">
              Terms of Service
            </h1>
            <p className="text-crust-600 mb-8">
              Last updated: January 2026
            </p>

            <div className="prose prose-crust max-w-none">
              <p className="text-crust-600 leading-relaxed">
                Welcome to L&apos;Artisan Baking Atelier. By accessing our website and enrolling in our courses, 
                you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                1. Definitions
              </h2>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li><strong>&quot;Company&quot;</strong> refers to L&apos;Artisan Baking Atelier Pte. Ltd.</li>
                <li><strong>&quot;Course&quot;</strong> refers to any baking class, workshop, or educational content offered by the Company.</li>
                <li><strong>&quot;Student&quot;</strong> refers to any person who enrolls in a Course.</li>
                <li><strong>&quot;Website&quot;</strong> refers to our website at artisan-baking-atelier.com.</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                2. Enrollment and Payment
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                By enrolling in a Course, you agree to:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Pay all fees associated with the Course</li>
                <li>Comply with all safety and hygiene requirements</li>
                <li>Arrive on time for scheduled classes</li>
              </ul>
              <p className="text-crust-600 leading-relaxed mt-4">
                All prices are in Singapore Dollars (SGD) and inclusive of GST unless otherwise stated. 
                Payment must be made in full before the Course start date.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                3. Cancellation and Refund Policy
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                Our cancellation and refund policy is as follows:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li><strong>14+ days notice:</strong> Full refund minus 5% administrative fee</li>
                <li><strong>7-14 days notice:</strong> 50% refund</li>
                <li><strong>Less than 7 days:</strong> No refund, but may transfer to another date (once only)</li>
                <li><strong>No-show:</strong> No refund or transfer</li>
              </ul>
              <p className="text-crust-600 leading-relaxed mt-4">
                The Company reserves the right to cancel any Course due to unforeseen circumstances. 
                In such cases, a full refund will be provided.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-crust-600 leading-relaxed">
                All course materials, recipes, videos, and content provided by the Company are protected by 
                copyright and other intellectual property laws. Students may use these materials for personal, 
                non-commercial purposes only. Reproduction, distribution, or commercial use without written 
                permission is strictly prohibited.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-crust-600 leading-relaxed">
                The Company&apos;s liability shall be limited to the amount paid for the specific Course. 
                We are not liable for any indirect, incidental, or consequential damages. Students participate 
                in practical baking classes at their own risk and are required to follow all safety instructions.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                6. Governing Law
              </h2>
              <p className="text-crust-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Singapore. 
                Any disputes shall be subject to the exclusive jurisdiction of the courts of Singapore.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                7. Contact Information
              </h2>
              <p className="text-crust-600 leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-crust-600 mt-4">
                <strong>Email:</strong> legal@artisan-baking-atelier.com<br />
                <strong>Address:</strong> 123 Tiong Bahru Road, Singapore 168123
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
