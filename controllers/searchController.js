// controler/searchController.js
const User = require('../models/userModel');
const Post = require('../models/postModel');
// @desc    Tìm kiếm toàn diện (Users và Posts)
// @route   GET /api/search
// @access  Private
exports.searchAll = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(200).json({ users: [], posts: [] });
  }

  try {
    const searchRegex = new RegExp(query, "i");

    // Sử dụng Promise.all để thực hiện 2 truy vấn song song
    const [users, posts] = await Promise.all([
      // Tìm kiếm Users
      User.find({
        $or: [
          { username: { $regex: searchRegex } },
          { realName: { $regex: searchRegex } },
        ],
      })
        .select("username realName avatar")
        .limit(5),

      // Tìm kiếm Posts bằng text index
      Post.find({ content: { $regex: searchRegex } })
        .populate("author", "username avatar")
        .limit(5),
    ]);

    res.status(200).json({ users, posts });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
