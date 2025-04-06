import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppSidebar from "@/components/Sidebar";
import { userService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const AddEmployee = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return false;
    }
    if (!formData.password) {
      toast({ title: "Error", description: "Password is required", variant: "destructive" });
      return false;
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      toast({ 
        title: "Error", 
        description: "Password must contain at least 8 characters, one uppercase letter, one number, and one special character",
        variant: "destructive" 
      });
      return false;
    }
    if (!formData.role) {
      toast({ title: "Error", description: "Please select a role", variant: "destructive" });
      return false;
    }
    return true;
  };

  // Add function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase()
      };

      const response = await userService.registerUser(payload);
      if (response.success) {
        toast({
          title: "Success",
          description: `${formData.name} has been successfully registered as ${formData.role}`,
          variant: "default",
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
        // Refresh the users list
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Add New Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role">Role</label>
                  <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Employee</Button>
              </form>
            </CardContent>
          </Card>
          {/* Add Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {users.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm capitalize bg-primary/10 text-primary px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No users registered yet
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

export default AddEmployee;