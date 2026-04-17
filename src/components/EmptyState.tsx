import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <div className="w-24 h-2 bg-gold/10 rounded-full mb-8" />
      <h3 className="text-xl font-display font-bold text-navy mb-3">{title}</h3>
      <p className="text-navy/40 text-sm leading-relaxed mb-10 max-w-[260px]">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="h-14 rounded-2xl bg-gold text-navy font-bold px-8 shadow-lg shadow-gold/20"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
