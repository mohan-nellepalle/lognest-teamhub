
import express from 'express';
import { WorkLog, Project, User, Team, Task } from '../../../services/models';
import { protect, admin, hr } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Get project performance report
// @route   GET /api/reports/projects
// @access  Private/Admin or HR
router.get('/projects', protect, hr, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {
        date: {
          ...(startDate && { $gte: new Date(startDate as string) }),
          ...(endDate && { $lte: new Date(endDate as string) }),
        },
      };
    }
    
    // Aggregate work logs by project
    const projectReport = await WorkLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$projectId',
          totalHours: { $sum: '$timeSpent' },
          logCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectDetails',
        },
      },
      { $unwind: '$projectDetails' },
      {
        $project: {
          _id: 1,
          projectName: '$projectDetails.name',
          projectStatus: '$projectDetails.status',
          totalHours: 1,
          logCount: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);
    
    res.json(projectReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user performance report
// @route   GET /api/reports/users
// @access  Private/Admin or HR
router.get('/users', protect, hr, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {
        date: {
          ...(startDate && { $gte: new Date(startDate as string) }),
          ...(endDate && { $lte: new Date(endDate as string) }),
        },
      };
    }
    
    // Aggregate work logs by user
    const userReport = await WorkLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          totalHours: { $sum: '$timeSpent' },
          logCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          userName: '$userDetails.name',
          userRole: '$userDetails.role',
          totalHours: 1,
          logCount: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);
    
    res.json(userReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get team performance report
// @route   GET /api/reports/teams
// @access  Private/Admin or HR
router.get('/teams', protect, hr, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get all teams with members
    const teams = await Team.find({}).populate('members');
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {
        date: {
          ...(startDate && { $gte: new Date(startDate as string) }),
          ...(endDate && { $lte: new Date(endDate as string) }),
        },
      };
    }
    
    // For each team, get work logs for all members
    const teamReports = await Promise.all(
      teams.map(async (team) => {
        const memberIds = team.members.map(member => member._id);
        
        const teamWorkLogs = await WorkLog.aggregate([
          {
            $match: {
              userId: { $in: memberIds.map(id => new mongoose.Types.ObjectId(id)) },
              ...dateFilter,
            },
          },
          {
            $group: {
              _id: null,
              totalHours: { $sum: '$timeSpent' },
              logCount: { $sum: 1 },
            },
          },
        ]);
        
        return {
          _id: team._id,
          teamName: team.name,
          memberCount: team.members.length,
          totalHours: teamWorkLogs[0]?.totalHours || 0,
          logCount: teamWorkLogs[0]?.logCount || 0,
        };
      })
    );
    
    res.json(teamReports.sort((a, b) => b.totalHours - a.totalHours));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get time distribution report (by day, week, month)
// @route   GET /api/reports/time
// @access  Private/Admin or HR
router.get('/time', protect, hr, async (req, res) => {
  try {
    const { type, userId, startDate, endDate } = req.query;
    
    let timeFrame = '$dayOfWeek';
    let groupFormat = '%Y-%m-%d';
    
    if (type === 'week') {
      timeFrame = '$week';
      groupFormat = '%Y-W%V';
    } else if (type === 'month') {
      timeFrame = '$month';
      groupFormat = '%Y-%m';
    }
    
    let dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate as string);
      }
    }
    
    if (userId && userId !== 'all') {
      dateFilter.userId = new mongoose.Types.ObjectId(userId as string);
    }
    
    const timeReport = await WorkLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            timeFrame: { $dateToString: { format: groupFormat, date: '$date' } },
          },
          totalHours: { $sum: '$timeSpent' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          timeFrame: '$_id.timeFrame',
          totalHours: 1,
          count: 1,
        },
      },
      { $sort: { timeFrame: 1 } },
    ]);
    
    res.json(timeReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get custom report
// @route   POST /api/reports/custom
// @access  Private/Admin or HR
router.post('/custom', protect, hr, async (req, res) => {
  try {
    const { filters, groupBy, fields } = req.body;
    
    let match: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.userId) {
        match.userId = new mongoose.Types.ObjectId(filters.userId);
      }
      
      if (filters.projectId) {
        match.projectId = new mongoose.Types.ObjectId(filters.projectId);
      }
      
      if (filters.taskId) {
        match.taskId = new mongoose.Types.ObjectId(filters.taskId);
      }
      
      if (filters.startDate || filters.endDate) {
        match.date = {};
        if (filters.startDate) {
          match.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          match.date.$lte = new Date(filters.endDate);
        }
      }
    }
    
    let pipeline: any[] = [{ $match: match }];
    
    // Apply grouping
    if (groupBy) {
      let groupStage: any = {
        $group: {
          _id: {},
          totalHours: { $sum: '$timeSpent' },
          count: { $sum: 1 },
        },
      };
      
      if (groupBy.includes('user')) {
        groupStage.$group._id.userId = '$userId';
      }
      
      if (groupBy.includes('project')) {
        groupStage.$group._id.projectId = '$projectId';
      }
      
      if (groupBy.includes('task')) {
        groupStage.$group._id.taskId = '$taskId';
      }
      
      if (groupBy.includes('date')) {
        groupStage.$group._id.date = { 
          $dateToString: { format: '%Y-%m-%d', date: '$date' } 
        };
      }
      
      pipeline.push(groupStage);
      
      // Lookup related data
      if (groupBy.includes('user')) {
        pipeline.push({
          $lookup: {
            from: 'users',
            localField: '_id.userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        });
        pipeline.push({ $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } });
      }
      
      if (groupBy.includes('project')) {
        pipeline.push({
          $lookup: {
            from: 'projects',
            localField: '_id.projectId',
            foreignField: '_id',
            as: 'projectDetails',
          },
        });
        pipeline.push({ $unwind: { path: '$projectDetails', preserveNullAndEmptyArrays: true } });
      }
      
      if (groupBy.includes('task')) {
        pipeline.push({
          $lookup: {
            from: 'tasks',
            localField: '_id.taskId',
            foreignField: '_id',
            as: 'taskDetails',
          },
        });
        pipeline.push({ $unwind: { path: '$taskDetails', preserveNullAndEmptyArrays: true } });
      }
      
      // Project fields
      let projectStage: any = {
        $project: {
          _id: 0,
          totalHours: 1,
          count: 1,
        },
      };
      
      if (groupBy.includes('user')) {
        projectStage.$project.userId = '$_id.userId';
        projectStage.$project.userName = '$userDetails.name';
        projectStage.$project.userRole = '$userDetails.role';
      }
      
      if (groupBy.includes('project')) {
        projectStage.$project.projectId = '$_id.projectId';
        projectStage.$project.projectName = '$projectDetails.name';
        projectStage.$project.projectStatus = '$projectDetails.status';
      }
      
      if (groupBy.includes('task')) {
        projectStage.$project.taskId = '$_id.taskId';
        projectStage.$project.taskTitle = '$taskDetails.title';
        projectStage.$project.taskStatus = '$taskDetails.status';
      }
      
      if (groupBy.includes('date')) {
        projectStage.$project.date = '$_id.date';
      }
      
      pipeline.push(projectStage);
    }
    
    // Execute the aggregation
    const results = await WorkLog.aggregate(pipeline);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
