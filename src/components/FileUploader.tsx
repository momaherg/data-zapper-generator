
import React, { useState, useRef } from 'react';
import { Upload, X, FileArchive, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  errorMessage: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  isUploading,
  uploadProgress,
  errorMessage
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file is a ZIP
    if (!file.name.toLowerCase().endsWith('.zip')) {
      return;
    }
    
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <Card className={cn(
        "w-full border-2 border-dashed rounded-lg transition-all duration-200",
        dragActive ? "border-primary/70 bg-primary/5" : "border-border",
        isUploading && "opacity-70 pointer-events-none",
        "hover:border-primary/40 hover:bg-primary/5"
      )}>
        <div
          className="flex flex-col items-center justify-center p-8 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse-subtle">
                <Upload className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload ZIP file</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Drag and drop a ZIP file, or click to browse your files
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="relative overflow-hidden"
              >
                Browse Files
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between w-full max-w-md mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileArchive className="text-primary w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isUploading ? (
                <div className="w-full max-w-md">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <Button onClick={triggerUpload} className="min-w-[120px]">
                  Upload
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
      
      {errorMessage && (
        <div className="flex items-center gap-2 mt-3 text-destructive text-sm p-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
