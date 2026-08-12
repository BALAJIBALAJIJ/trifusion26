import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-dark-surface border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-primary focus:ring-primary/20'} rounded-md px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:ring-2 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
