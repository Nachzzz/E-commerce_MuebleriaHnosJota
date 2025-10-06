import React, { createContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'mhj_cart_v1';

const initialState = {
  items: [] // { id, nombre, precio, imagen, cantidad }
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD': {
      const p = action.payload.product;
      const qty = action.payload.qty || 1;
      const existing = state.items.find((i) => Number(i.id) === Number(p.id));
      let items;
      if (existing) {
        items = state.items.map((i) =>
          Number(i.id) === Number(p.id) ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        const item = {
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen,
          quantity: qty
        };
        items = [...state.items, item];
      }
      return { ...state, items };
    }
    case 'REMOVE': {
      const id = action.payload;
      return { ...state, items: state.items.filter((i) => Number(i.id) !== Number(id)) };
    }
    case 'SET_QTY': {
      const { id, qty } = action.payload;
      const items = state.items.map((i) =>
        Number(i.id) === Number(id) ? { ...i, quantity: Math.max(0, qty) } : i
      ).filter(i => i.quantity > 0);
      return { ...state, items };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch (err) {
      console.warn('Failed to load cart from storage', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save cart to storage', err);
    }
  }, [state]);

  const addToCart = (product, qty = 1) => dispatch({ type: 'ADD', payload: { product, qty } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', payload: id });
  const setQuantity = (id, qty) => dispatch({ type: 'SET_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalCount = state.items.reduce((s, it) => s + (it.quantity || 0), 0);
  const totalPrice = state.items.reduce((s, it) => s + (it.precio || 0) * it.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      totalCount,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
