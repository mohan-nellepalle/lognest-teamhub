
import AppSidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Calendar, BarChart, PieChart, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Sample data - would come from API in real app
const teamPerformanceData = [
  { name: 'Team A', hours: 145 },
  { name: 'Team B', hours: 120 },
  { name: 'Team C', hours: 135 },
  { name: 'Team D', hours: 90 },
];

const projectProgressData = [
  { name: 'Website Redesign', completed: 75, remaining: 25 },
  { name: 'Mobile App', completed: 60, remaining: 40 },
  { name: 'Marketing Campaign', completed: 90, remaining: 10 },
  { name: 'DevOps Improvement', completed: 45, remaining: 55 },
];

const weeklyHoursData = [
  { day: 'Mon', hours: 42 },
  { day: 'Tue', hours: 45 },
  { day: 'Wed', hours: 40 },
  { day: 'Thu', hours: 46 },
  { day: 'Fri', hours: 38 },
];

const taskCompletionData = [
  { name: 'Completed', value: 72, color: '#10b981' },
  { name: 'In Progress', value: 18, color: '#3b82f6' },
  { name: 'Delayed', value: 10, color: '#ef4444' },
];

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

const ReportsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [reportType, setReportType] = useState("overview");
  
  const isAdmin = user?.role === "admin" || user?.role === "hr";
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">Reports</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
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
                defaultValue="overview" 
                value={reportType}
                onValueChange={setReportType}
                className="space-y-6"
              >
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team Performance</TabsTrigger>
                  <TabsTrigger value="project">Project Progress</TabsTrigger>
                  {isAdmin && <TabsTrigger value="custom">Custom Reports</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-primary" />
                            Weekly Hours
                          </CardTitle>
                          <CardDescription>Hours worked across all teams</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart
                                data={weeklyHoursData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="hours" fill="#3b82f6" name="Hours" />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            Task Completion
                          </CardTitle>
                          <CardDescription>Status of all tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={taskCompletionData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {taskCompletionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </TabsContent>
                
                <TabsContent value="team" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Team Performance
                      </CardTitle>
                      <CardDescription>Productivity metrics by team</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={teamPerformanceData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="hours" fill="#10b981" name="Hours Worked" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="project" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Project Progress
                      </CardTitle>
                      <CardDescription>Status of ongoing projects</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={projectProgressData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed %" />
                            <Bar dataKey="remaining" stackId="a" fill="#f3f4f6" name="Remaining %" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {isAdmin && (
                  <TabsContent value="custom" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Reports</CardTitle>
                        <CardDescription>Generate reports with custom parameters</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Report Type</label>
                              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                <option>Time Tracking</option>
                                <option>Project Status</option>
                                <option>Team Performance</option>
                                <option>Individual Performance</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Date Range</label>
                              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Custom Range</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Group By</label>
                              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                <option>Day</option>
                                <option>Week</option>
                                <option>Month</option>
                                <option>Team</option>
                                <option>Project</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button>Generate Report</Button>
                          </div>
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

export default ReportsPage;
