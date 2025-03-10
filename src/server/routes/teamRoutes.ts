
import express, { Request, Response } from 'express';
import { Team, User } from '../../models';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({})
      .populate('members', 'name email')
      .populate('leader', 'name email')
      .populate('projects', 'name');
      
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email avatar')
      .populate('projects', 'name status deadline');
      
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a team
// @route   POST /api/teams
// @access  Private/Admin
router.post('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { name, description, members, leader } = req.body;
    
    // Validate leader exists
    if (leader) {
      const leaderExists = await User.findById(leader);
      if (!leaderExists) {
        return res.status(404).json({ message: 'Team leader not found' });
      }
    }
    
    // Validate members exist
    if (members && members.length > 0) {
      const memberCount = await User.countDocuments({
        _id: { $in: members }
      });
      
      if (memberCount !== members.length) {
        return res.status(404).json({ message: 'One or more team members not found' });
      }
    }
    
    const team = await Team.create({
      name,
      description,
      members: members || [],
      leader,
      projects: [],
    });
    
    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email')
      .populate('leader', 'name email');
      
    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a team
// @route   PUT /api/teams/:id
// @access  Private/Admin or Team Leader
router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin or team leader
    const isAdmin = req.user.role === 'admin';
    const isTeamLeader = team.leader && team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isTeamLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    const { name, description, members, leader, projects } = req.body;
    
    // Only admin can change team leader
    if (leader && !isAdmin) {
      return res.status(403).json({ message: 'Only admin can change team leader' });
    }
    
    team.name = name || team.name;
    team.description = description || team.description;
    
    // Update members if provided
    if (members) {
      team.members = members;
    }
    
    // Update leader if provided and user is admin
    if (leader && isAdmin) {
      team.leader = leader;
    }
    
    // Update projects if provided
    if (projects) {
      team.projects = projects;
    }
    
    const updatedTeam = await team.save();
    
    const populatedTeam = await Team.findById(updatedTeam._id)
      .populate('members', 'name email')
      .populate('leader', 'name email')
      .populate('projects', 'name');
      
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private/Admin or Team Leader
router.post('/:id/members', protect, async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin or team leader
    const isAdmin = req.user.role === 'admin';
    const isTeamLeader = team.leader && team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isTeamLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already in the team
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }
    
    // Add user to team
    team.members.push(userId);
    await team.save();
    
    const updatedTeam = await Team.findById(team._id)
      .populate('members', 'name email')
      .populate('leader', 'name email');
      
    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private/Admin or Team Leader
router.delete('/:id/members/:userId', protect, async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin or team leader
    const isAdmin = req.user.role === 'admin';
    const isTeamLeader = team.leader && team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isTeamLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    const userId = req.params.userId;
    
    // Check if user is in the team
    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }
    
    // Don't allow removing the team leader from members
    if (team.leader && team.leader.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove team leader from members' });
    }
    
    // Remove user from team
    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();
    
    const updatedTeam = await Team.findById(team._id)
      .populate('members', 'name email')
      .populate('leader', 'name email');
      
    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    await team.deleteOne();
    
    res.json({ message: 'Team removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
