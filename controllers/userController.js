// controllers/userController.js

const User = require('../models/userModel.js');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  // Middleware 'auth' đã tìm và gắn user vào 'req.user'
  // Chúng ta chỉ cần trả về thông tin đó
  res.status(200).json(req.user);
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (hoặc Private nếu bạn muốn)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    // Nếu ID không đúng định dạng của MongoDB, nó sẽ throw lỗi
    if(error.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Follow một người dùng
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
  try {
      // User để follow
      const userToFollow = await User.findById(req.params.id);
      // User hiện tại (người đi follow)
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow || !currentUser) {
          return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }

      // Không cho phép follow chính mình
      if (userToFollow._id.toString() === currentUser._id.toString()) {
          return res.status(400).json({ message: 'Không thể follow chính mình.' });
      }

      // Kiểm tra xem đã follow chưa
      if (currentUser.following.includes(userToFollow._id)) {
          return res.status(400).json({ message: 'Bạn đã follow người dùng này.' });
      }

      // Thêm người dùng vào danh sách following của currentUser
      currentUser.following.push(userToFollow._id);
      // Thêm currentUser vào danh sách followers của userToFollow
      userToFollow.followers.push(currentUser._id);

      // Lưu cả hai user
      await currentUser.save();
      await userToFollow.save();

      res.status(200).json({
          message: 'Đã follow thành công.',
          following: currentUser.following,
          followers: userToFollow.followers
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Unfollow một người dùng
// @route   POST /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!userToUnfollow || !currentUser) {
          return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }
      // Không cho phép unfollow chính mình
      if (userToUnfollow._id.toString() === currentUser._id.toString()) {
          return res.status(400).json({ message: 'Không thể unfollow chính mình.' });
      }
      // Kiểm tra xem đã follow chưa
      if (!currentUser.following.includes(userToUnfollow._id)) {
          return res.status(400).json({ message: 'Bạn chưa follow người dùng này.' });
      }
      // Xóa người dùng khỏi danh sách following của currentUser
      currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
      // Xóa currentUser khỏi danh sách followers của userToUnfollow
      userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
      // Lưu cả hai user
      await currentUser.save();
      await userToUnfollow.save();
      res.status(200).json({
          message: 'Đã unfollow thành công.',
          following: currentUser.following,
          followers: userToUnfollow.followers
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUserProfile = async (req, res) => {
  const { realName, avatar, bio } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Cập nhật thông tin người dùng
    user.realName = realName || user.realName;
    user.bio = bio || user.bio;
    user.avatar = req.file ? req.file.path : user.avatar; // Nếu có file avatar mới thì cập nhật

    if(req.body.password) {
      user.password = req.body.password; // Cập nhật mật khẩu nếu có
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      realName: updatedUser.realName,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
  

module.exports = {
  getMe,
  getUserById, 
  followUser,
  unfollowUser,
  updateUserProfile,
};