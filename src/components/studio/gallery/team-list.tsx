
import React from "react";
import { Button, Card, Tooltip } from "antd";
import { Plus, Info } from "lucide-react";
import { Component, Gallery, TeamConfig } from "../datamodel";
import { extractTeamsFromGallery } from "./team-utils";

interface TeamListProps {
  galleries: Gallery[];
  onSelectTeam: (team: Component<TeamConfig>) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ galleries, onSelectTeam }) => {
  // Collect all teams from all galleries
  const allTeams = React.useMemo(() => {
    const teams: Component<TeamConfig>[] = [];
    
    galleries.forEach(gallery => {
      const galleryTeams = extractTeamsFromGallery(gallery);
      teams.push(...galleryTeams);
    });
    
    return teams;
  }, [galleries]);

  if (allTeams.length === 0) {
    return (
      <Card className="bg-gray-50 border border-dashed border-gray-300 p-4 text-center">
        <p className="text-gray-500">No team templates available in the gallery</p>
      </Card>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allTeams.map((team, index) => (
        <Card 
          key={index}
          title={
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{team.label || "Unnamed Team"}</span>
              <Tooltip title={team.description || "No description available"}>
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          }
          size="small"
          className="hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-gray-500 mb-3">
            {team.description?.slice(0, 80) || "No description"}
            {team.description && team.description.length > 80 ? "..." : ""}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Type: {team.provider?.split(".").pop() || "Unknown"}
            </div>
            <Button 
              type="primary" 
              size="small" 
              icon={<Plus className="h-3 w-3" />}
              onClick={() => onSelectTeam(team)}
            >
              Use
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
