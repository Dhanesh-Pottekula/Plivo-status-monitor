import type { UserInterface } from "@/_constants/Interfaces/UserInterfaces";
import { getUser } from "@/_redux/userSlice";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import React, { createContext, useEffect, useContext } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: UserInterface | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: RootState) => state.user);
  useEffect(() => {
    if(!isLoading) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    dispatch(getUser());
  };
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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
