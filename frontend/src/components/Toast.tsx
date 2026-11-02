import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span style={{ flex: 1 }}>{toast.text}</span>
          <button
            onClick={() => onRemove(toast.id)}
            style={{ color: '#94a3b8', fontSize: '1rem', marginLeft: 8 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
