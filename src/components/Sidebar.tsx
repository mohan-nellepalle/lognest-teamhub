
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin", "employee", "hr"],
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FileText className="h-5 w-5" />,
      roles: ["admin", "employee", "hr"],
    },
    {
      name: "Teams",
      path: "/teams",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin", "hr"],
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["admin", "employee", "hr"],
    },
    {
      name: "Work Logs",
      path: "/work-logs",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["admin", "employee", "hr"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin", "hr"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex h-14 items-center px-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white">
            W
          </div>
          <span>WorkLog</span>
        </Link>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="mb-4 px-4 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
