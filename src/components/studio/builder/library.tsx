import React from "react";
import { Input, Collapse, type CollapseProps } from "antd";
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
} from "lucide-react";
import Sider from "antd/es/layout/Sider";
import { useGalleryStore } from "../gallery/store";
import { ComponentTypes } from "../datamodel";

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

export const ComponentLibrary: React.FC<LibraryProps> = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isMinimized, setIsMinimized] = React.useState(false);
  const defaultGallery = useGalleryStore((state) => state.getSelectedGallery());
  const galleryLoading = useGalleryStore((state) => state.isLoading);

  console.log("Gallery data:", defaultGallery); // Debug - to check if gallery data is loaded

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

  // Loading state
  if (galleryLoading || !defaultGallery) {
    return (
      <Sider
        width={300}
        className="bg-white border-r border-gray-200 shadow-sm z-10 mr-2"
      >
        <div className="p-4">
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

  // Map gallery components to sections format
  const sections = React.useMemo(
    () => [
      {
        title: "Agents",
        type: "agent" as ComponentTypes,
        items: defaultGallery.config.components.agents.map((agent) => ({
          label: agent.label,
          config: agent,
        })),
        icon: <Bot className="w-4 h-4" />,
      },
      {
        title: "Models",
        type: "model" as ComponentTypes,
        items: defaultGallery.config.components.models.map((model) => ({
          label: `${model.label || model.config.model}`,
          config: model,
        })),
        icon: <Brain className="w-4 h-4" />,
      },
      {
        title: "Tools",
        type: "tool" as ComponentTypes,
        items: defaultGallery.config.components.tools.map((tool) => ({
          label: tool.config.name,
          config: tool,
        })),
        icon: <Wrench className="w-4 h-4" />,
      },
      {
        title: "Terminations",
        type: "termination" as ComponentTypes,
        items: defaultGallery.config.components.terminations.map(
          (termination) => ({
            label: `${termination.label}`,
            config: termination,
          })
        ),
        icon: <Timer className="w-4 h-4" />,
      },
    ],
    [defaultGallery]
  );

  const items: CollapseProps["items"] = sections.map((section) => {
    const filteredItems = section.items.filter((item) =>
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
        <div className="space-y-2">
          {filteredItems.map((item, itemIndex) => (
            <PresetItem
              key={itemIndex}
              id={`${section.title.toLowerCase()}-${itemIndex}`}
              type={section.type}
              config={item.config}
              label={item.label || ""}
              icon={section.icon}
            />
          ))}
        </div>
      ),
    };
  });

  return (
    <Sider
      width={300}
      className="bg-white border-r border-gray-200 shadow-sm z-10 mr-2"
    >
      <div className="p-4">
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

        <div className="mb-4 text-gray-500 text-sm">
          Drag a component to add it to the team
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search components..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<span className="text-gray-400">🔍</span>}
          />
        </div>

        <Collapse
          accordion
          items={items}
          defaultActiveKey={["Agents"]}
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
  );
};

export default ComponentLibrary;
