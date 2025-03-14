
import * as React from "react";
import { useState, useEffect } from "react";
import { TeamBuilder } from "../components/studio/builder/builder";
import { Loader2, Users } from "lucide-react";
import { Team } from "../components/studio/datamodel";
import { useGalleryStore } from "../components/studio/gallery/store";
import { teamAPI } from "../components/studio/api";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
// import { normalizeComponent } from "../components/studio/utils";

const StudioPage = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);
  const location = useLocation();

  useEffect(() => {
    // Get session_id from query parameters
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    
    if (sessionId) {
      // Set the session ID for the API
      teamAPI.setSessionId(sessionId);
    }
    
    fetchTeam();
    // Load galleries for the component library
    fetchGalleries();
  }, [fetchGalleries, location.search]);

  const fetchTeam = async () => {
    try {
      const data = await teamAPI.getTeam();
      // Normalize the component structure to match what our UI expects
      const normalizedTeam = {
        ...data,
        component: data
      };
      console.log("Normalized team:", normalizedTeam);
      setTeam(normalizedTeam);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team, using default configuration");
      
      // Create a default empty team with initial components if we couldn't fetch one
      setTeam({
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
  };

  const handleTeamUpdate = async (updatedTeam: Team) => {
    try {
      const data = await teamAPI.updateTeam(updatedTeam);
      setTeam(data);
      toast.success("Team saved successfully");
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to save team");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading Agents Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-full w-full p-4 bg-gray-50">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        <h1 className="text-xl font-semibold">Agents Studio</h1>
      </div>
      {team && <TeamBuilder team={team} onChange={handleTeamUpdate} />}
    </main>
  );
};

export default StudioPage;
