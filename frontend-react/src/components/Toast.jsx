import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderColor = '#10b981';
        let iconColor = '#059669';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = '#ef4444';
          iconColor = '#dc2626';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderColor = '#3b82f6';
          iconColor = '#2563eb';
        }

        return (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
