
import AppSidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, CalendarDays, Clock, ClipboardList, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Sample data - would come from API in real app
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const mockWorkLogs = [
  { 
    id: 1, 
    user: { id: 1, name: "John Doe", avatar: "/avatar1.jpg", role: "Frontend Developer" },
    date: today.toISOString(),
    hours: 7.5,
    project: "Website Redesign",
    task: "Update homepage design",
    description: "Implemented new hero section and improved navigation components",
    status: "Completed"
  },
  { 
    id: 2, 
    user: { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg", role: "Backend Developer" },
    date: today.toISOString(),
    hours: 6,
    project: "Mobile App Development",
    task: "API Integration",
    description: "Connected user authentication endpoints and tested login flow",
    status: "In Progress"
  },
  { 
    id: 3, 
    user: { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg", role: "UI/UX Designer" },
    date: today.toISOString(),
    hours: 8,
    project: "Marketing Campaign",
    task: "Design social media assets",
    description: "Created Instagram and Facebook post templates for upcoming campaign",
    status: "Completed"
  },
  { 
    id: 4, 
    user: { id: 1, name: "John Doe", avatar: "/avatar1.jpg", role: "Frontend Developer" },
    date: yesterday.toISOString(),
    hours: 6.5,
    project: "Website Redesign",
    task: "Mobile responsiveness fixes",
    description: "Fixed responsive layout issues on product pages for mobile screens",
    status: "Completed"
  },
  { 
    id: 5, 
    user: { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg", role: "Project Manager" },
    date: yesterday.toISOString(),
    hours: 4,
    project: "Management",
    task: "Team planning meeting",
    description: "Conducted sprint planning and task assignments for upcoming week",
    status: "Completed"
  },
  { 
    id: 6, 
    user: { id: 5, name: "David Wilson", avatar: "/avatar5.jpg", role: "DevOps Engineer" },
    date: yesterday.toISOString(),
    hours: 7,
    project: "DevOps Improvement",
    task: "Server monitoring setup",
    description: "Implemented new monitoring and alerting system for production servers",
    status: "Completed"
  },
  { 
    id: 7, 
    user: { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg", role: "Backend Developer" },
    date: twoDaysAgo.toISOString(),
    hours: 7.5,
    project: "Mobile App Development",
    task: "Database schema design",
    description: "Finalized database structure and created migration scripts",
    status: "Completed"
  },
  { 
    id: 8, 
    user: { id: 6, name: "Emily Chen", avatar: "/avatar6.jpg", role: "QA Specialist" },
    date: twoDaysAgo.toISOString(),
    hours: 6,
    project: "Website Redesign",
    task: "Testing checkout flow",
    description: "Conducted comprehensive testing of the new checkout process and logged bugs",
    status: "Completed"
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

const WorkLogsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("all");
  
  const isAdmin = user?.role === "admin" || user?.role === "hr";
  
  const filteredLogs = mockWorkLogs.filter(log => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (view === "all") return matchesSearch;
    if (view === "my" && !isAdmin) return matchesSearch && log.user.id === 1; // Assuming current user is John Doe (id: 1)
    if (view === "today") return matchesSearch && formatDate(log.date) === "Today";
    if (view === "yesterday") return matchesSearch && formatDate(log.date) === "Yesterday";
    
    return matchesSearch;
  });
  
  // Group logs by date
  const groupedLogs: Record<string, typeof mockWorkLogs> = {};
  filteredLogs.forEach(log => {
    const dateKey = formatDate(log.date);
    if (!groupedLogs[dateKey]) {
      groupedLogs[dateKey] = [];
    }
    groupedLogs[dateKey].push(log);
  });
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Work Logs</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Work
            </Button>
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
              <Tabs 
                defaultValue="all" 
                value={view}
                onValueChange={setView}
                className="space-y-6"
              >
                <TabsList>
                  <TabsTrigger value="all">All Logs</TabsTrigger>
                  {!isAdmin && <TabsTrigger value="my">My Logs</TabsTrigger>}
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                </TabsList>
                
                <TabsContent value={view} className="space-y-6">
                  {Object.keys(groupedLogs).length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">No Work Logs Found</CardTitle>
                        <CardDescription className="text-center">
                          There are no work logs matching your current filters.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center pb-6">
                        <Button variant="outline" onClick={() => {
                          setSearchTerm("");
                          setView("all");
                        }}>
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    Object.entries(groupedLogs).map(([date, logs]) => (
                      <motion.div key={date} variants={fadeInUp} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">{date}</h2>
                        </div>
                        
                        <div className="space-y-4">
                          {logs.map((log) => (
                            <motion.div
                              key={log.id}
                              variants={fadeInUp}
                              whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            >
                              <Card>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={log.user.avatar} />
                                        <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <CardTitle className="text-base">{log.user.name}</CardTitle>
                                        <CardDescription>{log.user.role}</CardDescription>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{log.hours} hours</span>
                                      </div>
                                      <Badge className={log.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                                        {log.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                      <div className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Project: </span>
                                        <Badge variant="outline">{log.project}</Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Task: </span>
                                        <span className="text-sm font-medium">{log.task}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm">{log.description}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default WorkLogsPage;
