import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../validation/auth';
import { auth as authMiddleware } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User(validatedData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        resumeLink: user.resumeLink,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        resumeLink: user.resumeLink,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
};

export const me = async (req: Request, res: Response) => {
  // auth middleware attaches user to req
  // This controller expects the middleware to have run before
  const anyReq = req as any;
  if (!anyReq.user) {
    return res.status(401).json({ message: 'Please authenticate' });
  }

  const user = anyReq.user;
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      resumeLink: user.resumeLink,
    },
  });
};
