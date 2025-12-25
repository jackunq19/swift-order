import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { CartItemCard } from '@/components/cart/CartComponents';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Cart = () => {
  const { state, totalAmount, placeOrder, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsPlacing(true);

    // Simulate order placement delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order = placeOrder(tableNumber, customerName);
    addOrder(order);

    toast.success('Order placed successfully!', {
      description: `Order ID: ${order.id}`,
    });

    navigate(`/order/${order.id}`);
    setIsPlacing(false);
  };

  const tax = totalAmount * 0.08;
  const grandTotal = totalAmount + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-3xl font-semibold">Your Cart</h1>
        </div>

        {state.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu
            </p>
            <Button asChild>
              <Link to="/">Browse Menu</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {state.items.map((item) => (
                  <CartItemCard key={item.menuItem.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24 space-y-6">
                <h2 className="font-display text-xl font-semibold">Order Summary</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tableNumber">Table Number</Label>
                    <Input
                      id="tableNumber"
                      placeholder="e.g., 12"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerName">Your Name (optional)</Label>
                    <Input
                      id="customerName"
                      placeholder="e.g., John"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || state.items.length === 0}
                  className="w-full btn-glow"
                  size="lg"
                >
                  {isPlacing ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
