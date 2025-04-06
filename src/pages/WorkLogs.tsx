import AppSidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, CalendarDays, Clock, ClipboardList, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { workLogService } from "@/services/api";
import LogWorkModal from "@/components/LogWorkModal";

// Define WorkLog Type
type WorkLog = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
    email: string;
    role: string;
    settings: {
      notifications: Record<string, any>;
      theme: string;
    };
  };
  date: string;
  timeSpent: number;
  projectId: string;
  taskId?: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Dummy project and task mapping for display (replace with real data)


const taskMap: Record<string, string> = {
  "task1": "Design UI",
  "task2": "API Integration"
};

// Format date function
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

// Add these types at the top with other type definitions
type WorkLogResponse = {
  success: boolean;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  data: WorkLog[];
};

const WorkLogsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("today");
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "admin" || user?.role === "hr";
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch Work Logs from API
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
console.log("hellologind inuser",user);

  // Update fetchWorkLogs function
  const fetchWorkLogs = async () => {
    setLoading(true);
    try {
      if (!user?._id) return;
      const response = await workLogService.getUserWorkLogs(user._id);
      const workLogResponse = response as WorkLogResponse;
      
      setWorkLogs(Array.isArray(workLogResponse.data) ? workLogResponse.data : []);
      setTotalRecords(workLogResponse.totalRecords);
      setCurrentPage(workLogResponse.currentPage);
      setTotalPages(workLogResponse.totalPages);
    } catch (error) {
      console.error("Failed to fetch work logs:", error);
      setWorkLogs([]);
    } finally {
      setLoading(false);
    }
  };
console.log("Hellosetworklogs",workLogs);

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  if (loading) {
    return <div>Loading work logs...</div>;
  }
  console.log("helloworklogs", workLogs);

  // Filtered Logs
  // Update the filteredLogs function to handle null userId
  // Update the filteredLogs function
  const filteredLogs = workLogs.filter((log) => {
    const matchesSearch =
      (log.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (String(log.taskId || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    if (view === "all") return matchesSearch;
    if (view === "my" && !isAdmin) return matchesSearch;
    if (view === "today") return matchesSearch && formatDate(log.createdAt) === "Today";
    if (view === "yesterday") return matchesSearch && formatDate(log.createdAt) === "Yesterday";

    return matchesSearch;
  });

  // Group logs by date
  const groupedLogs: Record<string, WorkLog[]> = {};
  filteredLogs.forEach((log) => {
    const dateKey = formatDate(log.createdAt);
    if (!groupedLogs[dateKey]) {
      groupedLogs[dateKey] = [];
    }
    groupedLogs[dateKey].push(log);
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
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
            <Button onClick={handleOpenModal}>
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
                defaultValue="today"
                value={view}
                onValueChange={setView}
                className="space-y-6"
              >
                <TabsList>
                  {!isAdmin && <TabsTrigger value="my">My Logs</TabsTrigger>}
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                  <TabsTrigger value="all">All Logs</TabsTrigger>
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
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setView("all");
                          }}
                        >
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
                              key={log._id}
                              variants={fadeInUp}
                              whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            >
                              <Card>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={log.userId?.avatar || ''} />
                                        <AvatarFallback>
                                          {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <CardTitle className="text-base">
                                          {user?.name || 'Unknown User'}
                                        </CardTitle>
                                        <CardDescription>{user?.role || 'No Role'}</CardDescription>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          {log.timeSpent} hours
                                        </span>
                                      </div>
                                      <Badge
                                        className="bg-blue-100 text-blue-700"
                                      >
                                        Completed
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          Task:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {log?.taskId || "No Task"}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm">{log?.description}</p>
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
        <LogWorkModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onWorkLogAdded={fetchWorkLogs}
        />
      </div>
    </div>
  );
};

export default WorkLogsPage;
