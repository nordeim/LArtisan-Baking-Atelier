'use client';

import { Video, Clock, Users, Award } from 'lucide-react';

/**
 * Trust Bar Section
 * 
 * Dark background section highlighting key features/benefits.
 * Displays 4 feature items with icons.
 */

const features = [
  {
    icon: Video,
    title: 'HD Video Lessons',
    description: 'Crystal clear tutorials',
  },
  {
    icon: Clock,
    title: 'Lifetime Access',
    description: 'Learn at your own pace',
  },
  {
    icon: Users,
    title: 'Community Forum',
    description: 'Connect with bakers',
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Industry recognized',
  },
];

export function TrustBar() {
  return (
    <section className="py-12 bg-crust-900" aria-label="Key features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-12 h-12 mx-auto bg-crust-800 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-crust-400" />
              </div>
              <h3 className="font-semibold text-crust-100">{feature.title}</h3>
              <p className="mt-1 text-sm text-crust-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
