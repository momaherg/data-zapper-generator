
import React from "react";
import { Modal, Tabs } from "antd";
import { Component, Gallery, TeamConfig } from "./datamodel";
import { TeamList } from "./gallery/team-list";

interface TeamSelectorModalProps {
  galleries: Gallery[];
  open: boolean;
  onClose: () => void;
  onSelectTeam: (team: Component<TeamConfig>) => void;
}

export const TeamSelectorModal: React.FC<TeamSelectorModalProps> = ({
  galleries,
  open,
  onClose,
  onSelectTeam,
}) => {
  return (
    <Modal
      title="Select a Team Template"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <p className="text-gray-500 mb-4">
        Select a team template from the gallery to load into the builder.
        This will replace your current team configuration.
      </p>
      
      <TeamList 
        galleries={galleries} 
        onSelectTeam={(team) => {
          onSelectTeam(team);
          onClose();
        }} 
      />
    </Modal>
  );
};
