import React, { createContext, useCallback, useState, useEffect } from 'react';

// Creamos un context para mejorar la UX del usuario, proporcionando 
// notificaciones

const NotificationContext = createContext({ show: (msg) => {} });

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, duration: opts.duration || 3000 };
    setToasts((t) => [...t, toast]);
    return id;
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) => {
      const timer = setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== t.id));
      }, t.duration);
      return { id: t.id, timer };
    });
    return () => timers.forEach((t) => clearTimeout(t.timer));
  }, [toasts]);

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <div className="toasts-root" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
