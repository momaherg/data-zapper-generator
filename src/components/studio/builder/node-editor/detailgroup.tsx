
import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

export interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailGroup: React.FC<DetailGroupProps> = ({ title, children, defaultOpen = true }) => {
  return (
    <Collapse defaultActiveKey={defaultOpen ? ["1"] : undefined}>
      <Panel header={title} key="1">
        {children}
      </Panel>
    </Collapse>
  );
};

export default DetailGroup;
