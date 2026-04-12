"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Gender, Status, UserRoles } from "../config/constants.config";
import { Spin } from "antd";
import authSvc from "../services/auth.service";

// --- Interfaces ---
export interface ILoggedInUserProfile {
  address: {
    billingAddress: string;
    shippingAddress: string;
  };
  createdAt: Date;
  createdBy: null | string; // Fixed: usually string or null
  dob: Date;
  email: string;
  gender: Gender;
  image: {
    optimizedUrl: string;
    publicId: string;
    secureUrl: string;
  };
  name: string;
  phone: string;
  role: UserRoles;
  status: Status;
  updatedAt: Date;
  updatedBy: null | string;
  _id: string;
}

export interface IAuthContext {
  loggedInUser: null | ILoggedInUserProfile;
  setLoggedInUserProfile: Dispatch<SetStateAction<ILoggedInUserProfile | null>>;
  loading: boolean; // Added: helpful for child components to know auth status
}

// --- Context Definition ---
// Fixed: Initialize with proper default values to avoid "undefined" errors
export const AuthContext = createContext<IAuthContext>({
  loggedInUser: null,
  setLoggedInUserProfile: () => {},
  loading: true,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUserProfile, setLoggedInUserProfile] =
    useState<ILoggedInUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fixed: Wrap in useCallback if you ever want to call this from outside
  const getLoggedInUserProfileDetail = useCallback(async () => {
    try {
      setLoading(true);
      const userProfileResponse = await authSvc.getLoggedInUserProfile();
      
      // Ensure we are setting the data correctly based on your API structure
      if (userProfileResponse && userProfileResponse.data) {
        setLoggedInUserProfile(userProfileResponse.data);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Fixed: Clear token if it's invalid/expired to prevent infinite loading
      localStorage.removeItem("_at_movieticket");
      setLoggedInUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for token on mount
    const token = typeof window !== "undefined" ? localStorage.getItem("_at_movieticket") : null;
    
    if (token) {
      getLoggedInUserProfileDetail();
    } else {
      setLoading(false);
    }
  }, [getLoggedInUserProfileDetail]);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser: loggedInUserProfile,
        setLoggedInUserProfile: setLoggedInUserProfile,
        loading: loading
      }}
    >
      {/* Fixed: Don't always hide children with Spin. 
          Sometimes you want public pages to show even if auth is loading.
          If you want a global block, keep Spin, otherwise move Spin inside specific components.
      */}
      {loading ? <Spin fullscreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};