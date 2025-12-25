import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ChefHat, Bell, Utensils } from 'lucide-react';
import { OrderStatus, ORDER_STATUS_STEPS } from '@/types/restaurant';
import { cn } from '@/lib/utils';

const statusIcons = {
  pending: Clock,
  confirmed: Check,
  preparing: ChefHat,
  ready: Bell,
  served: Utensils,
};

interface OrderTrackerProps {
  currentStatus: OrderStatus;
  estimatedTime?: number;
}

export function OrderTracker({ currentStatus, estimatedTime }: OrderTrackerProps) {
  const activeSteps = ORDER_STATUS_STEPS.filter((s) => s.status !== 'cancelled');
  const currentIndex = activeSteps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Order Status</h2>
        {estimatedTime && currentStatus !== 'served' && (
          <div className="flex items-center gap-2 text-accent">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">~{estimatedTime} min</span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-secondary">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (activeSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {activeSteps.map((step, index) => {
            const Icon = statusIcons[step.status];
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300',
                    isComplete ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/30 animate-pulse-glow'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isComplete ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
