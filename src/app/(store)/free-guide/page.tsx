import { Metadata } from 'next';
import Image from 'next/image';
import { Check, Download, Mail, BookOpen, ChefHat, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Sourdough Starter Guide | L\'Artisan Baking Atelier',
  description: 'Download our comprehensive 32-page sourdough starter guide. Learn to create, feed, and maintain your own sourdough starter with expert tips from our master bakers.',
  openGraph: {
    title: 'Free Sourdough Starter Guide | L\'Artisan Baking Atelier',
    description: 'Get our comprehensive 32-page guide to sourdough starters - completely free.',
    type: 'website',
  },
};

const features = [
  'Step-by-step starter creation guide',
  'Feeding schedules and ratios',
  'Troubleshooting common problems',
  'Your first loaf recipe included',
  'Maintenance tips for busy bakers',
  'Storage and revival techniques',
];

const chapters = [
  {
    icon: BookOpen,
    title: 'Understanding Sourdough',
    description: 'The science behind wild yeast and lactobacilli.',
  },
  {
    icon: ChefHat,
    title: 'Creating Your Starter',
    description: 'Day-by-day instructions from flour and water.',
  },
  {
    icon: Clock,
    title: 'Maintenance Made Simple',
    description: 'Daily, weekly, and long-term care routines.',
  },
];

export default function FreeGuidePage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero Section */}
      <section className="bg-crust-900 py-20 lg:py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-crust-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-crust-600/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-crust-700 text-crust-300 text-sm font-semibold rounded-full mb-6">
                <Download className="w-4 h-4" />
                Free Download
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
                Start Your Sourdough Journey Today
              </h1>
              <p className="text-lg text-crust-300 leading-relaxed mb-8">
                Get our comprehensive 32-page guide covering starter creation, 
                feeding schedules, troubleshooting tips, and your first loaf recipe 
                — completely free.
              </p>
              
              {/* Features */}
              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-crust-200">
                    <Check className="w-5 h-5 text-crust-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Card */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-crust-100">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=450&fit=crop&q=80"
                  alt="Sourdough starter guide preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crust-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display text-xl font-semibold">
                    The Complete Sourdough Starter Guide
                  </p>
                  <p className="text-crust-200 text-sm">32 pages • PDF • Instant download</p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-crust-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-xl border border-crust-200 focus:border-crust-400 focus:ring-2 focus:ring-crust-200 outline-none transition-all"
                    placeholder="Jane Doe"
                    required
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
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Me The Free Guide
                </button>
              </form>

              <p className="text-xs text-crust-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-semibold text-crust-900 mb-4">
              What You Will Learn
            </h2>
            <p className="text-crust-600">
              Our guide covers everything you need to know to create and maintain 
              a healthy, active sourdough starter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {chapters.map((chapter) => (
              <div key={chapter.title} className="text-center">
                <div className="w-16 h-16 bg-crust-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <chapter.icon className="w-8 h-8 text-crust-700" />
                </div>
                <h3 className="font-display text-xl font-semibold text-crust-900 mb-2">
                  {chapter.title}
                </h3>
                <p className="text-crust-600">
                  {chapter.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-crust-600 mb-4">Trusted by over 12,000 home bakers</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-crust-900">12,000+</p>
              <p className="text-sm text-crust-600">Downloads</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-crust-900">4.9/5</p>
              <p className="text-sm text-crust-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-crust-900">32</p>
              <p className="text-sm text-crust-600">Pages</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
