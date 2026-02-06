import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const register = async (req: Request, res: Response) => {
  try {

  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashed },
  });

  res.status(201).json({ message: "Registered successfully" });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal server error" });
} 
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, () => {
    const newAccessToken = generateAccessToken(user.id);
    res.json({ accessToken: newAccessToken });
  });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null },
  });

  res.json({ message: "Logged out" });
};
