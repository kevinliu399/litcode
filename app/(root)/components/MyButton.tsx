import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function MyButton({ 
  text, 
  onClick, 
  variant = 'default',
  size = 'md',
  disabled = false 
}: ButtonProps) {
  const baseStyles = "relative font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-2.5 text-lg"
  };

  const variantStyles = {
    default: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
    outline: "bg-transparent hover:bg-lime-400/10 text-lime-400 border border-lime-400/50 hover:border-lime-400"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} rounded-lg`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="relative z-10">
        {text}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </button>
  );
}

export default MyButton;