import { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

type UserData = {
  email: string;
  name: string;
  profilePicture: string;
};

type UserProviderProps = {
  children: React.ReactNode;
};

type UserProviderState = {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  isLoading: boolean;
  setUserData: (data: UserData) => void;
  clearUser: () => void;
};

const initialState: UserProviderState = {
  user: null,
  session: null,
  userData: null,
  isLoading: true,
  setUserData: () => null,
  clearUser: () => null,
};

const UserProviderContext = createContext<UserProviderState>(initialState);

export function UserProvider({ children, ...props }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle user metadata
        if (session?.user) {
          const metadata = session.user.user_metadata;
          setUserDataState({
            email: session.user.email || '',
            name: metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            profilePicture: metadata?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata?.full_name || session.user.email}`
          });
        } else {
          setUserDataState(null);
        }
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserDataState({
          email: session.user.email || '',
          name: metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          profilePicture: metadata?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata?.full_name || session.user.email}`
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
  };

  const clearUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserDataState(null);
  };

  const value = {
    user,
    session,
    userData,
    isLoading,
    setUserData,
    clearUser,
  };

  return (
    <UserProviderContext.Provider {...props} value={value}>
      {children}
    </UserProviderContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserProviderContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};