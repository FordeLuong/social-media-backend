// controllers/postController.js

const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

// ---------------------------------------------------------------- //
// --- CÁC HÀM ĐÃ VIẾT TRƯỚC ĐÓ ---

// @desc    Tạo một bài đăng mới
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Nội dung không được để trống' });
    }

    const newPost = new Post({
      content,
      imageUrl: null,
      author: req.user.id, // req.user được lấy từ middleware 
    });

    const savedPost = await newPost.save();
    await savedPost.populate('author', 'username avatar');

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Tạo một bài đăng mới với hình ảnh
// @route   POST /api/posts/image
// @access  Private
exports.createPostWithImage = async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file.path; // Đường dẫn hình ảnh từ Cloudinary

    if (!imageUrl) {
      return res.status(400).json({ message: 'Không tìm thấy file hình ảnh.' });
    }

    const newPost = new Post({
      content: content || '',
      imageUrl: imageUrl,
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    await savedPost.populate('author', 'username avatar');
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error in createPostWithImage:", error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tất cả bài đăng
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Like hoặc Unlike một bài đăng
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Bình luận vào một bài đăng
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }
    if (!content) {
        return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }

    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.id,
    });

    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    await post.save();
    
    await savedComment.populate('author', 'username avatar');

    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ---------------------------------------------------------------- //
// --- CÁC HÀM MỚI ---

// @desc    Lấy một bài đăng theo ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar',
        },
      });

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    // Nếu ID không hợp lệ, Mongoose sẽ throw lỗi, cần bắt lại
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Cập nhật bài đăng
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    // Kiểm tra xem người dùng có phải là tác giả của bài đăng không
    // Phải chuyển ObjectId sang string để so sánh
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Không được phép thực hiện hành động này' });
    }

    // Cập nhật nội dung
    post.content = req.body.content || post.content;
    
    const updatedPost = await post.save();
    await updatedPost.populate('author', 'username avatar');

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Xóa bài đăng
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    // Kiểm tra quyền sở hữu
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Không được phép thực hiện hành động này' });
    }

    // Xóa tất cả các bình luận liên quan đến bài đăng này để đảm bảo toàn vẹn dữ liệu
    await Comment.deleteMany({ post: req.params.id });

    // Xóa bài đăng
    await post.deleteOne(); // Sử dụng deleteOne() thay cho remove() đã lỗi thời

    res.status(200).json({ message: 'Bài đăng đã được xóa thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tất cả bài đăng của một người dùng cụ thể
// @route   GET /api/users/:userId/posts
// @access  Public
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ author: userId })
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar',
        },
      })
      .sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng của người dùng này' });
    }
    res.status(200).json(posts); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}