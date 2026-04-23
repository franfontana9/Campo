import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("select-campo h-11", className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
