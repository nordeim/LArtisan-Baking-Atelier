import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | L\'Artisan Baking Atelier',
  description: 'Our refund policy for baking courses and digital products. Learn about cancellation deadlines and refund eligibility.',
  openGraph: {
    title: 'Refund Policy | L\'Artisan Baking Atelier',
    description: 'Clear guidelines on cancellations and refunds.',
    type: 'website',
  },
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-semibold text-crust-900 mb-8">
              Refund Policy
            </h1>
            <p className="text-crust-600 mb-8">
              Last updated: January 2026
            </p>

            <div className="prose prose-crust max-w-none">
              <p className="text-crust-600 leading-relaxed">
                At L&apos;Artisan Baking Atelier, we want you to be completely satisfied with your learning experience. 
                This Refund Policy outlines the conditions under which refunds are granted for our courses and products.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                In-Person Courses
              </h2>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                <h3 className="font-semibold text-crust-900 mb-4">Cancellation Notice Periods</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0 font-semibold text-green-700">14+ days</div>
                    <div>
                      <p className="text-crust-900 font-medium">Full Refund</p>
                      <p className="text-crust-600 text-sm">Minus 5% administrative fee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0 font-semibold text-yellow-700">7-14 days</div>
                    <div>
                      <p className="text-crust-900 font-medium">50% Refund</p>
                      <p className="text-crust-600 text-sm">Or transfer to another course date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0 font-semibold text-red-700">Less than 7 days</div>
                    <div>
                      <p className="text-crust-900 font-medium">No Refund</p>
                      <p className="text-crust-600 text-sm">One-time transfer to another date allowed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0 font-semibold text-gray-700">No-show</div>
                    <div>
                      <p className="text-crust-900 font-medium">No Refund or Transfer</p>
                      <p className="text-crust-600 text-sm">Full course fee forfeited</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                Digital Courses
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                For our online digital courses:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Full refund available within 7 days of purchase if less than 20% of content accessed</li>
                <li>No refunds after 7 days or if more than 20% of content has been viewed</li>
                <li>Lifetime access to purchased courses, including future updates</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                Gift Cards
              </h2>
              <p className="text-crust-600 leading-relaxed">
                Gift cards are non-refundable and cannot be exchanged for cash. They are valid for 3 years 
                from the date of purchase and can be used for any course or product in our atelier.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                Course Cancellation by Us
              </h2>
              <p className="text-crust-600 leading-relaxed">
                In the unlikely event that we need to cancel a course due to unforeseen circumstances 
                (instructor illness, equipment failure, etc.), you will be offered:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2 mt-4">
                <li>Full refund to your original payment method</li>
                <li>Transfer to the next available date of the same course</li>
                <li>Credit for any other course of equal or lesser value</li>
              </ul>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                How to Request a Refund
              </h2>
              <p className="text-crust-600 leading-relaxed">
                To request a refund, please email us at{' '}
                <a href="mailto:refunds@artisan-baking-atelier.com" className="text-crust-700 underline">
                  refunds@artisan-baking-atelier.com
                </a>{' '}
                with your order number and reason for cancellation. Refunds are processed within 5-10 business days.
              </p>

              <h2 className="font-display text-2xl font-semibold text-crust-900 mt-12 mb-4">
                Special Circumstances
              </h2>
              <p className="text-crust-600 leading-relaxed">
                We understand that exceptional circumstances can arise. If you have a medical emergency 
                or other extenuating circumstances, please contact us and we will review your case on an 
                individual basis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
