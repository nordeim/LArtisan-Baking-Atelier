import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recipes | L\'Artisan Baking Atelier',
  description: 'Free artisan baking recipes from our master bakers. From sourdough to croissants, discover recipes for every skill level.',
  openGraph: {
    title: 'Recipes | L\'Artisan Baking Atelier',
    description: 'Free artisan baking recipes from our master bakers.',
    type: 'website',
  },
};

const recipes = [
  {
    title: 'Classic Country Sourdough',
    description: 'A rustic, crusty loaf with a tender crumb and complex flavor from long fermentation.',
    image: 'https://images.unsplash.com/photo-1585476263060-b7a6b710f2a1?w=600&h=400&fit=crop&q=80',
    category: 'Bread',
    difficulty: 'Intermediate',
    time: '24 hours',
    servings: 1,
    slug: 'country-sourdough',
  },
  {
    title: 'Buttery Croissants',
    description: 'Flaky, golden croissants with visible layers of butter. The ultimate weekend project.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop&q=80',
    category: 'Viennoiserie',
    difficulty: 'Advanced',
    time: '2 days',
    servings: 12,
    slug: 'buttery-croissants',
  },
  {
    title: 'Chocolate Babka',
    description: 'Rich, swirled bread filled with chocolate and cinnamon. Perfect for special occasions.',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop&q=80',
    category: 'Sweet Bread',
    difficulty: 'Intermediate',
    time: '6 hours',
    servings: 10,
    slug: 'chocolate-babka',
  },
  {
    title: 'Baguette Tradition',
    description: 'The classic French baguette with a crispy crust and open, irregular crumb structure.',
    image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?w=600&h=400&fit=crop&q=80',
    category: 'Bread',
    difficulty: 'Intermediate',
    time: '8 hours',
    servings: 2,
    slug: 'baguette-tradition',
  },
  {
    title: 'Lemon Tart',
    description: 'A tangy, creamy lemon curd in a buttery, blind-baked pastry shell.',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=400&fit=crop&q=80',
    category: 'Pâtisserie',
    difficulty: 'Intermediate',
    time: '4 hours',
    servings: 8,
    slug: 'lemon-tart',
  },
  {
    title: 'Focaccia Genovese',
    description: 'Olive oil-enriched flatbread with dimpled surface, perfect for beginners.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop&q=80',
    category: 'Bread',
    difficulty: 'Beginner',
    time: '4 hours',
    servings: 8,
    slug: 'focaccia-genovese',
  },
];

const categories = ['All', 'Bread', 'Viennoiserie', 'Pâtisserie', 'Sweet Bread'];

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Free Resources
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Artisan Recipes
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Explore our collection of tried-and-tested recipes from our master bakers. 
            Perfect for home bakers of all skill levels.
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

      {/* Recipes Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <article
                key={recipe.slug}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/recipes/${recipe.slug}`}>
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-crust-800 text-xs font-semibold rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-xs text-crust-500">
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5" />
                      {recipe.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {recipe.servings} servings
                    </span>
                  </div>
                  <Link href={`/recipes/${recipe.slug}`}>
                    <h2 className="font-display text-xl font-semibold text-crust-900 mb-3 hover:text-crust-700 transition-colors">
                      {recipe.title}
                    </h2>
                  </Link>
                  <p className="text-crust-600 text-sm leading-relaxed mb-4">
                    {recipe.description}
                  </p>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="text-sm font-semibold text-crust-700 hover:text-crust-900 flex items-center gap-1"
                  >
                    View Recipe
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-crust-900 mb-4">
            Want to Learn More?
          </h2>
          <p className="text-crust-600 mb-8 max-w-lg mx-auto">
            Our professional courses teach you the techniques behind these recipes 
            with hands-on guidance from master bakers.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors"
          >
            Explore Our Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
