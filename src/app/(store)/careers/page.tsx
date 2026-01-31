import { Metadata } from 'next';
import { Heart, Coffee, GraduationCap, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | L\'Artisan Baking Atelier',
  description: 'Join our team at L\'Artisan Baking Atelier. Explore career opportunities in baking, teaching, and operations.',
  openGraph: {
    title: 'Careers | L\'Artisan Baking Atelier',
    description: 'Join our passionate team of artisan bakers and educators.',
    type: 'website',
  },
};

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive medical insurance, dental coverage, and mental health support.',
  },
  {
    icon: Coffee,
    title: 'Staff Perks',
    description: 'Free daily bread, unlimited coffee, and 50% discount on all courses.',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: '$1,000 annual budget for professional development and external courses.',
  },
  {
    icon: Users,
    title: 'Great Culture',
    description: 'Collaborative team, regular team outings, and a passion for what we do.',
  },
];

const openings = [
  {
    title: 'Assistant Pastry Chef',
    department: 'Production',
    type: 'Full-time',
    location: 'Singapore',
    description: 'Join our pastry team creating croissants, tarts, and viennoiserie.',
  },
  {
    title: 'Baking Instructor',
    department: 'Education',
    type: 'Part-time',
    location: 'Singapore',
    description: 'Teach sourdough and artisan bread courses to enthusiastic students.',
  },
  {
    title: 'Customer Experience Specialist',
    department: 'Operations',
    type: 'Full-time',
    location: 'Singapore',
    description: 'Be the friendly face of our atelier, handling inquiries and enrollments.',
  },
  {
    title: 'Social Media Coordinator',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Singapore',
    description: 'Create content that showcases our beautiful bakes and courses.',
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-crust-50">
      {/* Hero */}
      <section className="bg-crust-900 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-crust-700 text-crust-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Join Our Team
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-crust-50 mb-6">
            Bake Your Career With Us
          </h1>
          <p className="text-lg text-crust-300 max-w-2xl mx-auto">
            We are always looking for passionate individuals who share our love for artisan baking 
            and exceptional customer experiences.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-semibold text-crust-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-crust-600">
              We believe that happy teams create exceptional experiences. Here is what we offer:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-crust-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-crust-700" />
                </div>
                <h3 className="font-display text-lg font-semibold text-crust-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-crust-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-semibold text-crust-900 mb-8 text-center">
              Current Openings
            </h2>
            
            <div className="space-y-4">
              {openings.map((job) => (
                <div
                  key={job.title}
                  className="bg-crust-50 p-6 rounded-2xl hover:bg-crust-100 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-crust-900">
                        {job.title}
                      </h3>
                      <p className="text-crust-600 mt-1">{job.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="px-3 py-1 bg-white text-crust-600 text-xs rounded-full">
                          {job.department}
                        </span>
                        <span className="px-3 py-1 bg-white text-crust-600 text-xs rounded-full">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-white text-crust-600 text-xs rounded-full">
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <a
                      href="mailto:careers@artisan-baking-atelier.com"
                      className="px-6 py-3 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors text-center whitespace-nowrap"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* General Application */}
            <div className="mt-12 text-center p-8 bg-crust-100 rounded-3xl">
              <h3 className="font-display text-xl font-semibold text-crust-900 mb-3">
                Do not See the Right Fit?
              </h3>
              <p className="text-crust-600 mb-6">
                We are always interested in meeting talented individuals. Send us your resume 
                and tell us how you can contribute to our team.
              </p>
              <a
                href="mailto:careers@artisan-baking-atelier.com"
                className="inline-flex items-center px-8 py-4 bg-crust-900 text-crust-50 font-semibold rounded-xl hover:bg-crust-800 transition-colors"
              >
                Send General Application
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
