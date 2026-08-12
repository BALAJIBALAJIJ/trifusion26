import { Toaster, toast } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--color-dark-card)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-accent)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export { toast };
