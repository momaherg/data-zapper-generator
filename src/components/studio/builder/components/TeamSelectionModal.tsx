
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, PlayCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGalleryStore } from "../../gallery/store";
import { useTeamBuilderStore } from "../store";
import { teamAPI } from "../../api";
import { Team } from "../../datamodel";

interface TeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  
  const gallery = useGalleryStore((state) => state.getSelectedGallery());
  const galleryLoading = useGalleryStore((state) => state.isLoading);
  const isDirty = useTeamBuilderStore(state => state.isDirty());
  const teams = gallery?.components?.teams || [];
  
  // Filter teams based on search term
  const filteredTeams = teams.filter((team: any) => 
    (team.label || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadTeam = (team: any) => {
    if (isDirty) {
      // Show confirmation dialog if there are unsaved changes
      setSelectedTeam(team);
      setConfirmModalVisible(true);
    } else {
      // Directly load the team if no unsaved changes
      loadTeamToBuilder(team);
    }
  };

  const loadTeamToBuilder = async (team: any) => {
    try {
      // Reset confirmation modal
      setConfirmModalVisible(false);
      setSelectedTeam(null);
      
      // Show loading toast
      setIsLoading(true);
      
      // Update the team
      await teamAPI.updateTeam(team);
      
      // Show success toast and close modal
      toast.success("Team template loaded successfully!");
      onClose();
      
      // Refresh the page to update the builder
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error loading team:", error);
      toast.error("Failed to load team template");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCurrentTeam = async () => {
    try {
      setIsLoading(true);
      toast.loading("Resetting team...");
      
      // Get the default empty team
      const defaultTeam = {
        component: {
          provider: "roundrobin",
          component_type: "team",
          config: {
            participants: [],
            termination_condition: {
              provider: "maxmessage",
              component_type: "termination",
              config: {
                max_messages: 10
              }
            }
          }
        }
      };
      
      // Update with the default team
      await teamAPI.updateTeam(defaultTeam);
      
      toast.success("Team reset successfully!");
      onClose();
      
      // Refresh the page to update the builder
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error resetting team:", error);
      toast.error("Failed to reset team");
    } finally {
      setIsLoading(false);
    }
  };

  if (galleryLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading Teams</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading available teams...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Team Templates</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetCurrentTeam}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset Team
              </Button>
            </DialogTitle>
            <DialogDescription>
              Load a pre-configured team template or reset the current team to start fresh
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-4 relative">
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {filteredTeams.length > 0 ? (
            <div className="space-y-3">
              {filteredTeams.map((team: any, index: number) => (
                <div key={index} className="border p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{team.label || "Unnamed Team"}</h3>
                      {team.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {team.description.length > 120 
                            ? team.description.substring(0, 120) + "..." 
                            : team.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadTeam(team)}
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Load
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {searchTerm ? "No teams matching your search" : "No teams available"}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalVisible} onOpenChange={() => setConfirmModalVisible(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Replace Current Team?</DialogTitle>
            <DialogDescription>
              Loading "{selectedTeam?.label || 'this team'}" will replace your current team configuration. 
              Unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmModalVisible(false)}>
              Cancel
            </Button>
            <Button onClick={() => loadTeamToBuilder(selectedTeam)}>
              Load Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamSelectionModal;
