
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL params for signup tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("signup") === "true") {
      setActiveTab("signup");
    }
  }, [location.search]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      const response = await login(email, password);
      
      if (!response?.role) {
        throw new Error('Invalid user role received');
      }

      // Define redirect paths based on role
      const redirectPaths = {
        employee: '/work-logs',
        admin: '/dashboard',
        hr: '/hr-dashboard'
      };

      const redirectPath = redirectPaths[response.role as keyof typeof redirectPaths] || '/';
      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add form validation
  const isValidForm = () => {
    return email.includes('@') && password.length >= 6;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <motion.div
        className="flex flex-grow items-center justify-center p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white">
                  S
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                Welcome to Saavik
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login"
                  ? "Sign in to your account to continue"
                  : "Create a new account to get started"}
              </CardDescription>
              <TabsList className="grid grid-cols-2 mt-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                {/* <TabsTrigger value="signup">Sign Up</TabsTrigger> */}
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={email && !email.includes('@') ? 'border-red-500' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className={password && password.length < 6 ? 'border-red-500' : ''}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isValidForm()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
