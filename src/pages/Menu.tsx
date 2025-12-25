import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { menuItems, categories } from '@/data/menuData';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { FloatingCart } from '@/components/cart/CartComponents';
import { GlassNavbar } from '@/components/layout/GlassNavbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <GlassNavbar />

        {/* Hero Banner */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-secondary/40 to-background">
          <div className="container mx-auto max-w-7xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-medium text-sm uppercase tracking-wider"
            >
              Explore Our Selection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-bold text-foreground mt-3 mb-4"
            >
              Our Menu
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Carefully crafted dishes made with the finest ingredients. 
              Browse our menu and add items to your cart.
            </motion.p>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-12 px-4 flex-1">
          <div className="container mx-auto max-w-7xl">
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
    </PageTransition>
  );
};

export default Menu;
