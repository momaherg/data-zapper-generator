
import React from 'react';

export interface NestedComponentButtonProps {
  label: string;
  onClick: () => void;
  description?: string;
}

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({ 
  label, 
  onClick, 
  description 
}) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-2 border rounded my-2 hover:bg-secondary/20 transition-colors"
    >
      <div className="flex flex-col items-start">
        <span className="font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <span className="text-xs bg-primary/10 px-2 py-1 rounded">Edit</span>
    </button>
  );
};

export default NestedComponentButton;
