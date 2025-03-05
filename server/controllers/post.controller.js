import Post from '../models/post.model.js';
import { errorHandler } from "../utils/error.js"

export const createTicket = async (req, res, next) => {
    if (req.user.role =="admin") {
        return next(errorHandler(403, 'You are not allowed to create a post'));
      }
      if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }
      const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
      const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
      });
      try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (error) {
        next(error);
      }
}

export const getTickets = async (req, res, next) => {
  try {
    const { userId, role, startIndex,  order, status, slug, postId } = req.query;
    
    const startIdx = parseInt(startIndex) || 0;
    const sortDirection = order === 'asc' ? 1 : -1;

    
    // If the user is not an admin, restrict to their posts only
    const filter = role === "admin" ? {} : { userId };

    if (status) filter.status = status;
    if (slug) filter.slug = slug;
    if (postId) filter._id = postId;

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .skip(startIdx);

    const now = new Date();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
   if (req.user.role !=="admin" || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { status: req.body.status } }, // Admin can only update status
      { new: true }
    );

    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
