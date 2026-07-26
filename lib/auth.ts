import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET!;

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}