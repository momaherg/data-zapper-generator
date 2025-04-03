
import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

export interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const DetailGroup: React.FC<DetailGroupProps> = ({ title, children, defaultOpen = true }) => {
  return (
    <Card
      title={<Text strong>{title}</Text>}
      size="small"
      className="mb-4"
      bodyStyle={{ padding: "12px" }}
      defaultActiveTabKey={defaultOpen ? "1" : undefined}
    >
      {children}
    </Card>
  );
};

export default DetailGroup;
