
import express, { Request, Response } from 'express';
import { Task } from '../../../services/models';
import { protect } from '../middleware/auth';

const router = express.Router();

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const { projectId, assignedTo, status } = req.query;
    
    let query: any = {};
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    if (status) {
      query.status = status;
    }
    
    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      status, 
      priority, 
      projectId, 
      assignedTo, 
      dueDate, 
      estimatedHours 
    } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      priority: priority || 'Medium',
      projectId,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours: 0,
      createdBy: req.user._id,
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Allow update if user is admin, task creator, or the task is assigned to them
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    
    if (!isAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    const { 
      title, 
      description, 
      status, 
      priority, 
      assignedTo, 
      dueDate, 
      estimatedHours,
      actualHours 
    } = req.body;
    
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.estimatedHours = estimatedHours !== undefined ? estimatedHours : task.estimatedHours;
    task.actualHours = actualHours !== undefined ? actualHours : task.actualHours;
    
    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    
    res.json(populatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Allow delete if user is admin or task creator
    const isAdmin = req.user.role === 'admin';
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await task.deleteOne();
    
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
