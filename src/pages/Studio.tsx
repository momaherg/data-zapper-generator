
import * as React from "react";
import { useState, useEffect } from "react";
import { TeamBuilder } from "../components/studio/builder/builder";
import { Loader2 } from "lucide-react";
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
      toast.error("Failed to load team");
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="h-full w-full p-4">
      <TeamBuilder team={team} onChange={handleTeamUpdate} />
    </main>
  );
};

export default StudioPage;
