const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizes[size]} rounded-full border-white/20 border-t-primary animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
