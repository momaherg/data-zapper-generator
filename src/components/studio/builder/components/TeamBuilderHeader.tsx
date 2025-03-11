
import React from "react";
import { Button, Tooltip, Switch, message } from "antd";
import {
  Cable,
  CheckCircle,
  CircleX,
  Code2,
  Download,
  ListCheck,
  PlayCircle,
  Save,
} from "lucide-react";
import { ValidationResponse } from "../../api";
import { ValidationErrors } from "../validationerrors";
import { Component, Team } from "../../datamodel";

interface TeamBuilderHeaderProps {
  isJsonMode: boolean;
  setIsJsonMode: (isJson: boolean) => void;
  validationResults: ValidationResponse | null;
  validationLoading: boolean;
  isDirty: boolean;
  onValidate: () => void;
  onSave: () => void;
  onExport: () => void;
  onTestRun: () => void;
  syncToJson: () => Component<any> | null;
}

export const TeamBuilderHeader: React.FC<TeamBuilderHeaderProps> = ({
  isJsonMode,
  setIsJsonMode,
  validationResults,
  validationLoading,
  isDirty,
  onValidate,
  onSave,
  onExport,
  onTestRun,
  syncToJson,
}) => {
  const teamValidated = validationResults && validationResults.is_valid;

  return (
    <div className="flex gap-2 text-xs rounded border-dashed border p-2 mb-4 items-center bg-white shadow-sm">
      <div className="flex-1">
        <Switch
          onChange={() => {
            setIsJsonMode(!isJsonMode);
          }}
          className="mr-2"
          defaultChecked={!isJsonMode}
          checkedChildren={
            <div className="text-xs">
              <Cable className="w-3 h-3 inline-block mr-1" />
            </div>
          }
          unCheckedChildren={
            <div className="text-xs">
              <Code2 className="w-3 h-3 inline-block mr-1" />
            </div>
          }
        />
        {isJsonMode ? "JSON Editor" : "Visual Builder"}
      </div>

      <div>
        {validationResults && !validationResults.is_valid && (
          <div className="inline-block mr-2">
            <ValidationErrors validation={validationResults} />
          </div>
        )}
        <Tooltip title="Download Team">
          <Button
            type="text"
            icon={<Download size={18} />}
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={onExport}
          />
        </Tooltip>

        <Tooltip title="Save Changes">
          <Button
            type="text"
            icon={
              <div className="relative">
                <Save size={18} />
                {isDirty && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            }
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
          />
        </Tooltip>

        <Tooltip
          title={
            <div>
              Validate Team
              {validationResults && (
                <div className="text-xs text-center my-1">
                  {teamValidated ? (
                    <span>
                      <CheckCircle className="w-3 h-3 text-green-500 inline-block mr-1" />
                      Success
                    </span>
                  ) : (
                    <div>
                      <CircleX className="w-3 h-3 text-red-500 inline-block mr-1" />
                      Errors
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        >
          <Button
            type="text"
            loading={validationLoading}
            icon={
              <div className="relative">
                <ListCheck size={18} />
                {validationResults && (
                  <div
                    className={`${
                      teamValidated ? "bg-green-500" : "bg-red-500"
                    } absolute top-0 right-0 w-2 h-2 rounded-full`}
                  ></div>
                )}
              </div>
            }
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onValidate}
          />
        </Tooltip>

        <Tooltip title="Run Team">
          <Button
            type="primary"
            icon={<PlayCircle size={18} />}
            className="p-1.5 ml-2 px-3 hover:bg-blue-600 rounded-md bg-blue-500 text-white"
            onClick={onTestRun}
          >
            Run
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
