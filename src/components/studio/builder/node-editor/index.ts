
import { DetailGroup } from "./detailgroup";

export { DetailGroup };

export interface EditPath {
  field: string;
  id?: string;
}

// Re-export field components
export * from "./fields/fields";
export * from "./fields/agent-fields";
export * from "./fields/model-fields";
export * from "./fields/team-fields";
export * from "./fields/termination-fields";
export * from "./fields/tool-fields";
