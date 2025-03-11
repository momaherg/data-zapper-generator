
import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  user: any | null;
}

const UserContext = createContext<UserContextType>({ user: null });

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<any | null>(null);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
