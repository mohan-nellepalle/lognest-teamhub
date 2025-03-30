import { toast } from "@/components/ui/use-toast";
import axios from "axios";

// Base API URL - would come from environment variables in a real app
const API_BASE_URL = "/api";

// Helper function for handling fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Fetch wrapper with authentication and error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Get stored user from localStorage for auth token
    const storedUser = localStorage.getItem("saavik_user");
    const token = storedUser ? JSON.parse(storedUser).token : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);

    // In a real app, you would use a more sophisticated error handling strategy
    if (error instanceof Error) {
      toast({
        title: "API Error",
        description: error.message,
        variant: "destructive",
      });
    }

    throw error;
  }
};

// Mock API implementation (in a real app, these would make actual HTTP requests)
// For now, we'll mock the requests with delays
const mockApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    // In a real app, this would call fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    // For now, we use the login function in AuthContext.tsx directly
    console.log("Simulated API login call with:", { email, password });
    return null;
  },

  logout: async () => {
    // In a real app, this would call fetchWithAuth('/auth/logout', { method: 'POST' });
    // For now, we use the logout function in AuthContext.tsx directly
    console.log("Simulated API logout call");
    return null;
  },
};

// Team service
export const teamService = {
  getTeams: async () => {
    // Simulate API call with mock data
    const teams = [
      {
        id: 1,
        name: "Frontend Team",
        members: 8,
        lead: "John Doe",
        projects: 4,
      },
      {
        id: 2,
        name: "Backend Team",
        members: 6,
        lead: "Jane Smith",
        projects: 3,
      },
      {
        id: 3,
        name: "Design Team",
        members: 4,
        lead: "Mike Johnson",
        projects: 5,
      },
      { id: 4, name: "QA Team", members: 3, lead: "Emily Chen", projects: 6 },
      {
        id: 5,
        name: "DevOps Team",
        members: 2,
        lead: "David Wilson",
        projects: 2,
      },
    ];

    return mockApiCall(teams);
  },

  getTeamById: async (id: number) => {
    // Simulate API call with mock data
    const team = {
      id,
      name: "Frontend Team",
      description:
        "Responsible for all user-facing interfaces and client-side logic",
      lead: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Team Lead",
      },
      members: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Team Lead",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Senior Developer",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "Developer",
        },
        {
          id: 4,
          name: "Emily Chen",
          email: "emily@example.com",
          role: "UI Designer",
        },
      ],
      projects: [
        { id: 1, name: "Website Redesign", status: "In Progress" },
        { id: 2, name: "Mobile App", status: "Planning" },
      ],
    };

    return mockApiCall(team);
  },

  createTeam: async (teamData: any) => {
    // Simulate API call
    console.log("Creating team:", teamData);
    return mockApiCall({ id: Date.now(), ...teamData });
  },

  updateTeam: async (id: number, teamData: any) => {
    // Simulate API call
    console.log("Updating team:", id, teamData);
    return mockApiCall({ id, ...teamData });
  },

  deleteTeam: async (id: number) => {
    // Simulate API call
    console.log("Deleting team:", id);
    return mockApiCall({ success: true });
  },
};

// Project service
export const projectService = {
  getProjects: async () => {
    // Simulate API call with mock data
    const projects = [
      {
        id: 1,
        name: "Website Redesign",
        team: "Frontend Team",
        status: "In Progress",
        completion: 65,
        deadline: "2023-12-15",
      },
      {
        id: 2,
        name: "Mobile App Development",
        team: "Mobile Team",
        status: "Planning",
        completion: 20,
        deadline: "2024-03-30",
      },
      {
        id: 3,
        name: "API Integration",
        team: "Backend Team",
        status: "On Hold",
        completion: 45,
        deadline: "2024-01-10",
      },
      {
        id: 4,
        name: "Marketing Campaign",
        team: "Marketing",
        status: "Completed",
        completion: 100,
        deadline: "2023-11-01",
      },
      {
        id: 5,
        name: "Database Migration",
        team: "DevOps Team",
        status: "In Progress",
        completion: 80,
        deadline: "2023-12-05",
      },
    ];

    return mockApiCall(projects);
  },

  getProjectById: async (id: number) => {
    // Simulate API call with mock data
    const project = {
      id,
      name: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design and improved UX",
      team: "Frontend Team",
      status: "In Progress",
      completion: 65,
      deadline: "2023-12-15",
      tasks: [
        {
          id: 1,
          name: "Design homepage",
          status: "Completed",
          assignee: "Emily Chen",
        },
        {
          id: 2,
          name: "Implement navigation",
          status: "In Progress",
          assignee: "John Doe",
        },
        {
          id: 3,
          name: "Optimize images",
          status: "Not Started",
          assignee: "Jane Smith",
        },
      ],
    };

    return mockApiCall(project);
  },

  createProject: async (projectData: any) => {
    // Simulate API call
    console.log("Creating project:", projectData);
    return mockApiCall({ id: Date.now(), ...projectData });
  },

  updateProject: async (id: number, projectData: any) => {
    // Simulate API call
    console.log("Updating project:", id, projectData);
    return mockApiCall({ id, ...projectData });
  },

  deleteProject: async (id: number) => {
    // Simulate API call
    console.log("Deleting project:", id);
    return mockApiCall({ success: true });
  },
};

// Task service
export const taskService = {
  getTasks: async () => {
    // Simulate API call with mock data
    const tasks = [
      {
        id: 1,
        title: "Design homepage",
        project: "Website Redesign",
        assignee: "Emily Chen",
        status: "Completed",
        priority: "High",
        dueDate: "2023-11-10",
      },
      {
        id: 2,
        title: "Implement navigation",
        project: "Website Redesign",
        assignee: "John Doe",
        status: "In Progress",
        priority: "Medium",
        dueDate: "2023-11-15",
      },
      {
        id: 3,
        title: "Set up API endpoints",
        project: "Mobile App Development",
        assignee: "Jane Smith",
        status: "In Progress",
        priority: "High",
        dueDate: "2023-11-20",
      },
      {
        id: 4,
        title: "Write test cases",
        project: "API Integration",
        assignee: "David Wilson",
        status: "Not Started",
        priority: "Low",
        dueDate: "2023-11-30",
      },
      {
        id: 5,
        title: "Deploy to staging",
        project: "Database Migration",
        assignee: "Mike Johnson",
        status: "Not Started",
        priority: "Medium",
        dueDate: "2023-12-01",
      },
    ];

    return mockApiCall(tasks);
  },

  getTaskById: async (id: number) => {
    // Simulate API call with mock data
    const task = {
      id,
      title: "Design homepage",
      description:
        "Create a modern and responsive design for the new company homepage",
      project: "Website Redesign",
      assignee: { id: 4, name: "Emily Chen", email: "emily@example.com" },
      status: "Completed",
      priority: "High",
      dueDate: "2023-11-10",
      createdBy: { id: 1, name: "John Doe", email: "john@example.com" },
      createdAt: "2023-10-15T10:30:00Z",
      comments: [
        {
          id: 1,
          user: "John Doe",
          text: "Please make sure it works on mobile too",
          timestamp: "2023-10-16T09:15:00Z",
        },
        {
          id: 2,
          user: "Emily Chen",
          text: "Design completed and ready for review",
          timestamp: "2023-10-18T14:22:00Z",
        },
      ],
    };

    return mockApiCall(task);
  },

  createTask: async (taskData: any) => {
    // Simulate API call
    console.log("Creating task:", taskData);
    return mockApiCall({ id: Date.now(), ...taskData });
  },

  updateTask: async (id: number, taskData: any) => {
    // Simulate API call
    console.log("Updating task:", id, taskData);
    return mockApiCall({ id, ...taskData });
  },

  deleteTask: async (id: number) => {
    // Simulate API call
    console.log("Deleting task:", id);
    return mockApiCall({ success: true });
  },
};

// Work logs service
export const workLogService = {
  // ✅ Fetch all work logs from backend API
  getWorkLogs: async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/worklogs/getWorkLogs`
      );
      return response.data; // Return the data from API
    } catch (error) {
      console.error("Error fetching work logs:", error);
      throw error;
    }
  },

  // ✅ Create a new work log
  createWorkLog: async (workLogData: any) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/worklogs/createWorklog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workLogData),
        }
      );
    } catch (error) {
      console.error("Error creating work log:", error);
      throw error;
    }
  },

  // ✅ Update an existing work log
  updateWorkLog: async (id, workLogData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/worklogs/updateWorkLog/${id}`,
        workLogData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating work log:", error);
      throw error;
    }
  },

  // ✅ Delete a work log by ID
  deleteWorkLog: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/deleteWorkLog/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting work log:", error);
      throw error;
    }
  },
};

// User service for managing users/employees
export const userService = {
  getUsers: async () => {
    // Simulate API call with mock data
    const users = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        department: "Engineering",
        avatar: "/avatar-admin.jpg",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "employee",
        department: "Design",
        avatar: "/avatar-employee.jpg",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "employee",
        department: "Engineering",
        avatar: "/avatar3.jpg",
      },
      {
        id: 4,
        name: "Emily Chen",
        email: "emily@example.com",
        role: "employee",
        department: "Design",
        avatar: "/avatar4.jpg",
      },
      {
        id: 5,
        name: "David Wilson",
        email: "david@example.com",
        role: "hr",
        department: "Human Resources",
        avatar: "/avatar-hr.jpg",
      },
    ];

    return mockApiCall(users);
  },

  getUserById: async (id: number) => {
    // Simulate API call with mock data
    const user = {
      id,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      department: "Engineering",
      avatar: "/avatar-admin.jpg",
      position: "Senior Developer",
      joinDate: "2022-03-15",
      skills: ["React", "TypeScript", "Node.js"],
      bio: "Experienced web developer with a focus on frontend technologies.",
      contact: {
        phone: "555-123-4567",
        address: "123 Main St, City, Country",
      },
    };

    return mockApiCall(user);
  },

  createUser: async (userData: any) => {
    // Simulate API call
    console.log("Creating user:", userData);
    return mockApiCall({ id: Date.now(), ...userData });
  },

  updateUser: async (id: number, userData: any) => {
    // Simulate API call
    console.log("Updating user:", id, userData);
    return mockApiCall({ id, ...userData });
  },

  deleteUser: async (id: number) => {
    // Simulate API call
    console.log("Deleting user:", id);
    return mockApiCall({ success: true });
  },
};

// Report service
export const reportService = {
  getReportData: async (reportType: string, params: any = {}) => {
    // Simulate API call
    console.log("Fetching report data:", reportType, params);

    // Mock different report types
    let data;
    switch (reportType) {
      case "team-performance":
        data = [
          { name: "Team A", hours: 145 },
          { name: "Team B", hours: 120 },
          { name: "Team C", hours: 135 },
          { name: "Team D", hours: 90 },
        ];
        break;

      case "project-progress":
        data = [
          { name: "Website Redesign", completed: 75, remaining: 25 },
          { name: "Mobile App", completed: 60, remaining: 40 },
          { name: "Marketing Campaign", completed: 90, remaining: 10 },
          { name: "DevOps Improvement", completed: 45, remaining: 55 },
        ];
        break;

      case "weekly-hours":
        data = [
          { day: "Mon", hours: 42 },
          { day: "Tue", hours: 45 },
          { day: "Wed", hours: 40 },
          { day: "Thu", hours: 46 },
          { day: "Fri", hours: 38 },
        ];
        break;

      default:
        data = [];
    }

    return mockApiCall(data);
  },

  generateCustomReport: async (params: any) => {
    // Simulate API call for custom report generation
    console.log("Generating custom report with params:", params);
    return mockApiCall({
      id: Date.now(),
      name: `Report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      params,
      downloadUrl: "#",
    });
  },
};

// Export all services
export default {
  auth: authService,
  teams: teamService,
  projects: projectService,
  tasks: taskService,
  workLogs: workLogService,
  users: userService,
  reports: reportService,
};
