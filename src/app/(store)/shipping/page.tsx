import { Metadata } from 'next';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Policy | L\'Artisan Baking Atelier',
  description: 'Information about delivery of baking kits, merchandise, and digital products from L\'Artisan Baking Atelier.',
  openGraph: {
    title: 'Shipping Policy | L\'Artisan Baking Atelier',
    description: 'Delivery information for physical and digital products.',
    type: 'website',
  },
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Delivery Information
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Shipping & Delivery
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Information about how we deliver our baking kits, merchandise, and digital products to you.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Digital Products */}
            <div className="bg-white p-8 rounded-3xl shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-crust-700" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-crust-900">
                  Digital Products
                </h2>
              </div>
              <p className="text-crust-600 leading-relaxed mb-4">
                Our online courses and digital guides are delivered instantly via email upon purchase. 
                You will receive:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Immediate access to course materials</li>
                <li>Login credentials for your student dashboard</li>
                <li>Downloadable recipe PDFs and resources</li>
                <li>Lifetime access to content and future updates</li>
              </ul>
            </div>

            {/* Baking Kits */}
            <div className="bg-white p-8 rounded-3xl shadow-sm mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-crust-700" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-crust-900">
                  Baking Kits & Ingredients
                </h2>
              </div>
              <p className="text-crust-600 leading-relaxed mb-6">
                For our curated baking kits and specialty ingredients, we offer the following delivery options:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-crust-50 rounded-xl">
                  <Clock className="w-5 h-5 text-crust-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-crust-900">Standard Delivery</h3>
                    <p className="text-crust-600 text-sm">3-5 business days - $8 (Free for orders over $100)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-crust-50 rounded-xl">
                  <Clock className="w-5 h-5 text-crust-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-crust-900">Express Delivery</h3>
                    <p className="text-crust-600 text-sm">1-2 business days - $15</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-crust-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-crust-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-crust-900">In-Store Pickup</h3>
                    <p className="text-crust-600 text-sm">Free - Collect from our Tiong Bahru atelier</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Areas */}
            <div className="bg-white p-8 rounded-3xl shadow-sm mb-8">
              <h2 className="font-display text-2xl font-semibold text-crust-900 mb-6">
                Delivery Areas
              </h2>
              <p className="text-crust-600 leading-relaxed mb-4">
                We currently deliver to all addresses within Singapore, including:
              </p>
              <ul className="list-disc pl-6 text-crust-600 space-y-2">
                <li>Residential addresses (HDB, condos, landed properties)</li>
                <li>Office addresses</li>
                <li>Hotels and service apartments</li>
              </ul>
              <p className="text-crust-600 leading-relaxed mt-4">
                For international shipping inquiries, please contact us at{' '}
                <a href="mailto:shipping@artisan-baking-atelier.com" className="text-crust-700 underline">
                  shipping@artisan-baking-atelier.com
                </a>
              </p>
            </div>

            {/* Fresh Products */}
            <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl">
              <h2 className="font-display text-2xl font-semibold text-amber-900 mb-4">
                Important: Fresh Bread Orders
              </h2>
              <p className="text-amber-800 leading-relaxed">
                Please note that our fresh bread and pastries are only available for in-store pickup 
                or local same-day delivery (selected areas only). We do not ship fresh products to 
                maintain quality and food safety standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
