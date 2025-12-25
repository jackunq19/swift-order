import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Bell, Check, AlertCircle, Volume2, VolumeX, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/context/OrdersContext';
import { Order, OrderStatus } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Kitchen = () => {
  const { orders, updateOrderStatus, getActiveOrders } = useOrders();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const activeOrders = getActiveOrders();

  // Group orders by status
  const pendingOrders = activeOrders.filter((o) => o.status === 'pending');
  const preparingOrders = activeOrders.filter((o) => o.status === 'preparing' || o.status === 'confirmed');
  const readyOrders = activeOrders.filter((o) => o.status === 'ready');

  // Play sound on new order
  useEffect(() => {
    if (pendingOrders.length > 0 && soundEnabled) {
      // Browser audio notification would go here
    }
  }, [pendingOrders.length, soundEnabled]);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const getElapsedTime = (createdAt: Date) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return minutes;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold">Kitchen Display</h1>
                <p className="text-xs text-muted-foreground">
                  {activeOrders.length} active orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-muted-foreground"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Orders Grid */}
        <main className="container mx-auto p-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Column */}
            <OrderColumn
              title="New Orders"
              count={pendingOrders.length}
              color="warning"
              icon={AlertCircle}
            >
              <AnimatePresence mode="popLayout">
                {pendingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    elapsedTime={getElapsedTime(order.createdAt)}
                    onAccept={() => handleStatusUpdate(order.id, 'preparing')}
                    status="pending"
                  />
                ))}
              </AnimatePresence>
              {pendingOrders.length === 0 && <EmptyState message="No new orders" />}
            </OrderColumn>

            {/* Preparing Column */}
            <OrderColumn
              title="Preparing"
              count={preparingOrders.length}
              color="info"
              icon={ChefHat}
            >
              <AnimatePresence mode="popLayout">
                {preparingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    elapsedTime={getElapsedTime(order.createdAt)}
                    onMarkReady={() => handleStatusUpdate(order.id, 'ready')}
                    status="preparing"
                  />
                ))}
              </AnimatePresence>
              {preparingOrders.length === 0 && <EmptyState message="No orders being prepared" />}
            </OrderColumn>

            {/* Ready Column */}
            <OrderColumn
              title="Ready to Serve"
              count={readyOrders.length}
              color="success"
              icon={Bell}
            >
              <AnimatePresence mode="popLayout">
                {readyOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    elapsedTime={getElapsedTime(order.createdAt)}
                    onServed={() => handleStatusUpdate(order.id, 'served')}
                    status="ready"
                  />
                ))}
              </AnimatePresence>
              {readyOrders.length === 0 && <EmptyState message="No orders ready" />}
            </OrderColumn>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

interface OrderColumnProps {
  title: string;
  count: number;
  color: 'warning' | 'info' | 'success';
  icon: React.ElementType;
  children: React.ReactNode;
}

function OrderColumn({ title, count, color, icon: Icon, children }: OrderColumnProps) {
  const colorClasses = {
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
    success: 'text-success bg-success/10',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('p-2 rounded-lg', colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', colorClasses[color])}>
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface KitchenOrderCardProps {
  order: Order;
  elapsedTime: number;
  status: 'pending' | 'preparing' | 'ready';
  onAccept?: () => void;
  onMarkReady?: () => void;
  onServed?: () => void;
}

function KitchenOrderCard({
  order,
  elapsedTime,
  status,
  onAccept,
  onMarkReady,
  onServed,
}: KitchenOrderCardProps) {
  const isUrgent = elapsedTime > 15;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'glass-card p-4 space-y-3',
        isUrgent && status !== 'ready' && 'ring-2 ring-destructive/50'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-primary">{order.id}</span>
            {order.tableNumber && (
              <span className="px-2 py-0.5 bg-secondary rounded text-xs font-medium">
                Table {order.tableNumber}
              </span>
            )}
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-1 text-sm',
          isUrgent && status !== 'ready' ? 'text-destructive' : 'text-muted-foreground'
        )}>
          <Clock className="w-4 h-4" />
          <span>{elapsedTime}m</span>
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
            <span className="font-medium">{item.menuItem.name}</span>
            <span className="text-muted-foreground">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {order.specialInstructions && (
        <p className="text-sm text-accent italic bg-accent/10 p-2 rounded">
          Note: {order.specialInstructions}
        </p>
      )}

      <div className="pt-2">
        {status === 'pending' && onAccept && (
          <Button onClick={onAccept} className="w-full" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Accept Order
          </Button>
        )}
        {status === 'preparing' && onMarkReady && (
          <Button onClick={onMarkReady} className="w-full" size="sm" variant="secondary">
            <Bell className="w-4 h-4 mr-2" />
            Mark Ready
          </Button>
        )}
        {status === 'ready' && onServed && (
          <Button onClick={onServed} className="w-full" size="sm" variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark Served
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default Kitchen;
