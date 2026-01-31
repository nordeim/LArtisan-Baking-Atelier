'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  CartItem,
  CartState,
  CartContextValue,
  CartAction,
  CartError,
} from '@/types/cart';
import {
  calculateCartTotals,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  hasItemInCart,
  getItemQuantity,
  validateCartStock,
  saveCartToStorage,
  loadCartFromStorage,
  clearCartFromStorage,
} from '@/lib/cart-utils';

/**
 * Cart Provider Component
 * 
 * Manages cart state with React Context and persists to localStorage.
 * Provides cart operations and calculated totals to child components.
 */

// ============================================
// Initial State
// ============================================

const initialState: CartState = {
  items: [],
  totals: {
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    itemCount: 0,
    uniqueItemCount: 0,
  },
  lastUpdated: Date.now(),
  isLoading: true,
};

// ============================================
// Reducer
// ============================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity = 1 } = action.payload;
      const newItems = addItemToCart(state.items, item, quantity);
      return {
        ...state,
        items: newItems,
        totals: calculateCartTotals(newItems),
        lastUpdated: Date.now(),
      };
    }

    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      const newItems = removeItemFromCart(state.items, id);
      return {
        ...state,
        items: newItems,
        totals: calculateCartTotals(newItems),
        lastUpdated: Date.now(),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const newItems = updateItemQuantity(state.items, id, quantity);
      return {
        ...state,
        items: newItems,
        totals: calculateCartTotals(newItems),
        lastUpdated: Date.now(),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...initialState,
        isLoading: false,
        lastUpdated: Date.now(),
      };
    }

    case 'SET_CART': {
      const { items } = action.payload;
      return {
        ...state,
        items,
        totals: calculateCartTotals(items),
        lastUpdated: Date.now(),
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

export const CartContext = createContext<CartContextValue | null>(null);

// ============================================
// Provider Component
// ============================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const storedItems = loadCartFromStorage();
      if (storedItems) {
        dispatch({ type: 'SET_CART', payload: { items: storedItems } });
      }
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
    };

    loadCart();
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (!state.isLoading) {
      if (state.items.length === 0) {
        clearCartFromStorage();
      } else {
        saveCartToStorage(state.items);
      }
    }
  }, [state.items, state.isLoading]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lartisan-cart' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.items) {
            dispatch({ type: 'SET_CART', payload: { items: data.items } });
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ============================================
  // Actions
  // ============================================

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity?: number) => {
      try {
        dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
        return { success: true, error: null as CartError | null };
      } catch (error) {
        return { success: false, error: error as CartError };
      }
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    try {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      return { success: true, error: null as CartError | null };
    } catch (error) {
      return { success: false, error: error as CartError };
    }
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    clearCartFromStorage();
  }, []);

  const hasItem = useCallback(
    (id: string) => hasItemInCart(state.items, id),
    [state.items]
  );

  const getItemQty = useCallback(
    (id: string) => getItemQuantity(state.items, id),
    [state.items]
  );

  const validateStock = useCallback(() => validateCartStock(state.items), [state.items]);

  // ============================================
  // Context Value
  // ============================================

  const contextValue = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      hasItem,
      getItemQuantity: getItemQty,
      validateStock,
    }),
    [state, addItem, removeItem, updateQuantity, clearCart, hasItem, getItemQty, validateStock]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
