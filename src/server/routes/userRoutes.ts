
import express from 'express';
import { User } from '../../models';
import { protect, admin, hr } from '../middleware/auth';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin or HR
router.get('/', protect, hr, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      // Allow admin, HR, or the user themselves to access
      if (req.user.role === 'admin' || req.user.role === 'hr' || req.user._id.toString() === req.params.id) {
        res.json(user);
      } else {
        res.status(403).json({ message: 'Not authorized to view this user' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or User themselves
router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow admin or the user themselves to update
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { name, email, avatar, settings } = req.body;
    
    // Only admin can change role
    const { role } = req.body;
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can change user role' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    user.settings = settings || user.settings;
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      settings: updatedUser.settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
