import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {type === 'success' ? (
          <CheckCircle size={18} color="var(--neon-green)" />
        ) : (
          <AlertTriangle size={18} color="var(--neon-pink)" />
        )}
        <span style={{ fontSize: '0.95rem' }}>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          marginLeft: '1rem',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
