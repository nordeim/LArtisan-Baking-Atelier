import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | L\'Artisan Baking Atelier',
  description: 'Discover the story of L\'Artisan Baking Atelier, Singapore\'s premier artisan bakery and baking school. Learn our heritage, values, and commitment to craft.',
  openGraph: {
    title: 'About Us | L\'Artisan Baking Atelier',
    description: 'Discover our heritage and commitment to artisan baking.',
    type: 'website',
  },
};

const values = [
  {
    icon: Heart,
    title: 'Passion for Craft',
    description: 'Every loaf, every pastry is crafted with genuine love for the art of baking. We believe that passion is the secret ingredient that transforms good bread into extraordinary bread.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    description: 'We partner with local farms and ethical suppliers to source the finest ingredients. Our commitment to sustainability extends from field to bakery to your table.',
  },
  {
    icon: Award,
    title: 'Excellence in Education',
    description: 'Our master instructors bring decades of experience from Michelin-starred kitchens. We are dedicated to passing on time-honored techniques to the next generation.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We are more than a bakery—we are a community of artisans, students, and bread lovers. Our atelier is a gathering place for those who share our passion.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero Section */}
      <section className="relative bg-crust-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=1920&h=800&fit=crop&q=80"
            alt="Bakery background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-crust-900/80 to-crust-900" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
              Our Story
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
              Where Tradition Meets Innovation
            </h1>
            <p className="text-lg text-crust-300 leading-relaxed">
              Founded in 2015, L&apos;Artisan Baking Atelier began as a small sourdough 
              bakery in the heart of Singapore. Today, we&apos;re a thriving community 
              of artisans dedicated to preserving the craft of traditional baking 
              while embracing modern techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-crust-900 mb-6">
                A Labor of Love
              </h2>
              <div className="space-y-4 text-crust-600 leading-relaxed">
                <p>
                  Our founder, Chef Antoine Laurent, arrived in Singapore from Lyon 
                  with nothing but a sourdough starter passed down through three 
                  generations and an unwavering dream: to bring authentic European 
                  artisan bread to Southeast Asia.
                </p>
                <p>
                  What started as a weekend pop-up at the Tiong Bahru Market quickly 
                  grew into a beloved neighborhood bakery. By 2017, we had expanded 
                  into a full atelier, offering professional baking courses to share 
                  our knowledge with aspiring artisans.
                </p>
                <p>
                  Today, L&apos;Artisan has trained over 5,000 students and supplies 
                  bread to some of Singapore&apos;s finest restaurants. Yet we remain 
                  true to our roots—every loaf is still hand-crafted using traditional 
                  methods and the finest ingredients.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80"
                  alt="Our bakery kitchen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg max-w-xs">
                <p className="font-display text-3xl font-semibold text-crust-900">8+</p>
                <p className="text-crust-600">Years of artisan excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-crust-100 text-crust-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Our Values
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-crust-900">
              What We Stand For
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-14 h-14 bg-crust-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-crust-700" />
                </div>
                <h3 className="font-display text-xl font-semibold text-crust-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-crust-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-28 bg-crust-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '5,000+', label: 'Students Trained' },
              { value: '50+', label: 'Professional Courses' },
              { value: '12', label: 'Expert Instructors' },
              { value: '3', label: 'Awards Won' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl lg:text-5xl font-semibold text-crust-400 mb-2">
                  {stat.value}
                </p>
                <p className="text-crust-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
