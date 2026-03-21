import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Gender, Status, UserRoles } from "../config/constants";
import { Spin } from "antd";
import authSvc from "../services/auth.service";

type AuthProviderProps = {
  children: ReactNode;
};
export const AuthContext = createContext<IAuthContext>({
  loggedInUser: null,
  setLoggedInUserProfile: () => {},
});

export interface ILoggedInUserProfile {
  address: {
    billingAddress: string;
    shippingAddress: string;
  };
  createdAt: Date;
  createdBy: null;
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
  updatedBy: null;
  _id: string;
}

export interface IAuthContext {
  loggedInUser: null | ILoggedInUserProfile;
  setLoggedInUserProfile: Dispatch<SetStateAction<ILoggedInUserProfile | null>>;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUserProfile, setLoggedInUserProfile] =
    useState<ILoggedInUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getLoggedInUserProfileDetail = async () => {
    try {
        const userProfileResponse = await authSvc.getLoggedInUserProfile()
        setLoggedInUserProfile(userProfileResponse.data)
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("_at_movieticket") || null;
    if (token) {
      getLoggedInUserProfileDetail();
    } else {
      setLoading(false);
    }
  }, []);
  return loading ? (
    <>
      <Spin fullscreen />
    </>
  ) : (
    <>
      <AuthContext.Provider
        value={{
          loggedInUser: loggedInUserProfile,
          setLoggedInUserProfile: setLoggedInUserProfile,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  const { loggedInUser, setLoggedInUserProfile } = useContext(AuthContext);
  return {
    loggedInUser,
    setLoggedInUserProfile,
  };
};
