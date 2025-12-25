import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { menuItems, categories } from '@/data/menuData';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { FloatingCart } from '@/components/cart/CartComponents';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import heroImage from '@/assets/hero-restaurant.jpg';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Ember Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            Ember
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl"
          >
            Fine dining redefined. Experience culinary excellence with every bite.
          </motion.p>
        </div>
      </section>

      {/* Menu Section */}
      <main className="flex-1 container mx-auto px-4 pb-24">
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
      </main>

      <FloatingCart />
      <Footer />
    </div>
  );
};

export default Index;
