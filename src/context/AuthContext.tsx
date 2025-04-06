import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

const apiUrl = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

console.log("helloapiUrlapiUrl", apiUrl);
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'hr';
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>; // <-- Update return type
  logout: () => void;
};

// Update LoginResponse type to match actual API response
type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('saavik_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('saavik_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("hellologindata", data);

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Create userData from the direct response
      const userData: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role as 'admin' | 'employee' | 'hr',
        avatar: data.avatar
      };
      
      setUser(userData);
      localStorage.setItem('saavik_user', JSON.stringify(userData));

      if (data.token) {
        localStorage.setItem('saavik_token', data.token);
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}`,
      });
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during login';
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saavik_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
