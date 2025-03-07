
import { useQuery, useMutation, QueryClient, QueryKey } from '@tanstack/react-query';
import * as api from '../services/api';

// QueryClient for manually invalidating queries
const queryClient = new QueryClient();

export const useApi = () => {
  // Teams
  const useTeams = () => useQuery({ 
    queryKey: ['teams'], 
    queryFn: api.teamService.getTeams 
  });
  
  const useTeam = (id: number) => useQuery({
    queryKey: ['teams', id],
    queryFn: () => api.teamService.getTeamById(id),
    enabled: !!id,
  });
  
  const useCreateTeam = () => useMutation({
    mutationFn: api.teamService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
  
  const useUpdateTeam = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.teamService.updateTeam(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
    },
  });
  
  const useDeleteTeam = () => useMutation({
    mutationFn: api.teamService.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
  
  // Projects
  const useProjects = () => useQuery({ 
    queryKey: ['projects'], 
    queryFn: api.projectService.getProjects 
  });
  
  const useProject = (id: number) => useQuery({
    queryKey: ['projects', id],
    queryFn: () => api.projectService.getProjectById(id),
    enabled: !!id,
  });
  
  const useCreateProject = () => useMutation({
    mutationFn: api.projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  
  const useUpdateProject = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.projectService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
  
  const useDeleteProject = () => useMutation({
    mutationFn: api.projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  
  // Tasks
  const useTasks = () => useQuery({ 
    queryKey: ['tasks'], 
    queryFn: api.taskService.getTasks 
  });
  
  const useTask = (id: number) => useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.taskService.getTaskById(id),
    enabled: !!id,
  });
  
  const useCreateTask = () => useMutation({
    mutationFn: api.taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  const useUpdateTask = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.taskService.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
  
  const useDeleteTask = () => useMutation({
    mutationFn: api.taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  // Work Logs
  const useWorkLogs = () => useQuery({ 
    queryKey: ['workLogs'], 
    queryFn: api.workLogService.getWorkLogs 
  });
  
  const useCreateWorkLog = () => useMutation({
    mutationFn: api.workLogService.createWorkLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
  
  const useUpdateWorkLog = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.workLogService.updateWorkLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
  
  const useDeleteWorkLog = () => useMutation({
    mutationFn: api.workLogService.deleteWorkLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
  });
  
  // Users
  const useUsers = () => useQuery({ 
    queryKey: ['users'], 
    queryFn: api.userService.getUsers 
  });
  
  const useUser = (id: number) => useQuery({
    queryKey: ['users', id],
    queryFn: () => api.userService.getUserById(id),
    enabled: !!id,
  });
  
  // Reports
  const useReportData = (reportType: string, params: any = {}) => useQuery({
    queryKey: ['reports', reportType, params],
    queryFn: () => api.reportService.getReportData(reportType, params),
  });
  
  const useGenerateCustomReport = () => useMutation({
    mutationFn: api.reportService.generateCustomReport,
  });
  
  // Helper to invalidate queries
  const invalidateQuery = (queryKey: QueryKey) => {
    queryClient.invalidateQueries({ queryKey });
  };
  
  return {
    // Teams
    useTeams,
    useTeam,
    useCreateTeam,
    useUpdateTeam,
    useDeleteTeam,
    
    // Projects
    useProjects,
    useProject,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    
    // Tasks
    useTasks,
    useTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    
    // Work Logs
    useWorkLogs,
    useCreateWorkLog,
    useUpdateWorkLog,
    useDeleteWorkLog,
    
    // Users
    useUsers,
    useUser,
    
    // Reports
    useReportData,
    useGenerateCustomReport,
    
    // Util
    invalidateQuery,
  };
};

export default useApi;
