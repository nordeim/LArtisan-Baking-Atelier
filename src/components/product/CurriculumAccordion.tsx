'use client';

import { Play, Clock, Lock, CheckCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Curriculum Accordion Component
 * 
 * Displays course curriculum in collapsible sections.
 * Includes lesson previews and progress tracking.
 */

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CurriculumAccordionProps {
  modules?: Module[];
}

// Demo curriculum data - in production, this would come from the database
const defaultModules: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1: Foundations',
    description: 'Master the fundamental techniques and ingredients',
    lessons: [
      { id: 'l1', title: 'Introduction to Baking Science', duration: '15:30', isPreview: true },
      { id: 'l2', title: 'Understanding Flour Types', duration: '22:45' },
      { id: 'l3', title: 'The Role of Yeast & Fermentation', duration: '18:20' },
      { id: 'l4', title: 'Hydration & Dough Consistency', duration: '25:10' },
    ],
  },
  {
    id: 'module-2',
    title: 'Module 2: Technique Development',
    description: 'Build essential skills through hands-on practice',
    lessons: [
      { id: 'l5', title: 'Kneading Methods', duration: '20:15' },
      { id: 'l6', title: 'Folding & Shaping', duration: '28:30' },
      { id: 'l7', title: 'Scoring Patterns', duration: '16:45' },
      { id: 'l8', title: 'Steam & Baking Environment', duration: '19:50' },
    ],
  },
  {
    id: 'module-3',
    title: 'Module 3: Recipe Application',
    description: 'Apply techniques to classic and modern recipes',
    lessons: [
      { id: 'l9', title: 'Classic Sourdough Bread', duration: '35:00' },
      { id: 'l10', title: 'Rustic Country Loaf', duration: '32:15' },
      { id: 'l11', title: 'Multigrain Variations', duration: '29:40' },
      { id: 'l12', title: 'Troubleshooting Common Issues', duration: '24:30' },
    ],
  },
];

export function CurriculumAccordion({ modules = defaultModules }: CurriculumAccordionProps) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = modules.reduce((sum, m) => 
    sum + m.lessons.reduce((ls, l) => ls + parseDuration(l.duration), 0), 0
  );

  function parseDuration(duration: string): number {
    const [mins, secs] = duration.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  }

  function formatTotalDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return (
    <div className="space-y-4">
      {/* Curriculum Summary */}
      <div className="flex items-center gap-6 text-sm text-crust-600 pb-4 border-b border-crust-200">
        <span>{modules.length} modules</span>
        <span>•</span>
        <span>{totalLessons} lessons</span>
        <span>•</span>
        <span>{formatTotalDuration(totalDuration)} total</span>
      </div>

      {/* Accordion */}
      <Accordion type="multiple" defaultValue={['module-1']} className="space-y-4">
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border border-crust-200 rounded-xl overflow-hidden bg-white"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-crust-50">
              <div className="text-left">
                <h4 className="font-display text-lg font-semibold text-crust-900">
                  {module.title}
                </h4>
                <p className="text-sm text-crust-500 mt-1">
                  {module.lessons.length} lessons • {module.description}
                </p>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-2 pt-2">
                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-crust-50 transition-colors group"
                  >
                    {/* Lesson Number/Icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-crust-100 flex items-center justify-center group-hover:bg-crust-200 transition-colors">
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-sage-600" />
                      ) : lesson.isPreview ? (
                        <Play className="w-4 h-4 text-crust-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-crust-400" />
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-crust-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium text-crust-900 truncate">
                          {lesson.title}
                        </span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-xs text-crust-500">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.duration}
                    </div>

                    {/* Preview Badge */}
                    {lesson.isPreview && (
                      <span className="px-2 py-0.5 bg-sage-100 text-sage-800 text-xs font-medium rounded">
                        Preview
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default CurriculumAccordion;
