
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/utils/api';

const Index = () => {
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSessionId = localStorage.getItem('tcg_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId.trim()) {
      toast.error('Please enter a session ID');
      return;
    }
    
    setIsLoading(true);
    
    try {
      localStorage.setItem('tcg_session_id', sessionId);
      
      try {
        // Try to generate a test case, but don't block navigation if it fails
        await api.generateTestCase(sessionId, {
          requirement: '',
          format: '',
          notes: '',
          dataSourceIds: []
        });
      } catch (error) {
        console.error('Failed to create initial test case:', error);
        // Show error but continue with navigation
        toast.error('Failed to create initial test case, but you can continue');
      }
      
      // Navigate regardless of API success or failure
      navigate(`/dashboard/upload?session_id=${sessionId}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const generateRandomId = () => {
    const randomId = `user_${Math.random().toString(36).substring(2, 10)}`;
    setSessionId(randomId);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIwLjYiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiAvPjwvc3ZnPg==')] opacity-50" />
      </div>
      
      <div className="max-w-md w-full px-4 z-10 animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
            <div className="w-8 h-8 rounded-full bg-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Test Case Generator</h1>
          <p className="text-muted-foreground">
            Enter a session ID to continue or generate a new one
          </p>
        </div>
        
        <Card className="glass shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="sessionId"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Enter your session ID"
                    className="flex-1"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateRandomId}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This ID will be used to identify your session and its data
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
