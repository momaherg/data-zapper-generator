
import React, { useState } from "react";
import { Button, Input, Modal } from "antd";
import { Plus, X } from "lucide-react";
import { Gallery, GalleryConfig } from "./types";

const { TextArea } = Input;

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGallery: (gallery: Gallery) => Promise<void>;
}

export const CreateGalleryModal: React.FC<CreateGalleryModalProps> = ({
  isOpen,
  onClose,
  onCreateGallery,
}) => {
  const [galleryName, setGalleryName] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateGallery = async () => {
    if (!galleryName.trim()) return;

    try {
      setIsSubmitting(true);
      
      const newGallery: Gallery = {
        id: `gallery-${Date.now()}`,
        name: galleryName.trim(),
        description: galleryDescription.trim() || undefined,
        config: {
          id: `gallery-${Date.now()}`,
          name: galleryName.trim(),
          description: galleryDescription.trim() || undefined,
          components: {
            teams: [],
            agents: [],
            models: [],
            tools: [],
            terminations: []
          }
        }
      };
      
      await onCreateGallery(newGallery);
      setGalleryName("");
      setGalleryDescription("");
      onClose();
    } catch (error) {
      console.error("Error creating gallery:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setGalleryName("");
    setGalleryDescription("");
    onClose();
  };

  return (
    <Modal
      title="Create New Gallery"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <div className="space-y-4 py-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
            placeholder="Enter gallery name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <TextArea
            value={galleryDescription}
            onChange={(e) => setGalleryDescription(e.target.value)}
            placeholder="Enter gallery description"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleCreateGallery}
            loading={isSubmitting}
            disabled={!galleryName.trim()}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGalleryModal;
