
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { TeamBuilder } from "../components/studio/builder/builder";
import { Loader2, Users } from "lucide-react";
import { Team } from "../components/studio/datamodel";
import { useGalleryStore } from "../components/studio/gallery/store";
import { teamAPI, validationAPI } from "../components/studio/api";
import { galleryAPI } from "../components/studio/gallery/api";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const StudioPage = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);
  const location = useLocation();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Skip if we've already initialized once to prevent double fetching
    if (initializationRef.current) return;
    
    initializationRef.current = true;
    
    // Get session_id from query parameters
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    
    if (sessionId) {
      // Set the session ID for the API
      teamAPI.setSessionId(sessionId);
      validationAPI.setSessionId(sessionId);
      galleryAPI.setSessionId(sessionId);
    }
    
    fetchTeam();
    // Load galleries for the component library
    fetchGalleries().catch(error => {
      console.error("Error fetching galleries:", error);
      toast.error("Failed to load component library");
    });
  }, [fetchGalleries, location.search]);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const data = await teamAPI.getTeam();
      // Normalize the component structure to match what our UI expects
      const normalizedTeam = {
        ...data,
        component: data
      };
      
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log("Normalized team:", normalizedTeam);
      }
      
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

  const handleTeamUpdate = async (updatedTeam: Partial<Team>) => {
    try {
      // Update locally immediately for a responsive UI
      if (team) {
        // Create a copy to avoid modifying state directly
        const updatedFullTeam = {
          ...team,
          component: updatedTeam.component || team.component
        };
        setTeam(updatedFullTeam as Team);
      }
      
      // Send to server
      const data = await teamAPI.updateTeam(updatedTeam);
      toast.success("Team saved successfully");
      
      // No need to refresh the page - we already updated the state above
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to save team");
      // Refresh the team if the update fails to ensure consistency
      fetchTeam();
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
