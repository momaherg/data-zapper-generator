
import React from "react";
import { MonacoEditor } from "./studio/builder/monaco";

export const useMonacoEditor = () => {
  const editorRef = React.useRef(null);
  return { editorRef };
};

export default MonacoEditor;
