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
  text?: string | null;
  content?: string | null;
  maxLength?: number;
  showFullscreen?: boolean;
  textThreshold?: number;
}

export const TruncatableText: React.FC<TruncatableTextProps> = ({ 
  text,
  content,
  maxLength = 50,
  showFullscreen = false,
  textThreshold = 100 
}) => {
  const displayText = text || content || '';
  if (!displayText) return <span>-</span>;
  if (displayText.length <= maxLength) return <span>{displayText}</span>;
  return (
    <span title={displayText}>
      {displayText.substring(0, maxLength)}...
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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const InlineMarkdown: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <span className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </span>
  );
};
