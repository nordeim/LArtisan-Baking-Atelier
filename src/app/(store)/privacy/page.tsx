import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | L\'Artisan Baking Atelier',
  description: 'Learn how L\'Artisan Baking Atelier collects, uses, and protects your personal information. Singapore PDPA compliant privacy policy.',
  openGraph: {
    title: 'Privacy Policy | L\'Artisan Baking Atelier',
    description: 'Our commitment to protecting your personal data.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-semibold text-crust-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-crust-600 mb-8">
              Last updated: January 2026
            </p>

            <div className="prose prose-crust max-w-none">
              <p className="text-crust-600 leading-relaxed">
                L&apos;Artisan Baking Atelier Pte. Ltd. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in accordance 
                with the Singapore Personal Data Protection Act 2012 (PDPA).
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                We may collect the following types of personal data:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li><strong>Identity Information:</strong> Name, nationality, date of birth</li>
                <li><strong>Contact Information:</strong> Email address, phone number, mailing address</li>
                <li><strong>Account Information:</strong> Username, password, account preferences</li>
                <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely via Stripe)</li>
                <li><strong>Course Information:</strong> Enrollment history, progress, certificates earned</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Processing and managing your course enrollments</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Sending administrative information and course updates</li>
                <li>Processing payments and preventing fraud</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Improving our website and course offerings</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                3. Data Protection
              </h2>
              <p className="text-crust-600 leading-relaxed">
                We implement appropriate security measures to protect your personal data against unauthorized access, 
                alteration, disclosure, or destruction. These measures include SSL encryption, secure servers, 
                and regular security assessments. However, no method of transmission over the Internet is 100% secure, 
                and we cannot guarantee absolute security.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                4. Your Rights Under PDPA
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                Under the Singapore PDPA, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Withdraw consent for data processing</li>
                <li>Request deletion of your personal data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                5. Contact Us
              </h2>
              <p className="text-crust-600 leading-relaxed">
                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                please contact us at:
              </p>
              <p className="text-crust-600 mt-4">
                <strong>Email:</strong> privacy@artisan-baking-atelier.com<br />
                <strong>Address:</strong> 123 Tiong Bahru Road, Singapore 168123<br />
                <strong>Phone:</strong> +65 6123 4567
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
