import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { SharedState } from "@/types";

interface AppState {
  sharedState: SharedState;
  setSharedState: React.Dispatch<React.SetStateAction<SharedState>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [sharedState, setSharedState] = useState<SharedState>(() => {
    const storedPackages = localStorage.getItem("packages");
    let packages = [];
    try {
      packages = storedPackages ? JSON.parse(storedPackages) : [];
    } catch (error) {
      console.error("Failed to parse packages from localStorage:", error);
    }
    return {
      basketIdent: localStorage.getItem("basketIdent") || "",
      username: localStorage.getItem("username") || "",
      authenticated: false,
      checkoutURL: "",
      authURL: "",
      packages: packages,
    };
  });

  useEffect(() => {
    const initializeData = async () => {
      if (
        localStorage.getItem("basketIdent") === "undefined" ||
        !localStorage.getItem("basketIdent")
      ) {
        const url = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/baskets`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });
        const jsonData = await response.json();

        // now generate auth url
        const encodedURL = encodeURIComponent(
          "http://clarityrust.gg/store?authed=true",
        );
        const authUrl = `https://headless.tebex.io/api/accounts/${import.meta.env.VITE_WEBSTORE_IDENT}/baskets/${jsonData.data.ident}/auth?returnUrl=${encodedURL}`;
        const authResponse = await fetch(authUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const json = await authResponse.json();
        setSharedState((prevState) => ({
          ...prevState,
          basketIdent: jsonData.data.ident,
          authURL: json[0].url,
          authenticated: false,
        }));
        localStorage.setItem("basketIdent", jsonData.data.ident);
        localStorage.setItem("authURL", json[0].url);
      } else {
        // If basketIdent exists in localStorage, ensure state is updated accordingly
        const packages = JSON.parse(localStorage.getItem("packages") || "[]");
        setSharedState((prevState) => ({
          ...prevState,
          basketIdent: localStorage.getItem("basketIdent") || "",
          authURL: localStorage.getItem("authURL") || "",
          authenticated: localStorage.getItem("authenticated") === "true",
          checkoutURL: localStorage.getItem("checkoutURL") || "",
          packages: packages,
        }));
      }
    };

    initializeData().catch(console.error);
  }, []);

  return (
    <AppContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
