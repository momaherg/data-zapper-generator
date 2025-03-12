
import React, { createContext, useContext, useState } from "react";

// Create a mock user object
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create context with default values
export const appContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

// Create provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: "user-1",
    name: "Default User",
    email: "user@example.com",
    role: "user"
  });

  return (
    <appContext.Provider value={{ user, setUser }}>
      {children}
    </appContext.Provider>
  );
};

// Create hook for consuming context
export const useAppContext = () => {
  return useContext(appContext);
};
