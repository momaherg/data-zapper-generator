
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Upload, Tool, FileText, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  sessionId: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  sessionId, 
  isCollapsed, 
  toggleCollapse, 
  onLogout 
}) => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Upload Data',
      path: '/upload',
      icon: Upload
    },
    {
      name: 'Tools',
      path: '/tools',
      icon: Tool
    },
    {
      name: 'Test Specifications',
      path: '/specs',
      icon: FileText
    }
  ];
  
  return (
    <div className={cn(
      "h-screen bg-sidebar px-3 py-4 flex flex-col border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <div className="text-lg font-semibold truncate">
            Test Case Generator
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="space-y-1 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={`/dashboard${item.path}?session_id=${sessionId}`}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover-lift",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              isCollapsed && "justify-center"
            )}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t border-border">
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2 text-xs text-sidebar-foreground/80 truncate">
            Session ID: {sessionId}
          </div>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          onClick={onLogout}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} className={cn(!isCollapsed && "mr-2")} />
          {!isCollapsed && "Log out"}
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
