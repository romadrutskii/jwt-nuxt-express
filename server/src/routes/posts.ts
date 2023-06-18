const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/authenticateToken');

import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';

import posts from '../database/posts';
import users from '../database/users';

const router = Router();

// Get posts by userId
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .json({ error: 'userId is required in query parameters.' });
  }
  const userPosts = posts.filter((post) => post.userId === userId);
  res.json(userPosts);
});

// Get posts by username
router.get('/:username', (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = posts.filter((post) => post.userId === user.id);

    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Add a new post
router.post(
  '/',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    if (!req.body.text) {
      return res.status(422).json({ error: 'Post text must be provided.' });
    }
    const newPost = {
      id: uuidv4(),
      userId: req.user!.id,
      text: req.body.text,
      likes: 0,
      likedBy: [],
    };
    posts.push(newPost);
    res.status(201).json(newPost);
  }
);

// Edit a post
router.put(
  '/:id',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    if (!req.body.text) {
      return res.status(422).json({ error: 'Post text must be provided.' });
    }

    const post = posts.find((post) => post.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (post.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ error: 'You can only edit your own posts.' });
    }
    post.text = req.body.text;
    res.json(post);
  }
);

// Delete a post
router.delete(
  '/:id',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const postIndex = posts.findIndex((post) => post.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (posts[postIndex].userId !== req.user!.id) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own posts.' });
    }
    const deletedPost = posts.splice(postIndex, 1);
    res.json(deletedPost);
  }
);

// Add a like to a post
router.post(
  '/:id/like',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const post = posts.find((post) => post.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (!post.likedBy.includes(req.user!.id)) {
      post.likes += 1;
      post.likedBy.push(req.user!.id);
    }
    res.json(post);
  }
);

// Remove a like from a post
router.delete(
  '/:id/like',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const post = posts.find((post) => post.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    const userIndex = post.likedBy.indexOf(req.user!.id);
    if (userIndex !== -1) {
      post.likes -= 1;
      post.likedBy.splice(userIndex, 1);
    }
    res.json(post);
  }
);

module.exports = router;
