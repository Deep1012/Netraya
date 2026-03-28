import { useState, useEffect } from 'react';

let toastId = 0;
let addToastFn = null;

export function showToast(message, type = 'success') {
  if (addToastFn) {
    addToastFn({ id: ++toastId, message, type });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          pointer-events: none;
          width: 90%;
          max-width: 400px;
        }
        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          animation: toastDrop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
          backdrop-filter: blur(12px);
        }
        .toast-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .toast-success {
          background: rgba(4, 120, 87, 0.92);
          border: 1px solid rgba(52, 211, 153, 0.3);
        }
        .toast-success .toast-icon {
          background: rgba(52, 211, 153, 0.3);
        }
        .toast-error {
          background: rgba(185, 28, 28, 0.92);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .toast-error .toast-icon {
          background: rgba(239, 68, 68, 0.3);
        }
        .toast-info {
          background: rgba(30, 64, 175, 0.92);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .toast-info .toast-icon {
          background: rgba(59, 130, 246, 0.3);
        }
        @keyframes toastDrop {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type || 'success'}`}
          >
            <span className="toast-icon">
              {toast.type === 'success' && '\u2713'}
              {toast.type === 'error' && '\u2717'}
              {toast.type === 'info' && 'i'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
