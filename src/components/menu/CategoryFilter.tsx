import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Salad, Utensils, Wine, Cake } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryIcons = {
  all: LayoutGrid,
  starters: Salad,
  mains: Utensils,
  drinks: Wine,
  desserts: Cake,
};

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-20 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || LayoutGrid;
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
