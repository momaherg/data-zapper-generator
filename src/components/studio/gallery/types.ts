
import { Component, ComponentConfig } from "../datamodel";

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
  metadata?: Record<string, any>;
  url?: string;
}
