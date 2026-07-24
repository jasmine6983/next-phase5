import prisma from "../config/prisma";

export const createTask = async (
  title: string,
  description: string | undefined,
  userId: number
) => {
  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return task;
};

export const getTasks = async (userId: number) => {
  return await prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTaskById = async (
  id: number,
  userId: number
) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  return task;
};

export const updateTask = async (
  id: number,
  userId: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) => {
  // Check ownership
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    return null;
  }

  // Update task
  return await prisma.task.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteTask = async (
  id: number,
  userId: number
) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    return null;
  }

  await prisma.task.delete({
    where: {
      id,
    },
  });

  return task;
};