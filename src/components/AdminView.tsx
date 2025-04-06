import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar } from "lucide-react";
import { workLogService } from "@/services/api";

type WorkLog = {
  _id: string;
  userId: {
    _id: string;  // Added _id to userId type
    name: string;
    role: string;
    avatar?: string;
  };
  timeSpent: number;
  date: string;
  description: string;
  taskId: string;
};

const AdminView = () => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllWorkLogs = async () => {
    try {
      const response = await workLogService.getAllWorkLogs();
      setWorkLogs(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch work logs:", error);
      setWorkLogs([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWorkLogs();
  }, []);

  if (loading) {
    return <div>Loading work logs...</div>;
  }

  // Group logs by user
  // Updated groupedLogs reducer
  const groupedLogs = workLogs.reduce((acc, log) => {
    if (!log.userId) return acc;
    
    const userId = log.userId._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: log.userId,
        logs: []
      };
    }
    acc[userId].logs.push(log);
    return acc;
  }, {} as Record<string, { user: WorkLog['userId']; logs: WorkLog[] }>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Work Logs</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedLogs).map(([userId, { user, logs }]) => (
          <Card key={userId} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3 rounded-lg bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{log.timeSpent} hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm">{log.description}</p>
                    {log.taskId && (
                      <div className="text-xs text-muted-foreground">
                        Task ID: {log.taskId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminView;