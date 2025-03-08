
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Info, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import FileUploader from '@/components/FileUploader';
import DataSourceItem from '@/components/DataSourceItem';
import { api, DataSource } from '@/utils/api';

interface UploadDataProps {}

const UploadData: React.FC<UploadDataProps> = () => {
  const { sessionId } = useOutletContext<{ sessionId: string }>();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingSourceId, setEditingSourceId] = useState('');
  const [updatingSourceId, setUpdatingSourceId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing data sources on load
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await api.getDataSources(sessionId);
        setDataSources(response.dataSources);
      } catch (error) {
        console.error('Failed to fetch data sources:', error);
        toast.error('Failed to load data sources');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchDataSources();
    }
  }, [sessionId]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Perform actual upload
      const response = await api.uploadFiles(sessionId, file);
      
      // Finish progress animation
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setDataSources(response.dataSources);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success('Files uploaded successfully');
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload file. Please try again.');
      toast.error('Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateDataSource = async (id: string, updates: Partial<DataSource>) => {
    setUpdatingSourceId(id);
    
    try {
      const updatedSource = await api.updateDataSource(sessionId, id, updates);
      
      setDataSources(prev => 
        prev.map(source => source.id === id ? updatedSource : source)
      );
      
      toast.success('Data source updated successfully');
    } catch (error) {
      console.error('Failed to update data source:', error);
      toast.error('Failed to update data source');
    } finally {
      setUpdatingSourceId('');
    }
  };

  return (
    <div className="container py-8 animate-fade-up">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Upload Data</h1>
      <p className="text-muted-foreground mb-8">
        Upload a ZIP file containing your test data sources
      </p>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <FileUploader
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            errorMessage={uploadError}
          />
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Data Sources</h2>
        <p className="text-muted-foreground mb-4">
          Add descriptions and usage instructions for your data sources
        </p>
        <Separator className="mb-6" />
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse">Loading data sources...</div>
          </div>
        ) : dataSources.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No data sources found</AlertTitle>
            <AlertDescription>
              Upload a ZIP file to add data sources to your session.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map(source => (
              <DataSourceItem
                key={source.id}
                dataSource={source}
                onUpdate={handleUpdateDataSource}
                isEditing={editingSourceId === source.id}
                onEditToggle={setEditingSourceId}
                isUpdating={updatingSourceId === source.id}
              />
            ))}
          </div>
        )}
      </div>
      
      <Alert variant="default" className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription className="text-sm">
          Adding good descriptions helps the AI better understand how to use your data sources 
          when generating test cases.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UploadData;
