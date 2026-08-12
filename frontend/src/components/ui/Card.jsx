const Card = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: "bg-dark-card border border-white/10 rounded-xl overflow-hidden",
    glow: "bg-dark-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300",
    neon: "glass-dark rounded-xl overflow-hidden hover:neon-box transition-all duration-300"
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
