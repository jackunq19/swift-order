import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Leaf } from 'lucide-react';
import { MenuItem } from '@/types/restaurant';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import food images
import aranciniImg from '@/assets/food-arancini.jpg';
import wagyuImg from '@/assets/food-wagyu.jpg';
import chocolateImg from '@/assets/food-chocolate.jpg';
import cocktailImg from '@/assets/food-cocktail.jpg';

// Map menu item IDs to images
const imageMap: Record<string, string> = {
  'starter-1': aranciniImg,
  'starter-2': aranciniImg,
  'starter-3': aranciniImg,
  'starter-4': aranciniImg,
  'main-1': wagyuImg,
  'main-2': wagyuImg,
  'main-3': wagyuImg,
  'main-4': wagyuImg,
  'main-5': wagyuImg,
  'drink-1': cocktailImg,
  'drink-2': cocktailImg,
  'drink-3': cocktailImg,
  'drink-4': cocktailImg,
  'dessert-1': chocolateImg,
  'dessert-2': chocolateImg,
  'dessert-3': chocolateImg,
  'dessert-4': chocolateImg,
};

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart`, {
      description: `$${item.price.toFixed(2)}`,
    });
  };

  const itemImage = imageMap[item.id] || aranciniImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group glass-card overflow-hidden card-hover"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={itemImage}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Veg indicator */}
        {item.isVeg && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
            <Leaf className="w-3 h-3" />
            Veg
          </div>
        )}

        {/* Add button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-3 right-3"
        >
          <Button
            onClick={handleAddToCart}
            size="icon"
            className="rounded-full btn-glow"
            disabled={!item.isAvailable}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-medium text-foreground leading-tight">
            {item.name}
          </h3>
          <span className="text-primary font-semibold whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
