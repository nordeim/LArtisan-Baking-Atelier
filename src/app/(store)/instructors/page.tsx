import { Metadata } from 'next';
import Image from 'next/image';
import { Award, BookOpen, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Instructors | L\'Artisan Baking Atelier',
  description: 'Meet our world-class team of master bakers and pastry chefs. Learn from professionals with decades of experience in Michelin-starred kitchens.',
  openGraph: {
    title: 'Our Instructors | L\'Artisan Baking Atelier',
    description: 'Learn from world-class master bakers and pastry chefs.',
    type: 'website',
  },
};

const instructors = [
  {
    name: 'Marie-Claude Dubois',
    title: 'Master Pâtissier',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=650&fit=crop&q=80',
    specialty: 'Pâtisserie & Chocolate',
    experience: '25 years',
    bio: 'Former Executive Pastry Chef at Le Meurice, Paris. Marie-Claude trained under Pierre Hermé and has won numerous international competitions. She brings French precision and artistry to every class.',
    awards: ['Meilleur Ouvrier de France 2018', 'World Pastry Champion 2015'],
    courses: 12,
    students: 1200,
  },
  {
    name: 'Marco Bellini',
    title: 'Head Bread Artisan',
    location: 'Milan, Italy',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=650&fit=crop&q=80',
    specialty: 'Sourdough & Artisan Bread',
    experience: '22 years',
    bio: 'Marco learned bread-making from his grandfather in Tuscany before training at Eataly. His sourdough techniques blend Italian tradition with modern fermentation science.',
    awards: ['Panettone World Champion 2019', 'Golden Baguette Award'],
    courses: 8,
    students: 980,
  },
  {
    name: 'Yuki Tanaka',
    title: 'Viennoiserie Expert',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=500&h=650&fit=crop&q=80',
    specialty: 'Viennoiserie & Lamination',
    experience: '18 years',
    bio: 'Trained at the prestigious École Ferrandi in Paris, Yuki brings Japanese attention to detail to French pastry. Her croissants are legendary for their honeycomb structure.',
    awards: ['Croissant d\'Or 2020', 'Japan Pastry Excellence Award'],
    courses: 6,
    students: 750,
  },
  {
    name: 'Antoine Laurent',
    title: 'Founder & Master Baker',
    location: 'Lyon, France',
    image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=500&h=650&fit=crop&q=80',
    specialty: 'Traditional French Baking',
    experience: '30 years',
    bio: 'Antoine founded L\'Artisan after a storied career in Michelin-starred kitchens. His passion for preserving traditional techniques while embracing innovation drives our curriculum.',
    awards: ['Boulangerie de l\'Année 2016', 'Singapore Food Masters Hall of Fame'],
    courses: 15,
    students: 2000,
  },
  {
    name: 'Sofia Andersson',
    title: 'Nordic Baking Specialist',
    location: 'Copenhagen, Denmark',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=650&fit=crop&q=80',
    specialty: 'Rye Bread & Ancient Grains',
    experience: '15 years',
    bio: 'Sofia brings the New Nordic baking philosophy to our atelier. She specializes in working with heritage grains and creating wholesome, flavorful breads.',
    awards: ['Nordic Baker of the Year 2021'],
    courses: 5,
    students: 520,
  },
  {
    name: 'David Chen',
    title: 'Asian Fusion Pastry Chef',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1583394293214-28ezded53047?w=500&h=650&fit=crop&q=80',
    specialty: 'Asian-Inspired Pastry',
    experience: '12 years',
    bio: 'David combines classical French technique with Asian flavors and ingredients. His innovative approach has created unique courses that bridge culinary traditions.',
    awards: ['Singapore Pastry Chef of the Year 2022'],
    courses: 7,
    students: 890,
  },
];

export default function InstructorsPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Expert Mentors
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Learn From the Best
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            Our instructors bring decades of experience from Michelin-starred kitchens, 
            award-winning bakeries, and prestigious culinary institutions around the world.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div
                key={instructor.name}
                className="bg-white rounded-3xl overflow-hidden shadow-sm"
              >
                {/* Image */}
                <div className="relative aspect-[4/5]">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-crust-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-crust-300 text-sm mb-1">{instructor.location}</p>
                    <h2 className="font-display text-2xl font-semibold text-white">
                      {instructor.name}
                    </h2>
                    <p className="text-crust-300">{instructor.title}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-crust-600" />
                    <span className="text-sm text-crust-600">{instructor.specialty}</span>
                  </div>
                  <p className="text-crust-600 text-sm leading-relaxed mb-4">
                    {instructor.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-crust-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-crust-400" />
                      <span className="text-sm text-crust-600">{instructor.courses} courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-crust-400" />
                      <span className="text-sm text-crust-600">{instructor.students}+ students</span>
                    </div>
                  </div>

                  {/* Awards */}
                  <div className="mt-4 space-y-1">
                    {instructor.awards.map((award) => (
                      <p key={award} className="text-xs text-crust-500">
                        • {award}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
