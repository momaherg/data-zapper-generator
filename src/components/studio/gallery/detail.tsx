
import React, { useState, useCallback, useEffect } from "react";
import { Tabs, Button } from "antd";
import { Component, ComponentConfig } from "../datamodel";
import { Gallery, GalleryConfig } from "./types";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import MonacoEditor from "../builder/monaco";
import { 
  Code, ChevronLeft, Save, InfoIcon, 
  AlertCircle, CopyCheck, Check 
} from "lucide-react";

interface DetailProps {
  gallery: Gallery;
  onNavigateBack: () => void;
  onSave: (updates: Partial<Gallery>) => Promise<void>;
  onDirtyStateChange: (isDirty: boolean) => void;
}

export const GalleryDetail: React.FC<DetailProps> = ({
  gallery,
  onNavigateBack,
  onSave,
  onDirtyStateChange,
}) => {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [workingCopy, setWorkingCopy] = useState<Gallery>(gallery);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Reset working copy when gallery changes
  useEffect(() => {
    setWorkingCopy(gallery);
  }, [gallery]);

  // Check if the gallery has been modified
  const isDirty = useCallback(() => {
    return JSON.stringify(gallery) !== JSON.stringify(workingCopy);
  }, [gallery, workingCopy]);

  // Notify parent of dirty state changes
  useEffect(() => {
    onDirtyStateChange(isDirty());
  }, [isDirty, onDirtyStateChange]);

  const handleJsonChange = useCallback(
    debounce((value: string) => {
      try {
        const updatedGallery = JSON.parse(value);
        setWorkingCopy(updatedGallery);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }, 500),
    []
  );

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      setIsSaving(true);
      await onSave(workingCopy);
      setSaveStatus("success");
      
      // Reset success status after a delay
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error saving gallery:", error);
      setSaveStatus("error");
      toast.error("Failed to save gallery");
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "success":
        return "Saved";
      case "error":
        return "Retry Save";
      default:
        return "Save Changes";
    }
  };

  const getSaveIcon = () => {
    switch (saveStatus) {
      case "saving":
        return null;
      case "success":
        return <Check className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Save className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={onNavigateBack}
          />
          <h2 className="text-lg font-medium">{gallery.name}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="default"
            onClick={() => setIsJsonMode(!isJsonMode)}
            icon={<Code className="w-4 h-4" />}
            className="flex items-center gap-1"
          >
            {isJsonMode ? "Switch to Visual Mode" : "Edit JSON"}
          </Button>
          
          <Button
            type="primary"
            onClick={handleSave}
            disabled={isSaving || !isDirty()}
            icon={getSaveIcon()}
            className="flex items-center gap-1"
          >
            {getSaveButtonText()}
          </Button>
        </div>
      </div>
      
      {gallery.description && (
        <div className="mb-4 bg-blue-50 p-3 rounded-md flex items-start gap-2">
          <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">{gallery.description}</p>
        </div>
      )}
      
      {isJsonMode ? (
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            value={JSON.stringify(workingCopy, null, 2)}
            onChange={handleJsonChange}
            language="json"
            minimap={true}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <Tabs
            defaultActiveKey="components"
            items={[
              {
                key: "components",
                label: "Components",
                children: (
                  <div>
                    <p>Component editor goes here</p>
                  </div>
                ),
              },
              {
                key: "settings",
                label: "Gallery Settings",
                children: (
                  <div>
                    <p>Settings editor goes here</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryDetail;
