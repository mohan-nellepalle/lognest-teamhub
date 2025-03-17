
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Project, Task, Team, WorkLog } from '../../../services/models';
import connectDB from '../../db/connection';

dotenv.config();

// Sample data for seeding
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    avatar: '/avatar-admin.jpg',
  },
  {
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee',
    avatar: '/avatar-employee.jpg',
  },
  {
    name: 'HR User',
    email: 'hr@example.com',
    password: 'hr123',
    role: 'hr',
    avatar: '/avatar-hr.jpg',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'employee',
    avatar: '/avatar1.jpg',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'employee',
    avatar: '/avatar2.jpg',
  },
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear all existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Team.deleteMany({});
    await WorkLog.deleteMany({});
    
    console.log('Data cleared');
    
    // Import users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users imported`);
    
    const adminUser = createdUsers[0]._id;
    const employee1 = createdUsers[3]._id;
    const employee2 = createdUsers[4]._id;
    
    // Create teams
    const teams = [
      {
        name: 'Frontend Team',
        description: 'Responsible for all user-facing components',
        leader: employee1,
        members: [employee1, employee2],
      },
      {
        name: 'Backend Team',
        description: 'Handles server-side logic and database',
        leader: employee2,
        members: [employee2, employee1],
      },
    ];
    
    const createdTeams = await Team.insertMany(teams);
    console.log(`${createdTeams.length} teams imported`);
    
    // Create projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        status: 'In Progress',
        type: 'Development',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        progress: 65,
        team: [createdUsers[3]._id, createdUsers[4]._id],
        createdBy: adminUser,
      },
      {
        name: 'Mobile App Development',
        description: 'Develop a new mobile app for customer engagement',
        status: 'Planning',
        type: 'Development',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        progress: 20,
        team: [createdUsers[3]._id],
        createdBy: adminUser,
      },
    ];
    
    const createdProjects = await Project.insertMany(projects);
    console.log(`${createdProjects.length} projects imported`);
    
    // Create tasks
    const tasks = [
      {
        title: 'Design homepage',
        description: 'Create a modern and responsive design for the new homepage',
        status: 'Completed',
        priority: 'High',
        projectId: createdProjects[0]._id,
        assignedTo: createdUsers[3]._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        estimatedHours: 20,
        actualHours: 22,
        createdBy: adminUser,
      },
      {
        title: 'Implement navigation',
        description: 'Create responsive navigation menu for the website',
        status: 'In Progress',
        priority: 'Medium',
        projectId: createdProjects[0]._id,
        assignedTo: createdUsers[4]._id,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        estimatedHours: 15,
        actualHours: 8,
        createdBy: adminUser,
      },
      {
        title: 'Setup API endpoints',
        description: 'Define and implement API endpoints for the mobile app',
        status: 'To Do',
        priority: 'High',
        projectId: createdProjects[1]._id,
        assignedTo: createdUsers[3]._id,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        estimatedHours: 30,
        actualHours: 0,
        createdBy: adminUser,
      },
    ];
    
    const createdTasks = await Task.insertMany(tasks);
    console.log(`${createdTasks.length} tasks imported`);
    
    // Create work logs
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const workLogs = [
      {
        userId: createdUsers[3]._id,
        taskId: createdTasks[0]._id,
        projectId: createdProjects[0]._id,
        description: 'Completed homepage design and got feedback',
        timeSpent: 8,
        date: yesterday,
      },
      {
        userId: createdUsers[3]._id,
        taskId: createdTasks[0]._id,
        projectId: createdProjects[0]._id,
        description: 'Finalized homepage design based on feedback',
        timeSpent: 6,
        date: today,
      },
      {
        userId: createdUsers[4]._id,
        taskId: createdTasks[1]._id,
        projectId: createdProjects[0]._id,
        description: 'Started implementing navigation component',
        timeSpent: 4,
        date: today,
      },
    ];
    
    const createdWorkLogs = await WorkLog.insertMany(workLogs);
    console.log(`${createdWorkLogs.length} work logs imported`);
    
    console.log('Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

// Run the import
importData();
