import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  TrendingUp,
  ChefHat,
  Utensils,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/context/OrdersContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Admin = () => {
  const { orders, getStats, getActiveOrders } = useOrders();
  const stats = getStats();
  const activeOrders = getActiveOrders();

  const statCards = [
    {
      title: 'Total Orders Today',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'primary',
      trend: '+12%',
    },
    {
      title: 'Revenue Today',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'success',
      trend: '+8%',
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Clock,
      color: 'warning',
    },
    {
      title: 'Avg Prep Time',
      value: `${stats.avgPrepTime} min`,
      icon: TrendingUp,
      color: 'info',
    },
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Ember Restaurant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/kitchen">
                <ChefHat className="w-4 h-4 mr-2" />
                Kitchen
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <Utensils className="w-4 h-4 mr-2" />
                Menu
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between">
                <div className={cn('p-2 rounded-lg', colorClasses[stat.color as keyof typeof colorClasses])}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.trend && (
                  <span className="text-xs text-success font-medium">{stat.trend}</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
              <Link to="/kitchen" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    {order.tableNumber && (
                      <span className="text-xs text-muted-foreground">
                        Table {order.tableNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Orders Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Active Orders</h2>
              <Button asChild size="sm">
                <Link to="/kitchen">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Open Kitchen
                </Link>
              </Button>
            </div>

            {activeOrders.length > 0 ? (
              <div className="space-y-3">
                {activeOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items.length} items
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active orders</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          <QuickActionCard
            title="Kitchen Display"
            description="View and manage live orders"
            icon={ChefHat}
            to="/kitchen"
          />
          <QuickActionCard
            title="Browse Menu"
            description="View customer menu"
            icon={Utensils}
            to="/"
          />
          <QuickActionCard
            title="Analytics"
            description="View detailed reports"
            icon={TrendingUp}
            to="/admin"
            disabled
          />
        </motion.div>
      </main>
    </div>
  );
};

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: 'status-badge status-pending',
    confirmed: 'status-badge status-preparing',
    preparing: 'status-badge status-preparing',
    ready: 'status-badge status-ready',
    served: 'status-badge status-served',
    cancelled: 'status-badge bg-destructive/20 text-destructive',
  };

  return (
    <span className={statusStyles[status] || 'status-badge'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
  disabled?: boolean;
}

function QuickActionCard({ title, description, icon: Icon, to, disabled }: QuickActionCardProps) {
  const content = (
    <div className={cn(
      'glass-card p-6 card-hover cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );

  if (disabled) return content;

  return <Link to={to}>{content}</Link>;
}

export default Admin;
