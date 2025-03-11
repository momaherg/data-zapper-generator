import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../lib/utils";

export interface ComponentProps {
  className?: string;
  [key: string]: any;
}

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { size?: "lg" | "md" | "sm" }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    lg: "text-3xl font-bold",
    md: "text-2xl font-bold",
    sm: "text-xl font-semibold",
  };

  return (
    <h2
      ref={ref}
      className={cn(sizeClasses[size], "tracking-tight", className)}
      {...props}
    />
  );
});
Heading.displayName = "Heading";

export const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
});
Paragraph.displayName = "Paragraph";

export interface TruncatableTextProps {
  text: string;
  maxLength?: number;
}

export const TruncatableText: React.FC<TruncatableTextProps> = ({ 
  text, 
  maxLength = 50 
}) => {
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <span title={text}>
      {text.substring(0, maxLength)}...
    </span>
  );
};

export const getRelativeTimeString = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};

export const MarkdownContent: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("prose dark:prose-invert", className)}>
      <div className="markdown-content">
        {children}
      </div>
    </div>
  );
};

export const InlineMarkdown: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  // Simple conversion for inline markdown without using a full component
  return (
    <span className={className}>
      {children}
    </span>
  );
};
