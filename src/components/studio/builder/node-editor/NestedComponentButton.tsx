
import React from "react";
import { Button } from "antd";
import { Edit } from "lucide-react";

export interface NestedComponentButtonProps {
  label: string;
  description?: string;
  onClick: () => void;
}

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({
  label,
  description,
  onClick,
}) => {
  return (
    <div className="bg-secondary p-4 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{label}</div>
          {description && <div className="text-xs text-secondary">{description}</div>}
        </div>
        <Button
          type="text"
          icon={<Edit className="w-4 h-4" />}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default NestedComponentButton;
