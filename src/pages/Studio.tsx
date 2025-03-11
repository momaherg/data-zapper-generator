
import * as React from "react";
import { useState, useEffect } from "react";
import { TeamBuilder } from "../components/studio/builder/builder";
import { Loader2 } from "lucide-react";
import { Team } from "../components/studio/datamodel";

const StudioPage = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch("http://localhost:5000/team");
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamUpdate = async (updatedTeam: Team) => {
    try {
      const response = await fetch("http://localhost:5000/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTeam),
      });
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Error updating team:", error);
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
