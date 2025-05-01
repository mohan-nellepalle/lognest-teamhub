
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/Sidebar";
import { workLogService } from "@/services/api";
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
import AdminView from "@/components/AdminView";
import { useNavigate } from "react-router-dom";

// Sample data - would come from API in real app
const mockProjects = [
  { id: 1, name: "Website Redesign", progress: 75, tasks: 12, completed: 9 },
  { id: 2, name: "Mobile App Development", progress: 45, tasks: 20, completed: 9 },
  { id: 3, name: "Marketing Campaign", progress: 90, tasks: 8, completed: 7 },
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
    <CardHeader className="pb-2 1">
      <CardTitle className="text-lg">{project.name}</CardTitle>
      <CardDescription>
        {project.completed} of {project.tasks} Tasks completed
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



// Add this type definition
type WorkLog = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    role: string;
  };
  timeSpent: number;
  date: string;
  description?: string;
};

// Add new type for User
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

// Add import at the top
import { userService } from '@/services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [teamTimesheets, setTeamTimesheets] = useState<WorkLog[]>([]); // Add this line
  const navigate = useNavigate();

  // Add function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      console.log("Fetched users:", response);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  // Add function to fetch timesheets
  const fetchTeamTimesheets = async () => {
    try {
      const response = await workLogService.getAllWorkLogs();
      if (response.success && Array.isArray(response.data)) {
        console.log("Fetched timesheets:", response.data);

        setTeamTimesheets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch team timesheets:', error);
      setTeamTimesheets([]);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
      fetchTeamTimesheets(); // Add this line
    }
  }, [user]);

  const handleUserClick = (userId: string) => {
    navigate(`/user-details/${userId}`);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Update header for better laptop responsiveness */}
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-4 lg:px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2 lg:gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {mockNotifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <motion.div
            className="max-w-7xl mx-auto space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}>
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
              <p className="text-muted-foreground">Here's what's happening today.</p>
            </motion.div>

            {/* <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat as StatCardProps} />
              ))}
            </motion.div> */}

            <motion.div variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}>
              {/* Update the defaultValue to "team" */}
              <Tabs defaultValue="team" className="space-y-4">
                <TabsList>
                  {(user?.role === "admin" || user?.role === "hr") && (
                    <TabsTrigger value="team">Team</TabsTrigger>
                  )}
                </TabsList>

                {/* Rest of the tabs content */}

                {/* <TabsContent value="overview" className="space-y-4"> */}
                {/* <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Quick Summary</AlertTitle>
                    <AlertDescription>
                      You have {mockTasks.filter(t => t.status !== "Completed").length} active tasks across {mockProjects.length} projects.
                    </AlertDescription>
                  </Alert> */}

                {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div> */}

                {/* <div className="grid gap-4 md:grid-cols-2">
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
                  </div> */}
                {/* </TabsContent> */}

                {/* <TabsContent value="projects" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </TabsContent> */}

                {/* <TabsContent value="tasks" className="space-y-4">
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
                </TabsContent> */}

                {(user?.role === "admin" || user?.role === "hr") && (
                  <TabsContent value="team" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {users && users.length > 0 ? (
                        users.map((member) => (
                          <Card
                            key={member._id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleUserClick(member._id)}
                          >
                            <CardHeader className="pb-2 text-center">
                              <div className="flex justify-center mb-2">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                              </div>
                              <CardTitle className="text-base">{member.name}</CardTitle>
                              <CardDescription className="capitalize">{member.role}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <div className="flex justify-around text-sm">
                                  <div>
                                    <p className="font-bold capitalize">Role</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </div>
                                  <div>
                                    <p className="font-bold">Status</p>
                                    <p className="text-xs text-green-600">Active</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-4 text-center py-8 text-muted-foreground">
                          No team members found
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                {(user?.role === "admin" || user?.role === "hr") && (
                  <TabsContent value="timesheets" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Timesheets</CardTitle>
                        <CardDescription>Recent time entries from all team members</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {teamTimesheets && teamTimesheets.length > 0 ? (
                            teamTimesheets.map((log) => (
                              <div key={log._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 border rounded-lg hover:bg-muted/50">
                                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {log.userId?.name ? log.userId.name.charAt(0) : 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{log.userId?.name || 'Unknown User'}</p>
                                    <p className="text-sm text-muted-foreground">{log.userId?.role || 'No Role'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{log.timeSpent} hours</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(log.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No timesheet entries found
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
