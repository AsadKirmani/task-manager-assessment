import { prisma } from "../../lib/prisma.js";
import type { Request, Response } from "express";


export const createTask = async (req: Request, res: Response) => {
  try {
    
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        userId: req.user.userId,
      },
    });
  
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(tasks);
};

export const toggleTask = async (req: Request, res: Response) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id as string } });

  if (!task) return res.status(404).json({ message: "Not found" });

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { completed: !task.completed },
  });

  res.json(updated);
};

export const deleteTask = async (req: Request, res: Response) => {
  await prisma.task.delete({ where: { id: req.params.id as string } });
  res.json({ message: "Deleted" });
};
