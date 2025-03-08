
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { PageTransition } from '@/utils/transitions';

const Dashboard = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get session ID from URL query parameter or localStorage
    const params = new URLSearchParams(location.search);
    const sessionIdFromQuery = params.get('session_id');
    
    if (sessionIdFromQuery) {
      setSessionId(sessionIdFromQuery);
      localStorage.setItem('tcg_session_id', sessionIdFromQuery);
    } else {
      const storedSessionId = localStorage.getItem('tcg_session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        
        // Add session_id to the current URL if not present
        if (location.search === '') {
          navigate(`${location.pathname}?session_id=${storedSessionId}`, { replace: true });
        }
      } else {
        // No session ID found, redirect to login page
        toast.error('No session ID found. Please login again.');
        navigate('/');
      }
    }
  }, [location.search, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tcg_session_id');
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <Navigation
        sessionId={sessionId}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(prev => !prev)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-hidden transition-all duration-300">
        <div className="h-full overflow-auto">
          <PageTransition location={location.pathname}>
            <Outlet context={{ sessionId }} />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
