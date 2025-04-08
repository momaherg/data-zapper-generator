
import React, { useState } from "react";
import { Input, Collapse, type CollapseProps, Button, Modal } from "antd";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Brain,
  ChevronDown,
  Bot,
  Wrench,
  Timer,
  Maximize2,
  Minimize2,
  GripVertical,
  Loader2,
  AlertCircle,
  Users,
  PlayCircle
} from "lucide-react";
import Sider from "antd/es/layout/Sider";
import { useGalleryStore } from "../gallery/store";
import { useTeamBuilderStore } from "./store";
import { ComponentTypes } from "../datamodel";
import { toast } from "sonner";
import TeamSelectionModal from "./components/TeamSelectionModal";

interface ComponentConfigTypes {
  [key: string]: any;
}

interface LibraryProps {}

interface PresetItemProps {
  id: string;
  type: ComponentTypes;
  config: ComponentConfigTypes;
  label: string;
  icon: React.ReactNode;
}

const PresetItem: React.FC<PresetItemProps> = ({
  id,
  type,
  config,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        current: {
          type,
          config,
          label,
          icon,
        },
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-2 text-primary mb-2 border rounded cursor-move bg-white hover:bg-gray-50 transition-colors`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 inline-block" />
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

interface TeamItemProps {
  team: any;
  onLoad: (team: any) => void;
}

const TeamItem: React.FC<TeamItemProps> = ({ team, onLoad }) => {
  return (
    <div className="p-2 text-primary mb-2 border rounded bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{team.label || "Unnamed Team"}</span>
        </div>
        <Button 
          type="text" 
          size="small"
          onClick={() => onLoad(team)}
          title="Load this team into the builder"
          className="flex items-center gap-1 text-xs"
        >
          <PlayCircle className="w-3 h-3" />
          Load
        </Button>
      </div>
      {team.description && (
        <div className="mt-1 text-xs text-gray-500 pl-6">
          {team.description.length > 100 
            ? team.description.substring(0, 100) + "..." 
            : team.description}
        </div>
      )}
    </div>
  );
};

const getDefaultComponents = () => {
  return {
    agents: [
      {
        label: "Research Agent",
        config: {
          provider: "anthropic",
          component_type: "agent",
          config: {
            name: "Research Agent",
            system_prompt: "You are a helpful research assistant."
          }
        }
      },
      {
        label: "Writing Agent",
        config: {
          provider: "openai",
          component_type: "agent",
          config: {
            name: "Writing Agent",
            system_prompt: "You are a creative writing assistant."
          }
        }
      },
      {
        label: "Coding Agent",
        config: {
          provider: "anthropic",
          component_type: "agent",
          config: {
            name: "Coding Agent",
            system_prompt: "You are a helpful coding assistant."
          }
        }
      }
    ],
    models: [
      {
        label: "GPT-4",
        config: {
          provider: "openai",
          component_type: "model",
          config: {
            model: "gpt-4"
          }
        }
      },
      {
        label: "Claude",
        config: {
          provider: "anthropic",
          component_type: "model",
          config: {
            model: "claude-3-opus-20240229"
          }
        }
      }
    ],
    tools: [
      {
        label: "Web Search",
        config: {
          provider: "web_search",
          component_type: "tool",
          config: {
            name: "Web Search",
            description: "Search the web for information."
          }
        }
      },
      {
        label: "Calculator",
        config: {
          provider: "calculator",
          component_type: "tool",
          config: {
            name: "Calculator",
            description: "Perform mathematical calculations."
          }
        }
      }
    ],
    terminations: [
      {
        label: "Max Turns",
        config: {
          provider: "max_turns",
          component_type: "termination",
          config: {
            max_turns: 10
          }
        }
      },
      {
        label: "Timeout",
        config: {
          provider: "timeout",
          component_type: "termination",
          config: {
            timeout_seconds: 300
          }
        }
      }
    ],
    teams: []
  };
};

const extractGalleryComponents = (gallery: any) => {
  if (!gallery) return getDefaultComponents();
  
  const components = gallery.components || gallery.config?.components || {};
  
  return {
    agents: components.agents || [],
    models: components.models || [],
    tools: components.tools || [],
    terminations: components.terminations || [],
    teams: components.teams || [],
  };
};

const TeamLoadConfirmModal = ({ team, visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Replace Current Team?"
      open={visible}
      onOk={() => onConfirm(team)}
      onCancel={onCancel}
      okText="Load Team"
      cancelText="Cancel"
    >
      <p>
        Loading "{team?.label || 'this team'}" will replace your current team configuration. 
        Unsaved changes will be lost.
      </p>
      <p className="mt-2">
        Are you sure you want to continue?
      </p>
    </Modal>
  );
};

export const ComponentLibrary: React.FC<LibraryProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  const gallery = useGalleryStore((state) => state.getSelectedGallery());
  const galleryLoading = useGalleryStore((state) => state.isLoading);
  const galleryError = useGalleryStore((state) => state.error);
  
  const componentsData = extractGalleryComponents(gallery);
  
  const sections = React.useMemo(
    () => [
      {
        title: "Teams",
        type: "team" as ComponentTypes,
        items: componentsData.teams || [],
        icon: <Users className="w-4 h-4" />,
        isTeamSection: true
      },
      {
        title: "Agents",
        type: "agent" as ComponentTypes,
        items: componentsData.agents?.map((agent: any) => ({
          label: agent.label || agent.config?.name || "Agent",
          config: agent,
        })) || [],
        icon: <Bot className="w-4 h-4" />,
      },
      {
        title: "Models",
        type: "model" as ComponentTypes,
        items: componentsData.models?.map((model: any) => ({
          label: model.label || model.config?.model || "Model",
          config: model,
        })) || [],
        icon: <Brain className="w-4 h-4" />,
      },
      {
        title: "Tools",
        type: "tool" as ComponentTypes,
        items: componentsData.tools?.map((tool: any) => ({
          label: tool.label || tool.config?.name || "Tool",
          config: tool,
        })) || [],
        icon: <Wrench className="w-4 h-4" />,
      },
      {
        title: "Terminations",
        type: "termination" as ComponentTypes,
        items: componentsData.terminations?.map(
          (termination: any) => ({
            label: termination.label || "Termination",
            config: termination,
          })
        ) || [],
        icon: <Timer className="w-4 h-4" />,
      },
    ],
    [componentsData]
  );

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="absolute group top-4 left-4 bg-white shadow-md rounded px-4 pr-2 py-2 cursor-pointer transition-all duration-300 z-50 flex items-center gap-2"
      >
        <span>Show Component Library</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 group-hover:bg-tertiary rounded transition-colors"
          title="Maximize Library"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (galleryLoading) {
    return (
      <Sider
        width={300}
        className="bg-white border-r border-gray-200 shadow-sm z-10 mr-2 h-full"
      >
        <div className="p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">Component Library</div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Minimize Library"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-60 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading components...</p>
          </div>
        </div>
      </Sider>
    );
  }

  const items: CollapseProps["items"] = sections.map((section) => {
    let filteredItems;
    
    if (section.isTeamSection) {
      return {
        key: section.title,
        label: (
          <div className="flex items-center gap-2 font-medium">
            {section.icon}
            <span>{section.title}</span>
            <span className="text-xs text-gray-500">
              ({componentsData.teams?.length || 0})
            </span>
          </div>
        ),
        children: (
          <div className="space-y-2">
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="w-full p-3 text-primary border rounded cursor-pointer bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Select a Team Template</span>
            </button>
          </div>
        ),
      };
    }
    
    filteredItems = section.items.filter((item) =>
      item.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      key: section.title,
      label: (
        <div className="flex items-center gap-2 font-medium">
          {section.icon}
          <span>{section.title}</span>
          <span className="text-xs text-gray-500">
            ({filteredItems.length})
          </span>
        </div>
      ),
      children: (
        <div className="component-library-section">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, itemIndex) => (
              <PresetItem
                key={itemIndex}
                id={`${section.title.toLowerCase()}-${itemIndex}`}
                type={section.type}
                config={item.config}
                label={item.label || ""}
                icon={section.icon}
              />
            ))
          ) : (
            <div className="py-2 text-sm text-gray-500 italic">
              No {section.title.toLowerCase()} found
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <>
      <Sider
        width={300}
        className="bg-white border-r border-gray-200 shadow-sm z-10 mr-2 h-full overflow-hidden flex flex-col"
      >
        <div className="component-library-header">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">Component Library</div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Minimize Library"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {galleryError && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-600 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Gallery couldn't be loaded</p>
                <p className="text-xs mt-1">Using default components instead</p>
              </div>
            </div>
          )}

          <div className="mb-4 text-gray-500 text-sm">
            Drag components to add them to the team or load a pre-built team template
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search components..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<span className="text-gray-400">🔍</span>}
            />
          </div>
        </div>

        <div className="component-library-body overflow-auto">
          <Collapse
            accordion
            items={items}
            defaultActiveKey={["Teams"]}
            bordered={false}
            expandIcon={({ isActive }) => (
              <ChevronDown
                strokeWidth={1}
                className={(isActive ? "transform rotate-180" : "") + " w-4 h-4"}
              />
            )}
          />
        </div>
      </Sider>

      <TeamSelectionModal 
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </>
  );
};

export default ComponentLibrary;
