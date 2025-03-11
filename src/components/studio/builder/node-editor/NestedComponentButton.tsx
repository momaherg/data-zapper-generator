
import React from "react";
import { Button } from "antd";
import { Edit } from "lucide-react";

export interface NestedComponentButtonProps {
  label: string;
  onClick: () => void;
}

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <Button
      type="text"
      onClick={onClick}
      icon={<Edit className="w-4 h-4" />}
      className="flex items-center justify-between w-full"
    >
      <span className="mr-2">{label}</span>
    </Button>
  );
};

export default NestedComponentButton;
