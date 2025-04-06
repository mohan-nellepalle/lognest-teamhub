import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workLogService, userService } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import AppSidebar from '@/components/Sidebar';
// Update this import 

const UserDetails = () => {
  const { userId } = useParams();
  const [timesheets, setTimesheets] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchUserDetails = async () => {
    try {
      const response = await userService.getUsers();
      const userData = response.data.find(u => u._id === userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  // Update the fetchUserTimesheets function
  const fetchUserTimesheets = async () => {
    try {
      const response = await workLogService.getUserWorkLogs(userId);
      if (response.success) {
        console.log("User timesheets:", response.data);
        setTimesheets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user timesheets:', error);
      setTimesheets([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      fetchUserTimesheets();
    }
  }, [userId]);

  const filterTimesheets = () => {
    if (!timesheets) return [];
    
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

    return timesheets.filter(log => {
      const logDate = new Date(log.date).setHours(0, 0, 0, 0);
      switch (filter) {
        case 'today':
          return logDate === today;
        case 'yesterday':
          return logDate === yesterday;
        default:
          return true;
      }
    });
  };

  return (
    
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {user && (
              <Card className="mb-6">
                <CardHeader className="flex flex-col md:flex-row items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <CardTitle className="text-xl md:text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </CardHeader>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Timesheets</CardTitle>
                <Tabs value={filter} onValueChange={setFilter} className="w-full overflow-x-auto">
                  <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="all">All Time</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterTimesheets().map((log) => (
                    <div key={log._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                      <div className="mb-2 md:mb-0">
                        <p className="font-medium">{log.description || 'No description'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{log.timeSpent} hours</span>
                      </div>
                    </div>
                  ))}
                  {filterTimesheets().length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No timesheet entries found for this period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
   
  );
};

export default UserDetails;