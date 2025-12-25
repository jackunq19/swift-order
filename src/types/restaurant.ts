export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  isVeg: boolean;
  isAvailable: boolean;
  customizations?: Customization[];
}

export type MenuCategory = 'starters' | 'mains' | 'drinks' | 'desserts';

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations?: Record<string, string>;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  tableNumber?: string;
  customerName?: string;
  specialInstructions?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number; // in minutes
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: string;
}

export const ORDER_STATUS_STEPS: OrderStatusStep[] = [
  { status: 'pending', label: 'Order Placed', description: 'Waiting for confirmation', icon: 'clock' },
  { status: 'confirmed', label: 'Confirmed', description: 'Order accepted by kitchen', icon: 'check' },
  { status: 'preparing', label: 'Preparing', description: 'Chef is cooking your order', icon: 'chef-hat' },
  { status: 'ready', label: 'Ready', description: 'Your order is ready', icon: 'bell' },
  { status: 'served', label: 'Served', description: 'Enjoy your meal!', icon: 'utensils' },
];

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  avgPrepTime: number;
}
