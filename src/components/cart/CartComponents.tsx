import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function FloatingCart() {
  const { totalItems, totalAmount } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          onClick={() => navigate('/cart')}
          size="lg"
          className="rounded-full px-6 btn-glow shadow-2xl"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          <span className="font-semibold">{totalItems} items</span>
          <span className="mx-2 text-primary-foreground/50">|</span>
          <span className="font-bold">${totalAmount.toFixed(2)}</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}

interface CartItemCardProps {
  item: {
    menuItem: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    specialInstructions?: string;
  };
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem, updateInstructions } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-card p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{item.menuItem.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ${item.menuItem.price.toFixed(2)} each
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeItem(item.menuItem.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <input
          type="text"
          placeholder="Special instructions..."
          value={item.specialInstructions || ''}
          onChange={(e) => updateInstructions(item.menuItem.id, e.target.value)}
          className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
        <span className="font-semibold text-primary">
          ${(item.menuItem.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}
