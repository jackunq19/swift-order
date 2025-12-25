import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, LayoutDashboard, Utensils } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Utensils className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Ember</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/kitchen" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <ChefHat className="w-4 h-4" />
              Kitchen
            </Link>
            <Link to="/admin" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2025 Ember Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
