import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journal | L\'Artisan Baking Atelier',
  description: 'Baking tips, recipes, stories, and insights from the artisans at L\'Artisan Baking Atelier.',
  openGraph: {
    title: 'Journal | L\'Artisan Baking Atelier',
    description: 'Stories, tips, and inspiration from our artisan bakery.',
    type: 'website',
  },
};

const articles = [
  {
    title: 'The Art of Maintaining a 100-Year-Old Sourdough Starter',
    excerpt: 'Discover the secrets behind our legendary sourdough starter, passed down through generations of bakers. Learn how to care for your own starter.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&q=80',
    category: 'Technique',
    readTime: '8 min read',
    date: 'Jan 25, 2026',
    slug: 'sourdough-starter-guide',
  },
  {
    title: 'Understanding Hydration: The Key to Perfect Bread',
    excerpt: 'Water content can make or break your loaf. We break down baker percentages and show you how to calculate the perfect hydration for any bread.',
    image: 'https://images.unsplash.com/photo-1585476263060-b7a6b710f2a1?w=600&h=400&fit=crop&q=80',
    category: 'Science',
    readTime: '6 min read',
    date: 'Jan 18, 2026',
    slug: 'understanding-hydration',
  },
  {
    title: 'From Lyon to Singapore: Our Founding Story',
    excerpt: 'Chef Antoine Laurent shares the journey of bringing authentic French artisan baking to Southeast Asia.',
    image: 'https://images.unsplash.com/photo-1556217477-d325251ece38?w=600&h=400&fit=crop&q=80',
    category: 'Story',
    readTime: '10 min read',
    date: 'Jan 10, 2026',
    slug: 'founding-story',
  },
  {
    title: 'Seasonal Baking: Winter Grains and Flours',
    excerpt: 'Explore the unique characteristics of winter wheat and how seasonal variations affect your baking.',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=400&fit=crop&q=80',
    category: 'Ingredients',
    readTime: '5 min read',
    date: 'Jan 5, 2026',
    slug: 'seasonal-winter-grains',
  },
  {
    title: 'The Perfect Croissant: Lamination Techniques',
    excerpt: 'Master the art of creating buttery, flaky layers. Our step-by-step guide to folding and laminating croissant dough.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop&q=80',
    category: 'Technique',
    readTime: '12 min read',
    date: 'Dec 28, 2025',
    slug: 'croissant-lamination',
  },
  {
    title: 'Interview: A Day in the Life of a Master Baker',
    excerpt: 'Follow Chef Marco through a typical 4 AM start at our bakery, from prep work to the first customers of the day.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop&q=80',
    category: 'People',
    readTime: '7 min read',
    date: 'Dec 20, 2025',
    slug: 'day-in-life-baker',
  },
];

const categories = ['All', 'Technique', 'Science', 'Story', 'Ingredients', 'People'];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Stories & Insights
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            The Journal
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Baking tips, techniques, stories, and inspiration from our artisans.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-crust-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-crust-900 text-crust-50'
                    : 'bg-white text-crust-700 hover:bg-crust-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/journal/${article.slug}`}>
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-crust-100 text-crust-700 text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-crust-500">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <Link href={`/journal/${article.slug}`}>
                    <h2 className="font-display text-xl font-semibold text-crust-900 mb-3 hover:text-crust-700 transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-crust-600 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-crust-500">{article.date}</span>
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-sm font-semibold text-crust-700 hover:text-crust-900 flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
