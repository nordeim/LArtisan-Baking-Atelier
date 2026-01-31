'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown, Sparkles, Type } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Sort Dropdown Component
 * 
 * Dropdown for sorting products by various criteria.
 * Updates URL search params.
 */

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOptionConfig[] = [
  { value: 'newest', label: 'Newest First', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'price_asc', label: 'Price: Low to High', icon: <ArrowUp className="w-4 h-4" /> },
  { value: 'price_desc', label: 'Price: High to Low', icon: <ArrowDown className="w-4 h-4" /> },
  { value: 'name_asc', label: 'Name: A to Z', icon: <Type className="w-4 h-4" /> },
  { value: 'name_desc', label: 'Name: Z to A', icon: <Type className="w-4 h-4 rotate-180" /> },
];

interface SortDropdownProps {
  currentSort: SortOption;
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-crust-500" />
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] border-crust-200 bg-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortDropdown;
