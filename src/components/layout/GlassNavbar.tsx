import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingBag, ClipboardList, ChefHat, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  isExternal?: boolean;
}

const customerNav: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/#menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/#features', icon: ClipboardList, label: 'Features' },
  { to: '/cart', icon: ShoppingBag, label: 'Cart' },
];

const staffNav: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen' },
  { to: '/admin', icon: LayoutDashboard, label: 'Admin' },
];

export function GlassNavbar() {
  const location = useLocation();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const isStaffView = location.pathname.startsWith('/kitchen') || location.pathname.startsWith('/admin');
  const navItems = isStaffView ? staffNav : customerNav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = ['hero', 'features', 'menu'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section === 'hero' ? 'home' : section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (to: string) => {
    if (to.startsWith('/#')) {
      const sectionId = to.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (item: NavItem) => {
    if (item.to === '/') return activeSection === 'home' && location.pathname === '/';
    if (item.to === '/#menu') return activeSection === 'menu';
    if (item.to === '/#features') return activeSection === 'features';
    return location.pathname === item.to;
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500',
        scrolled ? 'top-4' : 'top-6'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500',
          'bg-background/20 backdrop-blur-2xl border border-white/10',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
          scrolled && 'bg-background/40 shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const isCart = item.to === '/cart';

          return (
            <Link
              key={item.to}
              to={item.to.startsWith('/#') ? '/' : item.to}
              onClick={() => handleNavClick(item.to)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                active
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </span>
              
              {/* Cart badge */}
              {isCart && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center z-20"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
