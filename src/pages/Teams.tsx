
import AppSidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Users, BarChart3, Mail, PhoneCall } from "lucide-react";
import { useState } from "react";

// Sample data - would come from API in real app
const mockTeamMembers = [
  { id: 1, name: "John Doe", role: "Frontend Developer", department: "Engineering", email: "john@example.com", phone: "+1 (555) 123-4567", avatar: "/avatar1.jpg", projects: 4, tasks: { completed: 15, total: 20 }, hoursLogged: 37 },
  { id: 2, name: "Jane Smith", role: "UI/UX Designer", department: "Design", email: "jane@example.com", phone: "+1 (555) 234-5678", avatar: "/avatar2.jpg", projects: 3, tasks: { completed: 12, total: 15 }, hoursLogged: 32 },
  { id: 3, name: "Mike Johnson", role: "Backend Developer", department: "Engineering", email: "mike@example.com", phone: "+1 (555) 345-6789", avatar: "/avatar3.jpg", projects: 2, tasks: { completed: 18, total: 22 }, hoursLogged: 40 },
  { id: 4, name: "Sarah Williams", role: "Project Manager", department: "Management", email: "sarah@example.com", phone: "+1 (555) 456-7890", avatar: "/avatar4.jpg", projects: 6, tasks: { completed: 8, total: 10 }, hoursLogged: 35 },
  { id: 5, name: "David Wilson", role: "DevOps Engineer", department: "Engineering", email: "david@example.com", phone: "+1 (555) 567-8901", avatar: "/avatar5.jpg", projects: 2, tasks: { completed: 10, total: 12 }, hoursLogged: 38 },
  { id: 6, name: "Emily Chen", role: "QA Specialist", department: "Engineering", email: "emily@example.com", phone: "+1 (555) 678-9012", avatar: "/avatar6.jpg", projects: 3, tasks: { completed: 22, total: 25 }, hoursLogged: 42 },
  { id: 7, name: "Robert Taylor", role: "Marketing Specialist", department: "Marketing", email: "robert@example.com", phone: "+1 (555) 789-0123", avatar: "/avatar7.jpg", projects: 2, tasks: { completed: 14, total: 18 }, hoursLogged: 36 },
  { id: 8, name: "Lisa Brown", role: "HR Manager", department: "Human Resources", email: "lisa@example.com", phone: "+1 (555) 890-1234", avatar: "/avatar8.jpg", projects: 1, tasks: { completed: 6, total: 8 }, hoursLogged: 30 },
];

// Sample departments
const departments = [
  "All Departments",
  "Engineering",
  "Design", 
  "Management",
  "Marketing",
  "Human Resources"
];

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "All Departments" || 
      member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
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
          <h1 className="text-xl font-semibold">Team Members</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search team members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
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
              <Tabs defaultValue="grid" className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <Badge 
                        key={dept} 
                        variant={selectedDepartment === dept ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedDepartment(dept)}
                      >
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <TabsContent value="grid" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMembers.map(member => (
                      <motion.div
                        key={member.id}
                        variants={fadeInUp}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="h-full">
                          <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                              <Avatar className="h-20 w-20">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <CardTitle>{member.name}</CardTitle>
                            <CardDescription className="flex flex-col items-center gap-1">
                              <span>{member.role}</span>
                              <Badge variant="outline">{member.department}</Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{member.phone}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                                <div className="space-y-1">
                                  <span className="text-2xl font-semibold">{member.projects}</span>
                                  <p className="text-xs text-muted-foreground">Projects</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-2xl font-semibold">{member.tasks.completed}</span>
                                  <p className="text-xs text-muted-foreground">Tasks</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-2xl font-semibold">{member.hoursLogged}</span>
                                  <p className="text-xs text-muted-foreground">Hours</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="space-y-4">
                  <div className="rounded-lg border overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 grid grid-cols-12 gap-4 font-medium text-sm">
                      <div className="col-span-3">Name</div>
                      <div className="col-span-2">Department</div>
                      <div className="col-span-3">Contact</div>
                      <div className="col-span-4">Performance</div>
                    </div>
                    
                    {filteredMembers.map((member, index) => (
                      <motion.div 
                        key={member.id}
                        variants={fadeInUp}
                        className={`px-4 py-3 grid grid-cols-12 gap-4 items-center ${
                          index !== filteredMembers.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <Badge variant="outline">{member.department}</Badge>
                        </div>
                        
                        <div className="col-span-3 text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground truncate">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneCall className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{member.phone}</span>
                          </div>
                        </div>
                        
                        <div className="col-span-4 grid grid-cols-3 gap-2 text-center">
                          <div className="flex flex-col">
                            <span className="font-semibold">{member.projects}</span>
                            <span className="text-xs text-muted-foreground">Projects</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">{member.tasks.completed}/{member.tasks.total}</span>
                            <span className="text-xs text-muted-foreground">Tasks</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">{member.hoursLogged}h</span>
                            <span className="text-xs text-muted-foreground">Logged</span>
                          </div>
                        </div>
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

export default TeamsPage;
