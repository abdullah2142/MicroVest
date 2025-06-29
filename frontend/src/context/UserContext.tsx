// src/context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the shape of your user state
interface UserState {
  isAuthenticated: boolean;
  authToken: string | null;
  userType: 'investor' | 'entrepreneur' | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  prof_pic?: string | null;
  loading: boolean; // Add loading state
}

// Define the shape of the context methods
interface UserContextType {
  user: UserState;
  login: (data: any) => void; // Simplify login signature
  logout: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the UserProvider component
interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserState>({
    isAuthenticated: false,
    authToken: null,
    userType: null,
    username: null,
    email: null,
    first_name: null,
    last_name: null,
    prof_pic: null,
    loading: true, // Start in a loading state
  });

  // Effect to load user data from localStorage on initial load
  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedUserType = localStorage.getItem('userType') as 'investor' | 'entrepreneur' | null;
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedFirstName = localStorage.getItem('first_name');
    const storedLastName = localStorage.getItem('last_name');
    const storedProfPic = localStorage.getItem('prof_pic');

    if (storedAuthToken && storedUserType && storedUsername) {
      setUser({
        isAuthenticated: true,
        authToken: storedAuthToken,
        userType: storedUserType,
        username: storedUsername,
        email: storedEmail,
        first_name: storedFirstName,
        last_name: storedLastName,
        prof_pic: storedProfPic,
        loading: false, // Finished loading
      });
    } else {
      setUser((prevState) => ({ ...prevState, loading: false })); // Finished loading
    }
  }, []);

  // Login function
  const login = (data: any) => {
    localStorage.setItem('authToken', data.tokens.access);
    localStorage.setItem('userType', data.user_type);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('first_name', data.first_name || '');
    localStorage.setItem('last_name', data.last_name || '');
    localStorage.setItem('userId', data.user_id);
    // Note: Profile picture will be fetched separately from the backend

    setUser({
      isAuthenticated: true,
      authToken: data.tokens.access,
      userType: data.user_type,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      prof_pic: null, // Will be fetched from backend
      loading: false,
    });
  };

  // Logout function
  const logout = () => {
    // Clear all relevant items from localStorage
    Object.keys(localStorage).forEach(key => {
        if (['authToken', 'userType', 'username', 'email', 'first_name', 'last_name', 'userId', 'refreshToken', 'prof_pic'].includes(key)) {
            localStorage.removeItem(key);
        }
    });

    setUser({
      isAuthenticated: false,
      authToken: null,
      userType: null,
      username: null,
      email: null,
      first_name: null,
      last_name: null,
      prof_pic: null,
      loading: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};