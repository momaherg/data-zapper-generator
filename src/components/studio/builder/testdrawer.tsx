import React, { useState } from "react";
import { Drawer, Button, Input, Empty, message } from "antd";
import { Team } from "../datamodel";
import { Component, ComponentConfig } from "../datamodel";
import { appContext } from "../../../hooks/provider";
import { useContext } from "react";

interface TestDrawerProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

export const TestDrawer: React.FC<TestDrawerProps> = ({ open, onClose, team }) => {
  const { user } = useContext(appContext);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const handleTestRun = async () => {
    if (!team || !input.trim()) {
      message.error("Please enter some input to test");
      return;
    }

    setIsRunning(true);
    setMessages([]);

    try {
      // Simulate a test run with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add some mock messages
      setMessages([
        `Input: ${input}`,
        "Processing with team configuration...",
        "Agent 1: Analyzing input...",
        "Agent 2: Generating response...",
        "Test run completed successfully!"
      ]);

      message.success("Test completed successfully");
    } catch (error) {
      console.error("Test run error:", error);
      message.error("Failed to run test");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Drawer
      title="Test Team"
      placement="right"
      open={open}
      onClose={onClose}
      width={500}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button 
            type="primary"
            onClick={handleTestRun}
            loading={isRunning}
            disabled={!input.trim()}
          >
            Run Test
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Input.TextArea
            placeholder="Enter test input..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 rounded border border-gray-200"
                >
                  {msg}
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No test results yet" />
          )}
        </div>
      </div>
    </Drawer>
  );
};
