import { createContext, useContext, useState, useEffect } from "react";

type User = {
  email: string;
  name: string;
  profilePicture: string;
};

type UserProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type UserProviderState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const initialState: UserProviderState = {
  user: null,
  setUser: () => null,
  clearUser: () => null,
};

const UserProviderContext = createContext<UserProviderState>(initialState);

export function UserProvider({
  children,
  storageKey = "ai-coach-user",
  ...props
}: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(storageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (userData: User) => {
    localStorage.setItem(storageKey, JSON.stringify(userData));
    setUserState(userData);
  };

  const clearUser = () => {
    localStorage.removeItem(storageKey);
    setUserState(null);
  };

  const value = {
    user,
    setUser,
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