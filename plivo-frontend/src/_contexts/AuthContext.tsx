import type { UserInterface } from "@/_constants/Interfaces/UserInterfaces";

import { useDispatch, useSelector } from "react-redux";
import React, { createContext, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "@/_redux/store";
import { getUserAction } from "@/_redux/actions/user.actions";


interface AuthContextType {
  user: UserInterface | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, isProfileLoading } = useSelector((state: RootState) => state.getUserProfileReducer);
  useEffect(() => {
    if(!isProfileLoading) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    dispatch(getUserAction());
  };
  return (
    <AuthContext.Provider value={{ user: profileData||null, isLoading: isProfileLoading||false }}>
      {children}
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
