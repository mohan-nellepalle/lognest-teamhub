
import AppSidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MoreVertical, Calendar, ClipboardList } from "lucide-react";
import { useState } from "react";

// Sample data - would come from API in real app
const mockTasks = [
  { 
    id: 1, 
    title: "Update homepage design", 
    description: "Revamp the homepage with new hero section and improved navigation",
    priority: "High", 
    dueDate: "2023-08-15", 
    status: "In Progress", 
    project: "Website Redesign",
    assignedTo: { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
  },
  { 
    id: 2, 
    title: "Fix navigation bug on mobile", 
    description: "Address the menu toggle issue on smaller screen sizes",
    priority: "Critical", 
    dueDate: "2023-08-12", 
    status: "Pending", 
    project: "Website Redesign",
    assignedTo: { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg" },
  },
  { 
    id: 3, 
    title: "Create content for blog section", 
    description: "Draft 5 blog posts for the upcoming product launch",
    priority: "Medium", 
    dueDate: "2023-08-20", 
    status: "To Do", 
    project: "Marketing Campaign",
    assignedTo: { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
  },
  { 
    id: 4, 
    title: "Implement authentication", 
    description: "Add secure login and registration functionality with JWT",
    priority: "High", 
    dueDate: "2023-08-18", 
    status: "In Progress", 
    project: "Mobile App Development",
    assignedTo: { id: 6, name: "Emily Chen", avatar: "/avatar6.jpg" },
  },
  { 
    id: 5, 
    title: "Design product page mockups", 
    description: "Create mobile and desktop mockups for the new product page",
    priority: "Medium", 
    dueDate: "2023-08-25", 
    status: "To Do", 
    project: "Website Redesign",
    assignedTo: { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
  },
  { 
    id: 6, 
    title: "Set up CI/CD pipeline", 
    description: "Configure automated testing and deployment process",
    priority: "High", 
    dueDate: "2023-08-22", 
    status: "Pending", 
    project: "DevOps Improvement",
    assignedTo: { id: 5, name: "David Wilson", avatar: "/avatar5.jpg" },
  },
  { 
    id: 7, 
    title: "User testing sessions", 
    description: "Organize and conduct user testing for the new features",
    priority: "Medium", 
    dueDate: "2023-08-30", 
    status: "To Do", 
    project: "Mobile App Development",
    assignedTo: { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg" },
  },
  { 
    id: 8, 
    title: "Q3 performance reports", 
    description: "Compile and analyze Q3 performance metrics for all projects",
    priority: "Medium", 
    dueDate: "2023-09-05", 
    status: "To Do", 
    project: "Management",
    assignedTo: { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg" },
  },
];

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "to-do") return matchesSearch && task.status === "To Do";
    if (filter === "in-progress") return matchesSearch && task.status === "In Progress";
    if (filter === "pending") return matchesSearch && task.status === "Pending";
    if (filter === "completed") return matchesSearch && task.status === "Completed";
    
    return matchesSearch;
  });
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-blue-100 text-blue-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Tasks</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
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
                value={filter}
                onValueChange={setFilter}
                className="space-y-6"
              >
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="to-do">To Do</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value={filter} className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">No Tasks Found</CardTitle>
                        <CardDescription className="text-center">
                          There are no tasks matching your current filters.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center pb-6">
                        <Button variant="outline" onClick={() => {
                          setSearchTerm("");
                          setFilter("all");
                        }}>
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <motion.div 
                          key={task.id}
                          variants={fadeInUp}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">{task.title}</CardTitle>
                                  <CardDescription>{task.description}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Project: </span>
                                    <Badge variant="outline">{task.project}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Due Date: </span>
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority} Priority
                                  </Badge>
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assignedTo.avatar} />
                                        <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">{task.assignedTo.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
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

export default TasksPage;
