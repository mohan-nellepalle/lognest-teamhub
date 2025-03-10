
import express, { Request, Response } from 'express';
import { Project, Task } from '../../models';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({})
      .populate('team', 'name')
      .populate('createdBy', 'name');
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team', 'name email')
      .populate('createdBy', 'name email');
    
    if (project) {
      // Get tasks for this project
      const tasks = await Task.find({ projectId: project._id })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
      
      res.json({ ...project.toObject(), tasks });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const { name, description, status, type, deadline, team } = req.body;
    
    const project = await Project.create({
      name,
      description,
      status: status || 'Not Started',
      type,
      deadline,
      progress: 0,
      team,
      createdBy: req.user._id,
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is admin, project creator, or team leader
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    // Would need additional logic for team leader check
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const { name, description, status, type, deadline, progress, team } = req.body;
    
    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.type = type || project.type;
    project.deadline = deadline || project.deadline;
    project.progress = progress !== undefined ? progress : project.progress;
    project.team = team || project.team;
    
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin or Creator
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is admin or project creator
    const isAdmin = req.user.role === 'admin';
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await project.deleteOne();
    
    // Also delete all tasks associated with this project
    await Task.deleteMany({ projectId: req.params.id });
    
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
