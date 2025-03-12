
import { Gallery, GalleryConfig } from "../datamodel";

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
