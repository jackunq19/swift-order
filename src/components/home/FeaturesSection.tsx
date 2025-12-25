import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  ChefHat, 
  Clock, 
  BarChart3, 
  Bell, 
  Shield,
  Zap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Digital Ordering',
    description: 'Customers browse the menu and place orders directly from their table. No waiting for waiters.',
    color: 'from-primary to-primary/60',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Dashboard',
    description: 'Orders appear instantly in the kitchen with real-time status updates and priority management.',
    color: 'from-accent to-accent/60',
  },
  {
    icon: Clock,
    title: 'Live Order Tracking',
    description: 'Customers track their order status in real-time from placement to serving.',
    color: 'from-primary to-accent',
  },
  {
    icon: BarChart3,
    title: 'Admin Analytics',
    description: 'Complete business insights with revenue tracking, popular dishes, and performance metrics.',
    color: 'from-accent to-primary',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Sound alerts and visual notifications keep the kitchen staff updated on new orders.',
    color: 'from-primary/80 to-primary',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Role-based access control ensures staff and admin areas remain protected.',
    color: 'from-accent/80 to-accent',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'All changes sync instantly across customer, kitchen, and admin dashboards.',
    color: 'from-primary to-accent/80',
  },
  {
    icon: Users,
    title: 'Multi-Role System',
    description: 'Separate interfaces for customers, kitchen staff, and administrators.',
    color: 'from-accent/80 to-primary/80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Complete Restaurant Automation
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From customer ordering to kitchen management and admin analytics — 
            everything works seamlessly together in real-time.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Roles Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <RoleCard
            title="Customer"
            description="Browse menu, add items to cart, place orders, and track status in real-time. No login required."
            link="/#menu"
            linkText="View Menu"
            gradient="from-primary/20 to-primary/5"
          />
          <RoleCard
            title="Kitchen Staff"
            description="View incoming orders, update preparation status, and manage the kitchen workflow efficiently."
            link="/kitchen"
            linkText="Kitchen Dashboard"
            gradient="from-accent/20 to-accent/5"
          />
          <RoleCard
            title="Admin"
            description="Monitor all operations, manage menu items, view analytics, and control the entire restaurant."
            link="/admin"
            linkText="Admin Panel"
            gradient="from-primary/10 via-accent/10 to-primary/10"
          />
        </motion.div>
      </div>
    </section>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  gradient: string;
}

function RoleCard({ title, description, link, linkText, gradient }: RoleCardProps) {
  return (
    <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${gradient} border border-border/30 group hover:border-border transition-all duration-300`}>
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      <a
        href={link}
        className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
      >
        {linkText}
        <span>→</span>
      </a>
    </div>
  );
}
