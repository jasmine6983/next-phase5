import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createTaskSchema } from "../validations/task.validation";
import { createTask } from "../services/task.service";
import { getTasks } from "../services/task.service";
import { getTaskById } from "../services/task.service";
import { updateTaskSchema } from "../validations/task.validation";
import { updateTask } from "../services/task.service";
import { deleteTask } from "../services/task.service";

export const create = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description } = result.data;

    const task = await createTask(
      title,
      description,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getAll = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await getTasks(req.user!.id);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOne = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    // Fetch task
    const task = await getTaskById(
      id,
      req.user!.id
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const task = await updateTask(
      id,
      req.user!.id,
      result.data
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await deleteTask(
      id,
      req.user!.id
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};