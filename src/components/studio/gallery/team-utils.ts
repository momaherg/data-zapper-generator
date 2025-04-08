
import { Component, Gallery, TeamConfig } from "../datamodel";

/**
 * Extract team components from a gallery
 * @param gallery The gallery to extract teams from
 * @returns Array of team components
 */
export const extractTeamsFromGallery = (gallery: Gallery): Component<TeamConfig>[] => {
  // Handle both possible structures in the gallery
  if (gallery.components?.teams) {
    return gallery.components.teams;
  }
  
  if (gallery.config?.components?.teams) {
    return gallery.config.components.teams;
  }
  
  return [];
};
