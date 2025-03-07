
import express from 'express';
import { Team, User } from '../../models';
import { protect, admin, hr } from '../middleware/auth';

const router = express.Router();

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find({})
      .populate('leader', 'name')
      .populate('members', 'name')
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
router.get('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('projects', 'name status');
    
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
// @access  Private/Admin or HR
router.post('/', protect, hr, async (req, res) => {
  try {
    const { name, description, leader, members, projects } = req.body;
    
    const team = await Team.create({
      name,
      description,
      leader,
      members: members || [leader],
      projects: projects || [],
    });
    
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name')
      .populate('members', 'name')
      .populate('projects', 'name');
    
    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a team
// @route   PUT /api/teams/:id
// @access  Private/Admin, HR or Team Leader
router.put('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin, HR, or team leader
    const isAdmin = req.user.role === 'admin';
    const isHR = req.user.role === 'hr';
    const isLeader = team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isHR && !isLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    const { name, description, leader, members, projects } = req.body;
    
    team.name = name || team.name;
    team.description = description || team.description;
    
    // Only admin or HR can change team leader
    if ((isAdmin || isHR) && leader) {
      team.leader = leader;
    }
    
    if (members) {
      team.members = members;
    }
    
    if (projects) {
      team.projects = projects;
    }
    
    const updatedTeam = await team.save();
    
    const populatedTeam = await Team.findById(updatedTeam._id)
      .populate('leader', 'name')
      .populate('members', 'name')
      .populate('projects', 'name');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Private/Admin or HR
router.delete('/:id', protect, hr, async (req, res) => {
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

// @desc    Add user to team
// @route   POST /api/teams/:id/members
// @access  Private/Admin, HR or Team Leader
router.post('/:id/members', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin, HR, or team leader
    const isAdmin = req.user.role === 'admin';
    const isHR = req.user.role === 'hr';
    const isLeader = team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isHR && !isLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    const { userId } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user already in team
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in team' });
    }
    
    team.members.push(userId);
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name')
      .populate('members', 'name')
      .populate('projects', 'name');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove user from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private/Admin, HR or Team Leader
router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if user is admin, HR, or team leader
    const isAdmin = req.user.role === 'admin';
    const isHR = req.user.role === 'hr';
    const isLeader = team.leader.toString() === req.user._id.toString();
    
    if (!isAdmin && !isHR && !isLeader) {
      return res.status(403).json({ message: 'Not authorized to update this team' });
    }
    
    // Check if user is team leader
    if (team.leader.toString() === req.params.userId) {
      return res.status(400).json({ message: 'Cannot remove team leader from team' });
    }
    
    // Remove user from team
    team.members = team.members.filter(
      member => member.toString() !== req.params.userId
    );
    
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name')
      .populate('members', 'name')
      .populate('projects', 'name');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
