
import React from "react";
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  minimap?: boolean;
  editorRef?: React.MutableRefObject<any>;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = "json",
  minimap = true,
  editorRef
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={handleEditorChange}
      options={{
        minimap: {
          enabled: minimap,
        },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        tabSize: 2,
      }}
      onMount={(editor) => {
        if (editorRef) {
          editorRef.current = editor;
        }
      }}
    />
  );
};

export default MonacoEditor;
