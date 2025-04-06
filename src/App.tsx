
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import WorkLogs from "./pages/WorkLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDetails from "./pages/UserDetails";
import AddEmployee from "./pages/AddEmployee";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Dashboard />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Projects />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/teams" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Teams />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Tasks />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/work-logs" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <WorkLogs />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Reports />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <Settings />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
             <Route path="/user-details/:userId" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <UserDetails />
                </SidebarProvider>
              </ProtectedRoute>
            } />
             <Route path="/add-employee" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AddEmployee />
                </SidebarProvider>
              </ProtectedRoute>
            } />
            {/* <Route path="/user-details/:userId" element={<UserDetails />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
