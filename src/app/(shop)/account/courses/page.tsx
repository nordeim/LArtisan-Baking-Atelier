'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Play, Clock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  grantedAt: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    price: number;
  };
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/account/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-caramel-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-bread-200 p-6 shadow-soft">
        <h1 className="text-2xl font-serif font-semibold text-cocoa-900">
          My Courses
        </h1>
        <p className="text-cocoa-600 mt-1">
          Access your purchased courses and learning materials
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-bread-200 p-12 shadow-soft text-center">
          <div className="w-16 h-16 rounded-full bg-bread-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-cocoa-400" />
          </div>
          <h2 className="text-lg font-medium text-cocoa-900 mb-2">
            No courses yet
          </h2>
          <p className="text-cocoa-600 mb-6">
            Purchase one of our masterclass courses to start learning the art of artisan baking.
          </p>
          <Link href="/shop">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-bread-200 shadow-soft overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Course Image */}
                <div className="md:w-64 h-48 md:h-auto bg-bread-100 flex-shrink-0">
                  {course.product.images?.[0] ? (
                    <img
                      src={course.product.images[0]}
                      alt={course.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-cocoa-300" />
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      </div>
                      <h2 className="text-xl font-serif font-semibold text-cocoa-900">
                        {course.product.name}
                      </h2>
                      <p className="text-cocoa-600 mt-1 line-clamp-2">
                        {course.product.description || 'Master the art of artisan baking with this comprehensive course.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-sm text-cocoa-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Purchased {new Date(course.order.createdAt).toLocaleDateString('en-SG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Order #{course.order.orderNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      Start Learning
                    </Button>
                    <Link
                      href={`/shop/${course.product.id}`}
                      className="text-espresso-600 hover:text-espresso-800 font-medium"
                    >
                      View Course Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
