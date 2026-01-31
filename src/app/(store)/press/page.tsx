import { Metadata } from 'next';
import { Download, Mail, FileText, Image } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press Kit | L\'Artisan Baking Atelier',
  description: 'Media resources, press releases, and brand assets for L\'Artisan Baking Atelier. Download our press kit and high-resolution images.',
  openGraph: {
    title: 'Press Kit | L\'Artisan Baking Atelier',
    description: 'Media resources and brand assets for journalists.',
    type: 'website',
  },
};

const pressReleases = [
  {
    date: 'January 15, 2026',
    title: 'L\'Artisan Launches Advanced Sourdough Masterclass Series',
    excerpt: 'New 8-week program designed for professional bakers seeking to master advanced fermentation techniques.',
  },
  {
    date: 'November 20, 2025',
    title: 'Award-Winning Chef Marie-Claude Dubois Joins as Head Instructor',
    excerpt: 'Former Le Meurice pastry chef brings 25 years of Michelin-starred experience to the atelier.',
  },
  {
    date: 'September 5, 2025',
    title: 'L\'Artisan Celebrates Training 5,000 Students',
    excerpt: 'Milestone marks eight years of artisan baking education in Singapore.',
  },
];

const brandAssets = [
  {
    icon: Image,
    title: 'High-Resolution Photos',
    description: 'Professional images of our bakery, products, and team.',
    size: '45 MB',
  },
  {
    icon: FileText,
    title: 'Fact Sheet',
    description: 'Company overview, key statistics, and background information.',
    size: 'PDF, 2 MB',
  },
  {
    icon: Download,
    title: 'Brand Guidelines',
    description: 'Logo usage, color palette, and brand voice guidelines.',
    size: 'PDF, 5 MB',
  },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Media Resources
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Press Kit
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Download brand assets, read our latest news, and get in touch with our media team.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Brand Assets */}
            <div className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-crust-900 mb-6">
                Brand Assets
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {brandAssets.map((asset) => (
                  <div
                    key={asset.title}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center mb-4">
                      <asset.icon className="w-6 h-6 text-crust-700" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-crust-900 mb-2">
                      {asset.title}
                    </h3>
                    <p className="text-sm text-crust-600 mb-4">
                      {asset.description}
                    </p>
                    <button className="text-sm font-semibold text-crust-700 hover:text-crust-900 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download ({asset.size})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Press Releases */}
            <div className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-crust-900 mb-6">
                Press Releases
              </h2>
              <div className="space-y-4">
                {pressReleases.map((release) => (
                  <div
                    key={release.title}
                    className="bg-white p-6 rounded-2xl shadow-sm"
                  >
                    <p className="text-sm text-crust-500 mb-2">{release.date}</p>
                    <h3 className="font-display text-xl font-semibold text-crust-900 mb-2">
                      {release.title}
                    </h3>
                    <p className="text-crust-600 mb-4">{release.excerpt}</p>
                    <button className="text-sm font-semibold text-crust-700 hover:text-crust-900">
                      Read full release →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-crust-900 p-8 lg:p-12 rounded-3xl text-center">
              <Mail className="w-12 h-12 text-crust-400 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-semibold text-crust-50 mb-4">
                Media Inquiries
              </h2>
              <p className="text-crust-300 mb-6 max-w-lg mx-auto">
                For press inquiries, interview requests, or to arrange a visit to our atelier, 
                please contact our media relations team.
              </p>
              <a
                href="mailto:press@artisan-baking-atelier.com"
                className="inline-flex items-center px-8 py-4 bg-crust-400 text-crust-950 font-semibold rounded-xl hover:bg-crust-300 transition-colors"
              >
                press@artisan-baking-atelier.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
