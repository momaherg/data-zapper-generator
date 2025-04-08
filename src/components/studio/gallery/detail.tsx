import React, { useState, useEffect } from "react";
import { Card, Button, Popconfirm } from "antd";
import ComponentEditor from "../builder/component-editor/component-editor";
import { Gallery } from "../datamodel";
import { galleryAPI } from "./api";
import { toast } from "sonner";
import { useGalleryStore } from "./store";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export const GalleryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);

  useEffect(() => {
    if (id) {
      fetchGallery(id);
    }
  }, [id]);

  const fetchGallery = async (galleryId: string) => {
    try {
      setIsLoading(true);
      const data = await galleryAPI.getGallery(galleryId);
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!gallery) return;
    
    try {
      await galleryAPI.deleteGallery(gallery.id);
      toast.success("Gallery deleted successfully");
      fetchGalleries();
      navigate("/gallery");
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery");
    }
  };

  const handleUpdate = async (updatedGallery: Gallery) => {
    try {
      const data = await galleryAPI.updateGallery(updatedGallery);
      setGallery(data);
      setIsEditing(false);
      toast.success("Gallery updated successfully");
      fetchGalleries();
    } catch (error) {
      console.error("Error updating gallery:", error);
      toast.error("Failed to update gallery");
    }
  };

  if (isLoading) {
    return <div>Loading gallery...</div>;
  }

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
          Last updated: {new Date(gallery.updated_at).toLocaleString()}
        </p>
      </Card>

      {isEditing ? (
        <ComponentEditor
          component={gallery.config}
          onChange={(updatedConfig) => {
            handleUpdate({
              ...gallery,
              config: updatedConfig,
            });
          }}
          onClose={() => setIsEditing(false)}
        />
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
