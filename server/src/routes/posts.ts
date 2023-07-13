const { authenticateToken } = require('../middleware/authenticateToken');

import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { Post, User, Like } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

// Get posts by userId
router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res
      .status(400)
      .json({ error: 'userId is required in query parameters.' });
  }

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: userId as string,
    },
  });
  res.json(userPosts);
});

// Get posts by username
router.get('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        likes: true,
      },
    });

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
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    if (!req.body.text) {
      return res.status(422).json({ error: 'Post text must be provided.' });
    }

    const newPost = await prisma.post.create({
      data: {
        author: {
          connect: {
            id: userId,
          },
        },
        text: req.body.text,
      },
    });
    res.status(201).json(newPost);
  }
);

// Edit a post
router.put(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const postId = req.params.id;
    const userId = req.user!.id;

    if (!req.body.text) {
      return res.status(422).json({ error: 'Post text must be provided.' });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ error: 'You can only edit your own posts.' });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        text: req.body.text,
      },
    });
    res.json(updatedPost);
  }
);

// Delete a post
router.delete(
  '/:id',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const postId = req.params.id;
    const userId = req.user!.id;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own posts.' });
    }

    await prisma.post.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  }
);

// Add a like to a post
router.post(
  '/:id/like',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const postId = req.params.id;

    if (!postId) {
      res.status(400).json({ error: 'You must specify post id.' });
    }

    let like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
    if (like) {
      return res.status(404).json({
        error: `You have already liked this post.`,
      });
    }

    like = await prisma.like.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json(updatedPost);
  }
);

// Remove a like from a post
router.delete(
  '/:id/like',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const postId = req.params.id;

    if (!postId) {
      res.status(400).json({ error: 'You must specify post id.' });
    }

    let like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
    if (!like) {
      return res.status(404).json({
        error: 'You have not liked this post.',
      });
    }

    like = await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json(updatedPost);
  }
);

module.exports = router;
