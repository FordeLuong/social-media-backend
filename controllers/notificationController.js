// controllers/notificationController.js
const Notification = require('../models/notificationModel');

// @desc    Tạo notification mới
// @route   Internal function (không phải API endpoint)
// @access  Internal
exports.createNotification = async (notificationData) => {
  try {
    // Không tự thông báo cho chính mình
    if (notificationData.sender.toString() === notificationData.recipient.toString()) {
      return null;
    }

    // Kiểm tra xem đã có notification tương tự chưa (tránh spam)
    const existingNotification = await Notification.findOne({
      recipient: notificationData.recipient,
      sender: notificationData.sender,
      type: notificationData.type,
      post: notificationData.post,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 phút gần đây
    });

    if (existingNotification) {
      return existingNotification; // Không tạo duplicate
    }

    const notification = new Notification(notificationData);
    await notification.save();
    
    // Populate để trả về đầy đủ thông tin
    await notification.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'post', select: 'content imageUrl' }
    ]);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// @desc    Lấy tất cả notifications của user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user.id })
      .populate('sender', 'username avatar')
      .populate('post', 'content imageUrl')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments({ recipient: req.user.id });
    const unreadCount = await Notification.getUnreadCount(req.user.id);

    res.json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        hasNextPage: skip + notifications.length < totalNotifications
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy số lượng notifications chưa đọc
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy notification' });
    }

    await notification.markAsRead();
    res.json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy notification' });
    }

    res.json({ message: 'Đã xóa notification' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};