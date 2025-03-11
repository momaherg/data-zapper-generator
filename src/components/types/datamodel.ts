
export interface Gallery {
  id: string;
  name: string;
  description?: string;
  items?: GalleryItem[];
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  description?: string;
  type: string;
  data?: any;
  gallery_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryConfig {
  name: string;
  description?: string;
  items?: GalleryItem[];
}
