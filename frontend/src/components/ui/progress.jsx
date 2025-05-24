import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ 
  className, 
  value, 
  max = 100,
  variant = "default",
  showValue = false,
  thickness = "md",
  animated = true,
  ...props 
}, ref) => {
  const percentage = value != null ? Math.min(Math.max(0, value), max) : 0;
  
  const variants = {
    default: "bg-primary-600",
    secondary: "bg-secondary-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    destructive: "bg-red-600",
  };
  
  const thicknessClasses = {
    sm: "h-1",
    md: "h-2", 
    lg: "h-3",
    xl: "h-4",
  };
  
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full bg-gray-700/30 rounded-full overflow-hidden",
          thicknessClasses[thickness] || thicknessClasses.md
        )}
        value={percentage}
        max={max}
        {...props}
      >
        {animated ? (
          <motion.div
            className={cn(
              "h-full transition-all duration-300",
              variants[variant] || variants.default
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 60, 
              damping: 12 
            }}
          />
        ) : (
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full transition-all",
              variants[variant] || variants.default
            )}
            style={{ width: `${percentage}%` }}
          />
        )}
      </ProgressPrimitive.Root>
      
      {showValue && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
          <span>{percentage}%</span>
          <span>{max}%</span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress }; 