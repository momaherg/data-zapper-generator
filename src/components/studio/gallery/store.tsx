
import { create } from "zustand";
import { Gallery } from "../datamodel";
import { galleryAPI } from "./api";

interface GalleryState {
  galleries: Gallery[];
  selectedGallery: Gallery | null;
  isLoading: boolean;
  error: string | null;

  fetchGalleries: () => Promise<void>;
  selectGallery: (gallery: Gallery) => void;
  getSelectedGallery: () => Gallery | null;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  galleries: [],
  selectedGallery: null,
  isLoading: false,
  error: null,

  fetchGalleries: async () => {
    try {
      set({ isLoading: true, error: null });
      const galleries = await galleryAPI.listGalleries();
      
      if (galleries && Array.isArray(galleries)) {
        set({
          galleries,
          selectedGallery: galleries.length > 0 ? galleries[0] : null,
          isLoading: false,
        });
        console.log("Loaded galleries:", galleries);
      } else {
        console.error("Received invalid galleries data:", galleries);
        set({
          error: "Invalid gallery data received",
          isLoading: false,
          galleries: [],
          selectedGallery: null,
        });
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch galleries",
        isLoading: false,
        galleries: [],
        selectedGallery: null,
      });
    }
  },

  selectGallery: (gallery: Gallery) => {
    set({ selectedGallery: gallery });
  },

  getSelectedGallery: () => {
    return get().selectedGallery;
  },
}));
