
import React from "react";
import { AgentConfig } from "../../../datamodel";
import { isAssistantAgent } from "../../../guards";
import { Component, ComponentConfig } from "../../../datamodel";

export function AgentFields({ 
  component 
}: { 
  component: Component<AgentConfig>
}) {
  if (isAssistantAgent(component)) {
    // Access AssistantAgent specific fields
    const { system_message, temperature } = component.config;
    return (
      <div>
        {/* Show AssistantAgent specific fields */}
        <label>System Message</label>
        <input value={system_message || ""} readOnly />
        <label>Temperature</label>
        <input value={temperature || 0} readOnly />
      </div>
    );
  }

  // For other agent types
  return <div>Basic agent configuration</div>;
}
