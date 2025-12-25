import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Receipt } from 'lucide-react';
import { useOrders } from '@/context/OrdersContext';
import { useCart } from '@/context/CartContext';
import { OrderTracker } from '@/components/order/OrderTracker';
import { GlassNavbar } from '@/components/layout/GlassNavbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/types/restaurant';

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { state } = useCart();

  // Use order from context or cart's current order
  const order = orderId ? getOrderById(orderId) : state.currentOrder;

  // Simulate order status progression
  useEffect(() => {
    if (!order || order.status === 'served') return;

    const statusSequence: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];
    const currentIndex = statusSequence.indexOf(order.status);

    if (currentIndex < statusSequence.length - 1) {
      const timer = setTimeout(() => {
        if (orderId) {
          updateOrderStatus(orderId, statusSequence[currentIndex + 1]);
        }
      }, 8000 + Math.random() * 7000); // 8-15 seconds between status changes

      return () => clearTimeout(timer);
    }
  }, [order?.status, orderId, updateOrderStatus]);

  if (!order) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <GlassNavbar />
          <main className="container mx-auto px-4 pt-28 text-center">
            <h1 className="text-2xl font-display font-semibold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button asChild>
              <Link to="/menu">Back to Menu</Link>
            </Button>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <GlassNavbar />

        <main className="container mx-auto px-4 pt-28 pb-8 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/menu"
              className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-3xl font-semibold">Order Tracking</h1>
              <p className="text-muted-foreground text-sm mt-1">Order ID: {order.id}</p>
            </div>
          </div>

          <div className="space-y-6">
            <OrderTracker currentStatus={order.status} estimatedTime={order.estimatedTime} />

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Order Details</h2>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium">{item.menuItem.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                {order.tableNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Table</span>
                    <span>{order.tableNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Estimated Time */}
            {order.status !== 'served' && order.estimatedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 flex items-center justify-center gap-3 text-center"
              >
                <Clock className="w-6 h-6 text-accent animate-pulse" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Time</p>
                  <p className="text-2xl font-bold text-accent">{order.estimatedTime} min</p>
                </div>
              </motion.div>
            )}

            {order.status === 'served' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">Enjoy Your Meal!</h3>
                <p className="text-muted-foreground">
                  Thank you for dining with us at Ember.
                </p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default OrderTracking;
