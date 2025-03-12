
import React, { createContext, useContext } from 'react';

// Create a default context
export const appContext = createContext<{
  user?: {
    id: string;
    name: string;
    email: string;
  }
}>({});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };

  return (
    <appContext.Provider value={{ user: mockUser }}>
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => useContext(appContext);
