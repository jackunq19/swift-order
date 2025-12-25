import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '@/types/restaurant';

interface CartState {
  items: CartItem[];
  currentOrder: Order | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity?: number; specialInstructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { itemId: string; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: OrderStatus };

const initialState: CartState = {
  items: [],
  currentOrder: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.menuItem.id === action.payload.menuItem.id
      );

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (action.payload.quantity || 1),
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            menuItem: action.payload.menuItem,
            quantity: action.payload.quantity || 1,
            specialInstructions: action.payload.specialInstructions,
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.menuItem.id !== action.payload.itemId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.menuItem.id !== action.payload.itemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.menuItem.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'UPDATE_INSTRUCTIONS':
      return {
        ...state,
        items: state.items.map((item) =>
          item.menuItem.id === action.payload.itemId
            ? { ...item, specialInstructions: action.payload.instructions }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_ORDER':
      return { ...state, currentOrder: action.payload, items: [] };

    case 'UPDATE_ORDER_STATUS':
      return state.currentOrder
        ? { ...state, currentOrder: { ...state.currentOrder, status: action.payload } }
        : state;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  placeOrder: (tableNumber?: string, customerName?: string) => Order;
  updateOrderStatus: (status: OrderStatus) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, specialInstructions } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const updateInstructions = (itemId: string, instructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { itemId, instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const placeOrder = (tableNumber?: string, customerName?: string): Order => {
    const totalAmount = state.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...state.items],
      status: 'pending',
      tableNumber,
      customerName,
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: 15 + Math.floor(Math.random() * 15),
    };

    dispatch({ type: 'SET_ORDER', payload: order });
    return order;
  };

  const updateOrderStatus = (status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: status });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        placeOrder,
        updateOrderStatus,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
