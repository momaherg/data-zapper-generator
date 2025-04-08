
import { Component, ComponentConfig } from "../datamodel";

export interface GalleryMetadata {
  author?: string;
  created_at?: string;
  updated_at?: string;
  version?: string;
  [key: string]: any;
}

export interface GalleryConfig {
  id: string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  components?: {
    teams?: Component<any>[];
    agents?: Component<any>[];
    models?: Component<any>[];
    tools?: Component<any>[];
    terminations?: Component<any>[];
  };
  url?: string;
}

export interface Gallery {
  id: string;
  name: string;
  description?: string;
  config?: GalleryConfig;
  components?: {
    teams?: Component<any>[];
    agents?: Component<any>[];
    models?: Component<any>[];
    tools?: Component<any>[];
    terminations?: Component<any>[];
  };
  metadata?: GalleryMetadata;
  url?: string;
}
