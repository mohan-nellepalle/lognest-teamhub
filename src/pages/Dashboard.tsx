
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AppSidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  LucideIcon,
  ClipboardList,
  AlertCircle
} from "lucide-react";

// Sample data - would come from API in real app
const mockProjects = [
  { id: 1, name: "Website Redesign", progress: 75, tasks: 12, completed: 9 },
  { id: 2, name: "Mobile App Development", progress: 45, tasks: 20, completed: 9 },
  { id: 3, name: "Marketing Campaign", progress: 90, tasks: 8, completed: 7 },
];

const mockTasks = [
  { id: 1, title: "Update homepage design", priority: "High", dueDate: "2023-08-15", status: "In Progress", project: "Website Redesign" },
  { id: 2, title: "Fix navigation bug on mobile", priority: "Critical", dueDate: "2023-08-12", status: "Pending", project: "Website Redesign" },
  { id: 3, title: "Create content for blog section", priority: "Medium", dueDate: "2023-08-20", status: "To Do", project: "Marketing Campaign" },
  { id: 4, title: "Implement authentication", priority: "High", dueDate: "2023-08-18", status: "In Progress", project: "Mobile App Development" },
];

const mockTeamMembers = [
  { id: 1, name: "John Doe", role: "Frontend Developer", avatar: "/avatar1.jpg", tasksCompleted: 15, hoursLogged: 37 },
  { id: 2, name: "Jane Smith", role: "UI/UX Designer", avatar: "/avatar2.jpg", tasksCompleted: 12, hoursLogged: 32 },
  { id: 3, name: "Mike Johnson", role: "Backend Developer", avatar: "/avatar3.jpg", tasksCompleted: 18, hoursLogged: 40 },
  { id: 4, name: "Sarah Williams", role: "Project Manager", avatar: "/avatar4.jpg", tasksCompleted: 8, hoursLogged: 35 },
];

const mockNotifications = [
  { id: 1, message: "New task assigned: Update product features", time: "2 hours ago", read: false },
  { id: 2, message: "Project 'Mobile App Development' deadline updated", time: "5 hours ago", read: false },
  { id: 3, message: "Team meeting scheduled for tomorrow at 10 AM", time: "Yesterday", read: true },
];

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, description, icon: Icon, change, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {change !== undefined && (
        <div className={`flex items-center text-xs mt-1 ${trend === "up" ? "text-green-500" :
            trend === "down" ? "text-red-500" : "text-muted-foreground"
          }`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {Math.abs(change)}% from last month
        </div>
      )}
    </CardContent>
  </Card>
);

const ProjectCard = ({ project }: { project: typeof mockProjects[0] }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{project.name}</CardTitle>
      <CardDescription>
        {project.completed} of {project.tasks} tasks completed
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-2">
        <Progress value={project.progress} className="h-2" />
      </div>
      <div className="text-sm text-muted-foreground">
        {project.progress}% complete
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Welcome to your dashboard",
      description: `Hello, ${user?.name}! You're logged in as ${user?.role}.`,
    });
  }, [user, toast]);

  // Different stats based on user role
  const getRoleBasedStats = () => {
    switch (user?.role) {
      case "admin":
        return [
          { title: "Total Projects", value: 12, icon: FileText, change: 8, trend: "up" },
          { title: "Active Team Members", value: 24, icon: Users, change: 12, trend: "up" },
          { title: "Tasks Completed", value: 142, description: "This month", icon: CheckCircle2, change: 3, trend: "down" },
          { title: "Hours Logged", value: 568, description: "This month", icon: Clock, change: 10, trend: "up" },
        ];
      case "hr":
        return [
          { title: "Team Members", value: 24, icon: Users, change: 12, trend: "up" },
          { title: "Average Hours", value: "38h", description: "Per person", icon: Clock, change: 5, trend: "up" },
          { title: "Projects Assigned", value: 8, icon: FileText, change: 0, trend: "neutral" },
          { title: "Pending Approvals", value: 7, icon: ClipboardList, change: 2, trend: "down" },
        ];
      case "employee":
      default:
        return [
          { title: "My Tasks", value: 8, description: "5 in progress", icon: ClipboardList, change: 2, trend: "up" },
          { title: "Hours Logged", value: "32h", description: "This week", icon: Clock, change: 4, trend: "up" },
          { title: "Projects", value: 3, description: "Currently assigned", icon: FileText, change: 0, trend: "neutral" },
          { title: "Completed Tasks", value: 24, description: "This month", icon: CheckCircle2, change: 16, trend: "up" },
        ];
    }
  };

  const stats = getRoleBasedStats();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {mockNotifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <motion.div
            className="max-w-7xl mx-auto space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
              <p className="text-muted-foreground">Here's what's happening today.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat as StatCardProps} />
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  {(user?.role === "admin" || user?.role === "hr") && (
                    <TabsTrigger value="team">Team</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Quick Summary</AlertTitle>
                    <AlertDescription>
                      You have {mockTasks.filter(t => t.status !== "Completed").length} active tasks across {mockProjects.length} projects.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                              <div className={`h-2 w-2 rounded-full mt-2 ${task.priority === "High" ? "bg-orange-500" :
                                  task.priority === "Critical" ? "bg-red-500" : "bg-blue-500"
                                }`} />
                              <div className="space-y-1">
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Due: {new Date(task.dueDate).toLocaleDateString()} • {task.project}
                                </p>
                              </div>
                              <div className="ml-auto">
                                <span className={`text-xs px-2 py-1 rounded-full ${task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                    task.status === "Pending" ? "bg-orange-100 text-orange-700" :
                                      "bg-muted text-muted-foreground"
                                  }`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">Team Weekly Meeting</p>
                              <p className="text-sm text-muted-foreground">Today, 2:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">Project Review</p>
                              <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">Client Presentation</p>
                              <p className="text-sm text-muted-foreground">Aug 18, 3:30 PM</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="space-y-4">
                    {mockTasks.map(task => (
                      <Card key={task.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full ${task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                task.status === "Pending" ? "bg-orange-100 text-orange-700" :
                                  task.status === "Completed" ? "bg-green-100 text-green-700" :
                                    "bg-muted text-muted-foreground"
                              }`}>
                              {task.status}
                            </span>
                          </div>
                          <CardDescription>
                            {task.project} • Due: {new Date(task.dueDate).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === "High" ? "bg-orange-100 text-orange-700" :
                                task.priority === "Critical" ? "bg-red-100 text-red-700" :
                                  task.priority === "Medium" ? "bg-blue-100 text-blue-700" :
                                    "bg-muted text-muted-foreground"
                              }`}>
                              {task.priority} Priority
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {(user?.role === "admin" || user?.role === "hr") && (
                  <TabsContent value="team" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {mockTeamMembers.map(member => (
                        <Card key={member.id}>
                          <CardHeader className="pb-2 text-center">
                            <div className="flex justify-center mb-2">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                            </div>
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <CardDescription>{member.role}</CardDescription>
                          </CardHeader>
                          <CardContent className="text-center">
                            <div className="flex justify-around text-sm">
                              <div>
                                <p className="font-bold">{member.tasksCompleted}</p>
                                <p className="text-xs text-muted-foreground">Tasks</p>
                              </div>
                              <div>
                                <p className="font-bold">{member.hoursLogged}h</p>
                                <p className="text-xs text-muted-foreground">Logged</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
