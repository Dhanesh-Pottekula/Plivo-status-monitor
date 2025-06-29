import type { UserInterface } from "@/_constants/Interfaces/UserInterfaces";

import { useDispatch, useSelector } from "react-redux";
import React, { createContext, useEffect, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "@/_redux/store";
import { getUserAction } from "@/_redux/actions/user.actions";


interface AuthContextType {
  user: UserInterface | null;
  isLoading: boolean;
  is_have_edit_access: boolean;
  is_have_team_manage_access: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, isProfileLoading } = useSelector((state: RootState) => state.getUserProfileReducer);
  const [is_have_edit_access, setIsHaveEditAccess] = useState(false);
  const [is_have_team_manage_access, setIsHaveTeamManageAccess] = useState(false);
  useEffect(() => {
    if(!isProfileLoading) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const is_have_edit_access = profileData?.role === "admin" ||( profileData?.role === "team" && profileData?.has_access)
    const is_have_team_manage_access = profileData?.role === "admin"
    setIsHaveEditAccess(is_have_edit_access);
    setIsHaveTeamManageAccess(is_have_team_manage_access);
  }, [profileData]);

  const fetchUser = async () => {
    dispatch(getUserAction());
  };
  return (
    <AuthContext.Provider value={{ user: profileData||null, isLoading: isProfileLoading||false, is_have_edit_access, is_have_team_manage_access }}>
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
