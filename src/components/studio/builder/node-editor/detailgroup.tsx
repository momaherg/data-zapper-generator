
import React from "react";

interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const DetailGroup: React.FC<DetailGroupProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  return (
    <details className="mb-4" open={defaultOpen}>
      <summary className="font-medium cursor-pointer p-2 bg-gray-100 rounded">
        {title}
      </summary>
      <div className="p-2 pl-4 border-l border-gray-200 ml-2 mt-2">
        {children}
      </div>
    </details>
  );
};

export default DetailGroup;
