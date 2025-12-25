import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Order, OrderStatus, DashboardStats } from '@/types/restaurant';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getStats: () => DashboardStats;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Initial mock orders for demonstration
const initialOrders: Order[] = [
  {
    id: 'ORD-ABC123',
    items: [
      {
        menuItem: {
          id: 'main-1',
          name: 'Wagyu Ribeye',
          description: '12oz A5 Wagyu with bone marrow butter',
          price: 89.99,
          image: '/placeholder.svg',
          category: 'mains',
          isVeg: false,
          isAvailable: true,
        },
        quantity: 2,
      },
      {
        menuItem: {
          id: 'starter-1',
          name: 'Truffle Arancini',
          description: 'Crispy risotto balls with black truffle',
          price: 14.99,
          image: '/placeholder.svg',
          category: 'starters',
          isVeg: true,
          isAvailable: true,
        },
        quantity: 1,
      },
    ],
    status: 'preparing',
    tableNumber: '12',
    totalAmount: 194.97,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    estimatedTime: 20,
  },
  {
    id: 'ORD-DEF456',
    items: [
      {
        menuItem: {
          id: 'main-3',
          name: 'Wild Mushroom Pasta',
          description: 'Fresh tagliatelle with porcini',
          price: 32.99,
          image: '/placeholder.svg',
          category: 'mains',
          isVeg: true,
          isAvailable: true,
        },
        quantity: 1,
      },
    ],
    status: 'pending',
    tableNumber: '7',
    totalAmount: 32.99,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
    estimatedTime: 18,
  },
  {
    id: 'ORD-GHI789',
    items: [
      {
        menuItem: {
          id: 'dessert-1',
          name: 'Molten Chocolate Cake',
          description: 'Warm chocolate fondant',
          price: 14.99,
          image: '/placeholder.svg',
          category: 'desserts',
          isVeg: true,
          isAvailable: true,
        },
        quantity: 2,
      },
    ],
    status: 'ready',
    tableNumber: '3',
    totalAmount: 29.98,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    updatedAt: new Date(),
    estimatedTime: 12,
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
      )
    );
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  const getActiveOrders = useCallback(() => {
    return orders.filter((order) => !['served', 'cancelled'].includes(order.status));
  }, [orders]);

  const getStats = useCallback((): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter((order) => new Date(order.createdAt) >= today);
    const activeOrders = orders.filter(
      (order) => !['served', 'cancelled'].includes(order.status)
    );

    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const completedOrders = orders.filter((order) => order.status === 'served');
    const avgPrepTime =
      completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => sum + (order.estimatedTime || 15), 0) /
          completedOrders.length
        : 18;

    return {
      totalOrders: todayOrders.length,
      totalRevenue,
      activeOrders: activeOrders.length,
      avgPrepTime: Math.round(avgPrepTime),
    };
  }, [orders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getActiveOrders,
        getStats,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
