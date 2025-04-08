
import React from "react";
import { ExclamationTriangle, AlertTriangle } from "lucide-react";

interface ValidationErrorProps {
  validationResults: {
    valid: boolean;
    is_valid?: boolean;
    errors?: Array<{
      path: string;
      message: string;
    }>;
    warnings?: Array<{
      path: string;
      message: string;
    }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to extract parts from the message
const extractMessageParts = (message: string) => {
  // Default parts
  const parts = {
    field: '',
    error: message,
    suggestion: ''
  };
  
  // Try to extract structured parts if message is formatted as "field: error. suggestion"
  const fieldMatch = message.match(/^([^:]+):\s*(.*?)(?:\.\s*(.*))?$/);
  if (fieldMatch) {
    parts.field = fieldMatch[1]?.trim() || '';
    parts.error = fieldMatch[2]?.trim() || message;
    parts.suggestion = fieldMatch[3]?.trim() || '';
  }
  
  return parts;
};

export const ValidationErrors: React.FC<ValidationErrorProps> = ({
  validationResults,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !validationResults) return null;

  const { errors = [], warnings = [] } = validationResults;
  const hasIssues = (errors && errors.length > 0) || (warnings && warnings.length > 0);

  if (!hasIssues) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-600">Validation Successful</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p className="text-gray-700 mb-4">No validation errors or warnings found. Your team configuration is valid!</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Validation Issues</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-red-600 flex items-center">
              <ExclamationTriangle className="h-5 w-5 mr-2" />
              Errors
            </h3>
            <ul className="space-y-3">
              {errors.map((error, index) => {
                const { field, error: errorText, suggestion } = extractMessageParts(error.message);
                return (
                  <li key={index} className="bg-red-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <ExclamationTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        {field && <p className="font-medium text-red-800">{field}</p>}
                        <p className="text-red-700">{errorText}</p>
                        {suggestion && (
                          <p className="text-gray-600 text-sm mt-1">Suggestion: {suggestion}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Path: {error.path}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-yellow-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Warnings
            </h3>
            <ul className="space-y-3">
              {warnings.map((warning, index) => {
                const { field, error: warningText, suggestion } = extractMessageParts(warning.message);
                return (
                  <li key={index} className="bg-yellow-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        {field && <p className="font-medium text-yellow-800">{field}</p>}
                        <p className="text-yellow-700">{warningText}</p>
                        {suggestion && (
                          <p className="text-gray-600 text-sm mt-1">Suggestion: {suggestion}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Path: {warning.path}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrors;
