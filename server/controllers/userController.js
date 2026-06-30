const User = require('../models/User');

// @desc    Get leaderboard sorted by highest score
// @route   GET /api/leaderboard
// @access  Public (or Private, typically Public for game display)
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select('username highestScore wins totalGames')
      .sort({ highestScore: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    console.error(`[LEADERBOARD ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error, failed to fetch leaderboard' });
  }
};

// @desc    Save game score and update stats
// @route   POST /api/save-score
// @access  Private
const saveScore = async (req, res) => {
  try {
    const { score, outcome } = req.body; // outcome should be 'win' or 'lose'
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment games played
    user.totalGames += 1;

    // Handle game win/loss state
    if (outcome === 'win') {
      user.wins += 1;
    } else if (outcome === 'lose') {
      user.losses += 1;
    }

    // Update highest score if current is higher
    if (score > user.highestScore) {
      user.highestScore = score;
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      highestScore: user.highestScore,
      totalGames: user.totalGames,
      wins: user.wins,
      losses: user.losses
    });
  } catch (error) {
    console.error(`[SAVE SCORE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error, failed to save score' });
  }
};

// @desc    Get user profile details
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(`[GET PROFILE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error, failed to fetch profile' });
  }
};

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, password } = req.body;

    // Check unique constraints if updating fields
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username;
    }

    if (password) {
      user.password = password; // Trigger pre-save hook for hashing
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      highestScore: user.highestScore,
      totalGames: user.totalGames,
      wins: user.wins,
      losses: user.losses
    });
  } catch (error) {
    console.error(`[UPDATE PROFILE ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error, failed to update profile' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(`[DELETE ACCOUNT ERROR]: ${error.message}`);
    res.status(500).json({ message: 'Server error, failed to delete account' });
  }
};

module.exports = {
  getLeaderboard,
  saveScore,
  getProfile,
  updateProfile,
  deleteAccount
};
