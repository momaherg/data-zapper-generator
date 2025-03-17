
import React from 'react';

interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
}

const DetailGroup: React.FC<DetailGroupProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="bg-white p-4 rounded-md border border-gray-200">
        {children}
      </div>
    </div>
  );
};

export default DetailGroup;
