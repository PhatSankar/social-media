import React, {FC, createContext, useEffect, useState} from 'react';
import supabase from '../supabase/supabaseClient';
import {User} from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  logout: () => {},
  setUser: user => {},
});

export interface Props {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isLoggedIn();
  }, []);

  const isLoggedIn = async () => {
    const {data, error} = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user!);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, isLoading, logout, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
