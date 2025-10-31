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
      
      // CORRECCIÓN: Usamos p._id (de Mongo) o p.id (del JSON viejo)
      const productId = p._id || p.id;
      
      const existing = state.items.find((i) => i.id === productId);
      
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        const item = {
          // CORRECCIÓN: Guardamos el ID correcto
          id: productId, 
          nombre: p.nombre,
          precio: p.precio,
          // CORRECCIÓN: Guardamos 'imagenUrl' en el campo 'imagen' del carrito
          imagen: p.imagenUrl || p.imagen, 
          quantity: qty
        };
        items = [...state.items, item];
      }
      return { ...state, items };
    }
    case 'REMOVE': {
      const id = action.payload;
       // CORRECCIÓN: Comparamos con i.id (que ya guardamos como _id)
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case 'SET_QTY': {
      const { id, qty } = action.payload;
      const items = state.items.map((i) =>
        // CORRECCIÓN: Comparamos con i.id
        i.id === id ? { ...i, quantity: Math.max(0, qty) } : i
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