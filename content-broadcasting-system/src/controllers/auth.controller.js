import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { loginUser, registerUser } from "../services/auth.service.js";

/**
 * Handles user registration.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await registerUser({ name, email, password, role });
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

/**
 * Handles user login.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const registerController = register;
export const loginController = login;