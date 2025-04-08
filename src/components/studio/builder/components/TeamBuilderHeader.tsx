import React, { useState } from "react";
import { Button, Tooltip, message } from "antd";
import { Info, Code, Layout, Check, X, Play, Save, Book, BookTemplate } from "lucide-react";
import { ValidationResponse } from "../../api";

interface TeamBuilderHeaderProps {
  isJsonMode: boolean;
  setIsJsonMode: (isJsonMode: boolean) => void;
  validationResults: ValidationResponse | null;
  validationLoading: boolean;
  isDirty: boolean;
  onValidate: () => void;
  onSave: () => void;
  onExport: () => void;
  onTestRun: () => void;
  syncToJson: () => any;
}

export const TeamBuilderHeader: React.FC<TeamBuilderHeaderProps> = ({
  isJsonMode,
  setIsJsonMode,
  validationResults,
  validationLoading,
  isDirty,
  onValidate,
  onSave,
  onExport,
  onTestRun,
  syncToJson,
}) => {
  const [teamSelectorOpen, setTeamSelectorOpen] = useState(false);

  const handleCopy = () => {
    try {
      const json = JSON.stringify(syncToJson(), null, 2);
      navigator.clipboard.writeText(json);
      message.success("Copied to clipboard!");
    } catch (error) {
      message.error("Failed to copy to clipboard");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Tooltip title="Toggle JSON View">
          <Button
            type="text"
            icon={<Code className="h-4 w-4" />}
            onClick={() => setIsJsonMode(!isJsonMode)}
          >
            {isJsonMode ? "Visual Editor" : "JSON Editor"}
          </Button>
        </Tooltip>

        <Tooltip title="Toggle Layout">
          <Button type="text" icon={<Layout className="h-4 w-4" />}>
            Auto Layout
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        {validationResults && (
          <Tooltip
            title={
              validationResults.valid
                ? "No validation issues"
                : "Validation issues found"
            }
          >
            <span className="flex items-center gap-1">
              {validationLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : validationResults.valid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {validationLoading
                  ? "Validating..."
                  : validationResults.valid
                  ? "Valid"
                  : "Invalid"}
              </span>
            </span>
          </Tooltip>
        )}

        <Button
          type="default"
          icon={<BookTemplate className="h-4 w-4" />}
          onClick={() => setTeamSelectorOpen(true)}
        >
          Load Template
        </Button>

        <Button type="text" icon={<Play className="h-4 w-4" />} onClick={onTestRun}>
          Test Run
        </Button>

        <Button type="text" icon={<Save className="h-4 w-4" />} onClick={onSave} disabled={!isDirty}>
          Save
        </Button>

        <Button type="text" icon={<Book className="h-4 w-4" />} onClick={onExport}>
          Export
        </Button>

        <Button type="text" icon={<Info className="h-4 w-4" />} onClick={handleCopy}>
          Copy
        </Button>
      </div>
    </header>
  );
};

const Loader = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 18C8.686 18 6 15.314 6 12C6 8.686 8.686 6 12 6C15.314 6 18 8.686 18 12C18 15.314 15.314 18 12 18Z"
      fill="currentColor"
    />
    <path
      d="M2 12C2 6.477 6.477 2 12 2V6C8.686 6 6 8.686 6 12H2Z"
      fill="currentColor"
    />
  </svg>
);

export default TeamBuilderHeader;
