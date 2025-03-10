
import express, { Request, Response } from 'express';
import { WorkLog, Task } from '../../models';
import { protect } from '../middleware/auth';

const router = express.Router();

// @desc    Get all work logs
// @route   GET /api/worklogs
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const { userId, taskId, projectId, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Filter by user ID (or current user if not admin)
    if (userId && (req.user.role === 'admin' || req.user.role === 'hr')) {
      query.userId = userId;
    } else {
      // Regular employees can only see their own work logs
      query.userId = req.user._id;
    }
    
    if (taskId) {
      query.taskId = taskId;
    }
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }
    
    const workLogs = await WorkLog.find(query)
      .populate('userId', 'name')
      .populate('taskId', 'title')
      .populate('projectId', 'name')
      .sort({ date: -1 });
    
    res.json(workLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get work log by ID
// @route   GET /api/worklogs/:id
// @access  Private
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const workLog = await WorkLog.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('taskId', 'title')
      .populate('projectId', 'name');
    
    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found' });
    }
    
    // Check if user is authorized to view this work log
    const isAdmin = req.user.role === 'admin';
    const isHR = req.user.role === 'hr';
    const isOwner = workLog.userId._id.toString() === req.user._id.toString();
    
    if (!isAdmin && !isHR && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to view this work log' });
    }
    
    res.json(workLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a work log
// @route   POST /api/worklogs
// @access  Private
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const { taskId, description, timeSpent, date } = req.body;
    
    // Validate the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const workLog = await WorkLog.create({
      userId: req.user._id,
      taskId,
      projectId: task.projectId,
      description,
      timeSpent,
      date: date || new Date(),
    });
    
    // Update task actual hours
    task.actualHours = (task.actualHours || 0) + timeSpent;
    await task.save();
    
    const populatedWorkLog = await WorkLog.findById(workLog._id)
      .populate('userId', 'name')
      .populate('taskId', 'title')
      .populate('projectId', 'name');
    
    res.status(201).json(populatedWorkLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a work log
// @route   PUT /api/worklogs/:id
// @access  Private
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const workLog = await WorkLog.findById(req.params.id);
    
    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found' });
    }
    
    // Only allow the creator or admin to update
    if (workLog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this work log' });
    }
    
    const { description, timeSpent, date } = req.body;
    
    // If time spent is changing, we need to update the task's actual hours
    if (timeSpent !== undefined && timeSpent !== workLog.timeSpent) {
      const task = await Task.findById(workLog.taskId);
      if (task) {
        // Subtract old time and add new time
        task.actualHours = (task.actualHours || 0) - workLog.timeSpent + timeSpent;
        await task.save();
      }
    }
    
    workLog.description = description || workLog.description;
    workLog.timeSpent = timeSpent !== undefined ? timeSpent : workLog.timeSpent;
    workLog.date = date || workLog.date;
    
    const updatedWorkLog = await workLog.save();
    
    const populatedWorkLog = await WorkLog.findById(updatedWorkLog._id)
      .populate('userId', 'name')
      .populate('taskId', 'title')
      .populate('projectId', 'name');
    
    res.json(populatedWorkLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a work log
// @route   DELETE /api/worklogs/:id
// @access  Private
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const workLog = await WorkLog.findById(req.params.id);
    
    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found' });
    }
    
    // Only allow the creator or admin to delete
    if (workLog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this work log' });
    }
    
    // Update task actual hours
    const task = await Task.findById(workLog.taskId);
    if (task) {
      task.actualHours = Math.max(0, (task.actualHours || 0) - workLog.timeSpent);
      await task.save();
    }
    
    await workLog.deleteOne();
    
    res.json({ message: 'Work log removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
