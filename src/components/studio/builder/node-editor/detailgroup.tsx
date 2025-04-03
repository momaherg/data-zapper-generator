
import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

export interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
}

export const DetailGroup: React.FC<DetailGroupProps> = ({ title, children }) => {
  return (
    <Card
      title={<Text strong>{title}</Text>}
      size="small"
      className="mb-4"
      bodyStyle={{ padding: "12px" }}
    >
      {children}
    </Card>
  );
};

export default DetailGroup;
