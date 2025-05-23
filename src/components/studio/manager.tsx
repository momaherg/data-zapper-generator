import React, { useCallback, useEffect, useState, useContext } from "react";
import { message, Modal } from "antd";
import { ChevronRight } from "lucide-react";
import { appContext } from "../../hooks/provider";
import { teamAPI } from "./api";
import { useGalleryStore } from "./gallery/store";
// import { TeamSidebar } from "./sidebar";
import type { Team, Component, TeamConfig } from "./datamodel";
import { TeamBuilder } from "./builder/builder";

export const TeamManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("teamSidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  const { user } = useContext(appContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize galleries
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);
  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("teamSidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await teamAPI.getTeam();
      
      // Create a proper Team object with the expected structure
      setCurrentTeam({
        ...data,
        component: {
          provider: data.provider || "roundrobin",
          component_type: "team",
          config: data.config || {
            participants: [],
            termination_condition: null
          }
        }
      });
    } catch (error) {
      console.error("Error fetching team:", error);
      messageApi.error("Failed to load team, using default configuration");
      
      // Create a default empty team with initial components
      setCurrentTeam({
        component: {
          provider: "roundrobin",
          component_type: "team",
          config: {
            participants: [
              {
                provider: "assistant",
                component_type: "agent",
                config: {
                  name: "Research Agent",
                  description: "You are a helpful research assistant."
                }
              },
              {
                provider: "assistant",
                component_type: "agent",
                config: {
                  name: "Writing Agent",
                  description: "You are a creative writing assistant."
                }
              }
            ],
            termination_condition: {
              provider: "maxmessage",
              component_type: "termination",
              config: {
                max_messages: 10
              }
            }
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamId = params.get("teamId");

    if (teamId && !currentTeam) {
      const numTeamId = parseInt(teamId);
      if (!isNaN(numTeamId)) {
        handleSelectTeam({ id: numTeamId } as Team);
      }
    }
  }, []);

  const handleSelectTeam = async (selectedTeam: Team) => {
    if (!selectedTeam.id) return;

    if (hasUnsavedChanges) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved changes. Do you want to discard them?",
        okText: "Discard",
        cancelText: "Go Back",
        onOk: () => {
          switchToTeam(selectedTeam.id);
        },
      });
    } else {
      await switchToTeam(selectedTeam.id);
    }
  };

  const switchToTeam = async (teamId: number | undefined) => {
    if (!teamId) return;
    setIsLoading(true);
    try {
      const data = await teamAPI.getTeam();
      
      // Create a proper Team object with the expected structure
      setCurrentTeam({
        ...data,
        component: {
          provider: data.provider || "roundrobin",
          component_type: "team",
          config: data.config || {
            participants: [],
            termination_condition: null
          }
        }
      });
      
      window.history.pushState({}, "", `?teamId=${teamId}`);
    } catch (error) {
      console.error("Error loading team:", error);
      messageApi.error("Failed to load team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await teamAPI.deleteTeam(teamId);
      setTeams(teams.filter((t) => t.id !== teamId));
      if (currentTeam?.id === teamId) {
        setCurrentTeam(null);
      }
      messageApi.success("Team deleted");
    } catch (error) {
      console.error("Error deleting team:", error);
      messageApi.error("Error deleting team");
    }
  };

  const handleCreateTeam = (newTeam: Team) => {
    setCurrentTeam(newTeam);
    handleSaveTeam(newTeam);
  };

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    try {
      const sanitizedTeamData = {
        ...teamData,
        created_at: undefined,
        updated_at: undefined,
      };

      const savedTeam = await teamAPI.updateTeam(sanitizedTeamData);
      messageApi.success(
        `Team ${teamData.id ? "updated" : "created"} successfully`
      );

      if (teamData.id) {
        setTeams(teams.map((t) => (t.id === savedTeam.id ? savedTeam : t)));
        if (currentTeam?.id === savedTeam.id) {
          setCurrentTeam(savedTeam);
        }
      } else {
        setTeams([savedTeam, ...teams]);
        setCurrentTeam(savedTeam);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="relative flex h-full w-full">
      {contextHolder}
      {/* Sidebar */}
      {/* <div
        className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-12"
        }`}
      >
        <TeamSidebar
          isOpen={isSidebarOpen}
          teams={teams}
          currentTeam={currentTeam}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectTeam={handleSelectTeam}
          onCreateTeam={handleCreateTeam}
          onEditTeam={setCurrentTeam}
          onDeleteTeam={handleDeleteTeam}
          isLoading={isLoading}
        />
      </div> */}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all -mr-6 duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-12"
        }`}
      >
        <div className="p-4 pt-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-primary font-medium">Teams</span>
            {currentTeam && (
              <>
                <ChevronRight className="w-4 h-4 text-secondary" />
                <span className="text-secondary">
                  {currentTeam.component?.label}
                  {currentTeam.id ? (
                    ""
                  ) : (
                    <span className="text-xs text-orange-500"> (New)</span>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Content Area */}
          {currentTeam ? (
            <TeamBuilder
              team={currentTeam}
              onChange={handleSaveTeam}
              onDirtyStateChange={setHasUnsavedChanges}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-190px)] text-secondary">
              Select a team from the sidebar or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManager;
