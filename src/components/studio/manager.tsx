// src/components/studio/manager.tsx
// This file is responsible for managing the state of the team and handling API calls.

import React, { useState, useEffect } from 'react';
import { Team } from './datamodel';
import { teamAPI } from './api';

interface StudioManagerProps {
  children: (team: Team | null, setTeam: (team: Team) => void, loading: boolean) => React.ReactNode;
}

export const StudioManager: React.FC<StudioManagerProps> = ({ children }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleFetchTeam();
  }, []);

  const handleFetchTeam = async () => {
    try {
      setLoading(true);
      const data = await teamAPI.getTeam();
      setTeam({
        component: {
          provider: data.component?.provider || "roundrobin",
          component_type: "team",
          config: data.component?.config || {
            participants: [],
            termination_condition: null
          }
        }
      });
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTeam = async () => {
    try {
      if (!team) {
        console.warn("No team data to save.");
        return;
      }
      setLoading(true);
      // Prepare the data to be sent to the API
      const updatedData = {
        component: team.component,
      };
      await teamAPI.updateTeam(updatedData);
      // Optimistically update the local state with the saved data
      setTeam({
        component: {
          provider: updatedData.component?.provider || "roundrobin",
          component_type: "team",
          config: updatedData.component?.config || {
            participants: [],
            termination_condition: null
          }
        }
      });
    } catch (error) {
      console.error("Error saving team:", error);
    } finally {
      setLoading(false);
    }
  };

  return children(team, (updatedTeam: Team) => {
    setTeam(updatedTeam);
    handleSaveTeam();
  }, loading);
};
