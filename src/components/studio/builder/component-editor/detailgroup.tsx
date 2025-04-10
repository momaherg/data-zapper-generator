
import React from "react";
import { cn } from "@/lib/utils";

interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export const DetailGroup: React.FC<DetailGroupProps> = ({
  title,
  children,
  defaultOpen = true,
  className,
  titleClassName,
  contentClassName,
}) => {
  return (
    <details className={cn("mb-4", className)} open={defaultOpen}>
      <summary className={cn("font-medium cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex justify-between items-center", titleClassName)}>
        <span>{title}</span>
        <span className="text-xs text-gray-500 details-marker-hidden">Click to {defaultOpen ? 'hide' : 'show'}</span>
      </summary>
      <div className={cn("p-2 pl-4 border-l border-gray-200 ml-2 mt-2", contentClassName)}>
        {children}
      </div>
    </details>
  );
};

export default DetailGroup;
