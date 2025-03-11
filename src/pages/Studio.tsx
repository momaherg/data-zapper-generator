
import * as React from "react";
import { useState, useEffect } from "react";
import { TeamBuilder } from "../components/studio/builder/builder";
import { Loader2, Users } from "lucide-react";
import { Team } from "../components/studio/datamodel";
import { useGalleryStore } from "../components/studio/gallery/store";
import { teamAPI } from "../components/studio/api";
import { toast } from "sonner";

const StudioPage = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchGalleries = useGalleryStore((state) => state.fetchGalleries);

  useEffect(() => {
    fetchTeam();
    // Load galleries for the component library
    fetchGalleries();
  }, [fetchGalleries]);

  const fetchTeam = async () => {
    try {
      const data = await teamAPI.getTeam();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team, using default configuration");
      
      // Create a default empty team with initial components if we couldn't fetch one
      setTeam({
        component: {
          provider: "selector",
          component_type: "team",
          config: {
            participants: [
              {
                provider: "anthropic",
                component_type: "agent",
                config: {
                  name: "Research Agent",
                  // Use proper fields recognized by AgentConfig
                  description: "You are a helpful research assistant."
                }
              },
              {
                provider: "openai",
                component_type: "agent",
                config: {
                  name: "Writing Agent",
                  // Use proper fields recognized by AgentConfig
                  description: "You are a creative writing assistant."
                }
              }
            ],
            model_client: {
              provider: "openai",
              component_type: "model",
              config: {
                model: "gpt-4"
              }
            },
            selector_prompt: "Select the next agent to speak",
            allow_repeated_speaker: false
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
