import React from 'react';
import { GlassNavbar } from '@/components/layout/GlassNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <GlassNavbar />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
