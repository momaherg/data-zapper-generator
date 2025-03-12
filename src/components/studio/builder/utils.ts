
import { nanoid } from "nanoid";
import {
  TeamConfig,
  Component,
  ComponentConfig,
  AgentConfig,
} from "../datamodel";
import {
  isAssistantAgent,
  isUserProxyAgent,
  isWebSurferAgent,
} from "../guards";
import { CustomNode, CustomEdge } from "./types";

interface Position {
  x: number;
  y: number;
}

interface NodeDimensions {
  width: number;
  height: number;
}

const LAYOUT_CONFIG = {
  TEAM_NODE: {
    X_POSITION: 100,
    MIN_Y_POSITION: 200,
  },
  AGENT: {
    START_X: 600,
    START_Y: 200,
    X_STAGGER: 0,
    MIN_Y_STAGGER: 50,
  },
  NODE: {
    WIDTH: 272,
    MIN_HEIGHT: 100,
    PADDING: 20,
  },
  CONTENT_HEIGHTS: {
    BASE: 80,
    DESCRIPTION: 60,
    MODEL_SECTION: 100,
    TOOL_SECTION: 80,
    TOOL_ITEM: 40,
    AGENT_SECTION: 80,
    AGENT_ITEM: 40,
    TERMINATION_SECTION: 80,
  },
};

const calculateNodeHeight = (component: Component<ComponentConfig>): number => {
  let height = LAYOUT_CONFIG.CONTENT_HEIGHTS.BASE;

  if (component.description) {
    height += LAYOUT_CONFIG.CONTENT_HEIGHTS.DESCRIPTION;
  }

  switch (component.component_type) {
    case "team":
      const teamConfig = component as Component<TeamConfig>;
      if (teamConfig.config.participants?.length) {
        height += LAYOUT_CONFIG.CONTENT_HEIGHTS.AGENT_SECTION;
        height +=
          teamConfig.config.participants.length *
          LAYOUT_CONFIG.CONTENT_HEIGHTS.AGENT_ITEM;
      }
      if (teamConfig.config.termination_condition) {
        height += LAYOUT_CONFIG.CONTENT_HEIGHTS.TERMINATION_SECTION;
      }
      break;

    case "agent":
      if (isAssistantAgent(component)) {
        height += 200;
        if (component.config.tools?.length) {
          height += LAYOUT_CONFIG.CONTENT_HEIGHTS.TOOL_SECTION;
          height +=
            component.config.tools.length *
            LAYOUT_CONFIG.CONTENT_HEIGHTS.TOOL_ITEM;
        }
      }
      if (isWebSurferAgent(component)) {
        height += 100;
      }

      if (isUserProxyAgent(component)) {
        height += -100;
      }

      break;
  }

  return Math.max(height, LAYOUT_CONFIG.NODE.MIN_HEIGHT);
};

const calculateAgentPosition = (
  index: number,
  previousNodes: CustomNode[]
): Position => {
  const previousNodeHeights = previousNodes.map(
    (node) => calculateNodeHeight(node.data.component) + 50
  );

  const totalPreviousHeight = previousNodeHeights.reduce(
    (sum, height) => sum + height + LAYOUT_CONFIG.AGENT.MIN_Y_STAGGER,
    0
  );

  return {
    x: LAYOUT_CONFIG.AGENT.START_X + index * LAYOUT_CONFIG.AGENT.X_STAGGER,
    y: LAYOUT_CONFIG.AGENT.START_Y + totalPreviousHeight,
  };
};

const calculateTeamPosition = (agentNodes: CustomNode[]): Position => {
  if (agentNodes.length === 0) {
    return {
      x: LAYOUT_CONFIG.TEAM_NODE.X_POSITION,
      y: LAYOUT_CONFIG.TEAM_NODE.MIN_Y_POSITION,
    };
  }

  const totalY = agentNodes.reduce((sum, node) => sum + node.position.y, 0);
  const averageY = totalY / agentNodes.length;

  return {
    x: LAYOUT_CONFIG.TEAM_NODE.X_POSITION,
    y: Math.max(LAYOUT_CONFIG.TEAM_NODE.MIN_Y_POSITION, averageY),
  };
};

const createNode = (
  position: Position,
  component: Component<ComponentConfig>,
  label?: string
): CustomNode => ({
  id: nanoid(),
  position,
  type: component.component_type,
  data: {
    label: label || component.label || component.component_type,
    component,
    type: component.component_type,
    dimensions: {
      width: LAYOUT_CONFIG.NODE.WIDTH,
      height: calculateNodeHeight(component),
    },
  },
});

const createEdge = (
  source: string,
  target: string,
  type: "agent-connection"
): CustomEdge => ({
  id: `e${source}-${target}`,
  source,
  target,
  sourceHandle: `${source}-agent-output-handle`,
  targetHandle: `${target}-agent-input-handle`,
  type,
});

export const convertTeamConfigToGraph = (
  teamComponent: Component<TeamConfig>
): { nodes: CustomNode[]; edges: CustomEdge[] } => {
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];

  // Create team node
  const teamNode = createNode(
    { x: LAYOUT_CONFIG.TEAM_NODE.X_POSITION, y: LAYOUT_CONFIG.TEAM_NODE.MIN_Y_POSITION },
    teamComponent,
    "Team"
  );
  nodes.push(teamNode);

  // Create agent nodes if they exist
  if (teamComponent.config.participants && Array.isArray(teamComponent.config.participants)) {
    const agentNodes: CustomNode[] = [];
    
    teamComponent.config.participants.forEach((agent, index) => {
      const position = calculateAgentPosition(index, agentNodes);
      const agentNode = createNode(position, agent, agent.config.name || `Agent ${index + 1}`);
      agentNodes.push(agentNode);
      
      // Create edge from team to agent
      edges.push(
        createEdge(teamNode.id, agentNode.id, "agent-connection")
      );
    });
    
    nodes.push(...agentNodes);
    
    // Adjust team node position based on agents
    if (agentNodes.length > 0) {
      teamNode.position = calculateTeamPosition(agentNodes);
    }
  }

  return { nodes, edges };
};

export const getLayoutedElements = (
  nodes: CustomNode[],
  edges: CustomEdge[]
): { nodes: CustomNode[]; edges: CustomEdge[] } => {
  const teamNode = nodes.find((n) => n.data.type === "team");
  if (!teamNode) return { nodes, edges };

  const agentNodes = nodes.filter((n) => n.data.type !== "team");

  const layoutedAgentNodes = agentNodes.map((node, index) => ({
    ...node,
    position: calculateAgentPosition(index, agentNodes.slice(0, index)),
    data: {
      ...node.data,
      dimensions: {
        width: LAYOUT_CONFIG.NODE.WIDTH,
        height: calculateNodeHeight(node.data.component),
      },
    },
  }));

  const layoutedTeamNode = {
    ...teamNode,
    position: calculateTeamPosition(layoutedAgentNodes),
    data: {
      ...teamNode.data,
      dimensions: {
        width: LAYOUT_CONFIG.NODE.WIDTH,
        height: calculateNodeHeight(teamNode.data.component),
      },
    },
  };

  return {
    nodes: [layoutedTeamNode, ...layoutedAgentNodes],
    edges,
  };
};

export const getUniqueName = (
  baseName: string,
  existingNames: string[]
): string => {
  let validBaseName = baseName
    .replace(/[^a-zA-Z0-9_$]/g, "_")
    .replace(/^([^a-zA-Z_$])/, "_$1");

  if (!existingNames.includes(validBaseName)) return validBaseName;

  let counter = 1;
  while (existingNames.includes(`${validBaseName}_${counter}`)) {
    counter++;
  }
  return `${validBaseName}_${counter}`;
};
