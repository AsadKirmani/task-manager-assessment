import { prisma } from "../../lib/prisma";


export const createTask = async (req, res) => {
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

export const getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(tasks);
};

export const toggleTask = async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });

  if (!task) return res.status(404).json({ message: "Not found" });

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { completed: !task.completed },
  });

  res.json(updated);
};

export const deleteTask = async (req: any, res: any) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
