
import { Gallery, GalleryConfig } from "../datamodel";
import defaultGalleryData from "./default_gallery.json";

export const defaultGallery: Gallery = {
  id: "default",
  name: "Default Gallery",
  description: "Default gallery with basic components",
  config: defaultGalleryData as unknown as GalleryConfig,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
