import { Gallery, GalleryConfig } from "../datamodel";
import defaultGalleryData from "./default_gallery.json";

export const defaultGallery: Gallery = {
  id: "default",
  name: "Default Gallery",
  description: "Default gallery with basic components",
  config: defaultGalleryData as GalleryConfig,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString();
};

export const validateGalleryConfig = (config: unknown): config is GalleryConfig => {
  if (!config || typeof config !== 'object') return false;
  const conf = config as Record<string, unknown>;
  
  // Basic validation
  return (
    typeof conf.id === 'string' &&
    typeof conf.name === 'string' &&
    typeof conf.metadata === 'object' &&
    typeof conf.components === 'object'
  );
};
