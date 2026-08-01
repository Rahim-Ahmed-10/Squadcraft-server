import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "squadcraft_jwt_fallback_secret_key";

// Protect route - verifies JWT and mounts user
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      // Find user in db (exclude password hash)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "User not found in system database" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      res.status(401).json({ message: "Not authorized, token validation failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, token not provided" });
    return;
  }
};

// Role authorization middleware
export const restrictTo = (...roles: ("Admin" | "Player")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized, login required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: role '${req.user.role}' does not have permissions to perform this action.`,
      });
      return;
    }

    next();
  };
};
