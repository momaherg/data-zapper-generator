
import React, { useState, useEffect } from "react";
import { Card, Button, Popconfirm } from "antd";
import { Gallery } from "../../types/datamodel";
import { galleryAPI } from "./api";
import { toast } from "sonner";
import { useGalleryStore } from "./store";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

interface GalleryDetailProps {
  gallery: Gallery;
  onSave: (updates: Partial<Gallery>) => Promise<void>;
  onDirtyStateChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GalleryDetail: React.FC<GalleryDetailProps> = ({ 
  gallery, 
  onSave, 
  onDirtyStateChange 
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);

  const handleDelete = async () => {
    if (!gallery) return;
    
    try {
      await galleryAPI.deleteGallery(gallery.id.toString());
      toast.success("Gallery deleted successfully");
      fetchGalleries();
      navigate("/gallery");
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery");
    }
  };

  const handleUpdate = async (updatedGalleryConfig: any) => {
    try {
      // Create updated gallery object
      const updatedGallery: Gallery = {
        ...gallery,
        config: updatedGalleryConfig
      };
      
      await onSave(updatedGallery);
      setIsEditing(false);
      onDirtyStateChange(false);
    } catch (error) {
      console.error("Error updating gallery:", error);
      toast.error("Failed to update gallery");
    }
  };

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          type="text" 
          icon={<ArrowLeft className="h-4 w-4" />} 
          onClick={() => navigate("/gallery")}
        >
          Back to Galleries
        </Button>
        <div className="flex gap-2">
          <Button 
            type="primary" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Popconfirm
            title="Delete this gallery?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>

      <Card title={gallery.name} className="mb-4">
        <p className="text-gray-500">{gallery.description}</p>
        <p className="text-xs text-gray-400">
          Last updated: {new Date(gallery.updated_at || '').toLocaleString()}
        </p>
      </Card>

      {isEditing ? (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Edit Gallery Config</h3>
          <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
            {/* Add editor here if needed */}
            JSON Editor not implemented
          </pre>
          <Button type="primary" onClick={() => setIsEditing(false)} className="mt-4">
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Gallery Components</h3>
          <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(gallery.config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GalleryDetail;
