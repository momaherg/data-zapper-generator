
import React from 'react';
import { Button } from '../../ui/button';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationError {
  path: string;
  message: string;
  field?: string;
  error?: string;
  suggestion?: string;
}

interface ValidationErrorsProps {
  errors: ValidationError[];
  onClick?: (path: string) => void;
}

export function ValidationErrors({ errors, onClick }: ValidationErrorsProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-4 mb-4">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
        <h3 className="text-red-800 dark:text-red-300 font-medium">Validation Errors</h3>
      </div>
      <ul className="space-y-2 ml-7">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-700 dark:text-red-300">
            <div className="flex items-start">
              <span className="flex-1">
                <span className="font-medium">{error.field || error.path}</span>:{' '}
                <span>{error.message || error.error}</span>
                {error.suggestion && (
                  <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                    Suggestion: {error.suggestion}
                  </div>
                )}
              </span>
              {onClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-red-700 dark:text-red-300 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => onClick(error.path)}
                >
                  Fix
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ValidationErrorsInline({ errors, onClick, className }: ValidationErrorsProps & { className?: string }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2 text-xs", className)}>
      <ul className="space-y-1.5">
        {errors.map((error, index) => (
          <li key={index} className="flex items-start text-red-700 dark:text-red-300">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="flex-1">
              <span className="font-medium">{error.field || error.path}</span>:{' '}
              <span>{error.message || error.error}</span>
              {error.suggestion && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Suggestion: {error.suggestion}
                </div>
              )}
            </span>
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-xs text-red-700 dark:text-red-300 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 ml-1"
                onClick={() => onClick(error.path)}
              >
                Fix
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
