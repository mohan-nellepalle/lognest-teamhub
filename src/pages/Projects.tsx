
import AppSidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Search, Plus, Calendar, Users, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useState } from "react";

// Sample data - would come from API in real app
const mockProjects = [
  { 
    id: 1, 
    name: "Website Redesign", 
    description: "Overhaul the company website with modern design and improved UX",
    progress: 75, 
    tasks: { total: 12, completed: 9 },
    team: [
      { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
      { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
      { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg" }
    ],
    deadline: "2023-09-30",
    status: "In Progress",
    type: "Design"
  },
  { 
    id: 2, 
    name: "Mobile App Development", 
    description: "Create a cross-platform mobile app for customer engagement",
    progress: 45, 
    tasks: { total: 20, completed: 9 },
    team: [
      { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg" },
      { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg" }
    ],
    deadline: "2023-11-15",
    status: "In Progress",
    type: "Development"
  },
  { 
    id: 3, 
    name: "Marketing Campaign", 
    description: "Q3 marketing initiative for product launch",
    progress: 90, 
    tasks: { total: 8, completed: 7 },
    team: [
      { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
      { id: 5, name: "Alex Thompson", avatar: "/avatar5.jpg" }
    ],
    deadline: "2023-08-25",
    status: "Almost Complete",
    type: "Marketing"
  },
  { 
    id: 4, 
    name: "Data Migration", 
    description: "Move company data to new cloud infrastructure",
    progress: 30, 
    tasks: { total: 15, completed: 4 },
    team: [
      { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
      { id: 6, name: "Emily Chen", avatar: "/avatar6.jpg" }
    ],
    deadline: "2023-10-15",
    status: "In Progress",
    type: "IT"
  },
  { 
    id: 5, 
    name: "Customer Support Portal", 
    description: "Build a new support ticketing and knowledge base system",
    progress: 10, 
    tasks: { total: 18, completed: 2 },
    team: [
      { id: 3, name: "Mike Johnson", avatar: "/avatar3.jpg" },
      { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg" },
      { id: 6, name: "Emily Chen", avatar: "/avatar6.jpg" }
    ],
    deadline: "2023-12-01",
    status: "Just Started",
    type: "Development"
  },
  { 
    id: 6, 
    name: "HR Policy Update", 
    description: "Review and update company HR policies and documentation",
    progress: 60, 
    tasks: { total: 10, completed: 6 },
    team: [
      { id: 4, name: "Sarah Williams", avatar: "/avatar4.jpg" },
      { id: 7, name: "David Wilson", avatar: "/avatar7.jpg" }
    ],
    deadline: "2023-09-15",
    status: "In Progress",
    type: "HR"
  },
];

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Just Started":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Almost Complete":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
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
          <h1 className="text-xl font-semibold">Projects</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
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
              <Tabs defaultValue="all" className="space-y-6">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Projects</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="my">My Projects</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map(project => (
                      <motion.div
                        key={project.id}
                        variants={fadeInUp}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="h-full flex flex-col">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{project.name}</CardTitle>
                                <CardDescription className="mt-1">{project.description}</CardDescription>
                              </div>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                              
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                  <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex -space-x-2">
                                  {project.team.map((member, index) => (
                                    <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {project.team.length > 3 && (
                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                      +{project.team.length - 3}
                                    </div>
                                  )}
                                </div>
                                <Badge variant="outline">{project.type}</Badge>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button variant="ghost" className="w-full" size="sm">
                              View Details
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects
                      .filter(p => p.status !== "Completed")
                      .map(project => (
                        <motion.div
                          key={project.id}
                          variants={fadeInUp}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-full flex flex-col">
                            {/* Same card content as above */}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-xl">{project.name}</CardTitle>
                                  <CardDescription className="mt-1">{project.description}</CardDescription>
                                </div>
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-2" />
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex -space-x-2">
                                    {project.team.map((member) => (
                                      <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {project.team.length > 3 && (
                                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                        +{project.team.length - 3}
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="outline">{project.type}</Badge>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button variant="ghost" className="w-full" size="sm">
                                View Details
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects
                      .filter(p => p.status === "Completed")
                      .map(project => (
                        <motion.div
                          key={project.id}
                          variants={fadeInUp}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-full flex flex-col">
                            {/* Same card content as above */}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-xl">{project.name}</CardTitle>
                                  <CardDescription className="mt-1">{project.description}</CardDescription>
                                </div>
                                <Badge className="bg-gray-100 text-gray-700">
                                  Completed
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>100%</span>
                                  </div>
                                  <Progress value={100} className="h-2" />
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.tasks.total}/{project.tasks.total} tasks</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex -space-x-2">
                                    {project.team.map((member) => (
                                      <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  <Badge variant="outline">{project.type}</Badge>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button variant="ghost" className="w-full" size="sm">
                                View Details
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="my" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects
                      .filter((_, index) => index % 2 === 0) // Just for demo
                      .map(project => (
                        <motion.div
                          key={project.id}
                          variants={fadeInUp}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-full flex flex-col">
                            {/* Same card content as above */}
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-xl">{project.name}</CardTitle>
                                  <CardDescription className="mt-1">{project.description}</CardDescription>
                                </div>
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-2" />
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex -space-x-2">
                                    {project.team.map((member) => (
                                      <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                  </div>
                                  <Badge variant="outline">{project.type}</Badge>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button variant="ghost" className="w-full" size="sm">
                                View Details
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
