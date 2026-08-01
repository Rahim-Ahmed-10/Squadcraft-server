import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { AuthRequest } from "../middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "squadcraft_jwt_fallback_secret_key";
const JWT_EXPIRES_IN = "30d";

// Sign a JWT Token
const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role, playerId } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      res.status(400).json({ message: "Username is already taken" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "Player",
      playerId: playerId || null,
    });

    await newUser.save();

    // Generate token
    const token = signToken(newUser._id.toString());

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      playerId: newUser.playerId,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() }).populate("playerId");
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Generate token
    const token = signToken(user._id.toString());

    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      playerId: user.playerId,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to sign in", error });
  }
};

// Get current user profile (using token)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // Populate user's player link if it exists
    const fullUser = await User.findById(req.user._id).select("-password").populate("playerId");
    res.status(200).json(fullUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user session", error });
  }
};
