import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

/**
 * Register User
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password } = result.data;

    // Call service
    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error: any) {

    if (error.message === "Email already exists") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Login User
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = result.data;

    // Call service
    const data = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: data.user,
    });

  } catch (error: any) {

    if (error.message === "Invalid email or password") {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};