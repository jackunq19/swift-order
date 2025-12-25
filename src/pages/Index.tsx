import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { menuItems, categories } from '@/data/menuData';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { FloatingCart } from '@/components/cart/CartComponents';
import { GlassNavbar } from '@/components/layout/GlassNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GlassNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Menu</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Exquisite Dishes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Carefully crafted dishes made with the finest ingredients. 
              Browse our menu and add items to your cart.
            </p>
          </motion.div>

          <CategoryFilter
            categories={categories.map(c => ({ id: c.id, label: c.label }))}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8"
          >
            {filteredItems.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <FloatingCart />
      <Footer />
    </div>
  );
};

export default Index;
