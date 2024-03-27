import React, { createContext, useContext, ReactNode, useState } from 'react';
import { SharedState } from '@/types';

// Define the shape of your context state
interface AppState {
  sharedState: SharedState; // Replace 'any' with a more specific type according to your shared state
  setSharedState: React.Dispatch<React.SetStateAction<SharedState>>; // Same here, replace 'any' with the type of your shared state
}

// Create a context with an undefined initial value; we will enforce its presence with a Provider later
const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [sharedState, setSharedState] = useState<SharedState>({
    basketIdent: "",
    username: "",
    authenticated: false,
    checkoutURL: "",
    authURL: ""
  }); 

  return (
    <AppContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
