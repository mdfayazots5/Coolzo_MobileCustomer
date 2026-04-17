import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'default' | 'white' | 'gold';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconOnly = false,
  variant = 'default' 
}) => {
  const colors = {
    default: {
      text: 'text-navy'
    },
    white: {
      text: 'text-warm-white'
    },
    gold: {
      text: 'text-gold'
    }
  };

  const currentColors = colors[variant];

  if (iconOnly) {
    return (
      <span className={cn(
        "font-display font-medium uppercase tracking-widest",
        currentColors.text,
        className
      )}>
        C
      </span>
    );
  }

  return (
    <div className={cn("select-none", className)}>
      <span className={cn(
        "text-3xl font-display font-medium tracking-tight",
        currentColors.text
      )}>
        Coolzo
      </span>
    </div>
  );
};
