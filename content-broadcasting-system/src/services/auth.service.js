import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { createUser, findUserByEmail } from "../models/user.model.js";

/**
 * Registers a new user account.
 * @param {{name: string, email: string, password: string, role: string}} payload
 * @returns {Promise<object>}
 */
export async function registerUser(payload) {
  const { name, email, password, role } = payload;

  if (!["principal", "teacher"].includes(role)) {
    throw new ApiError(400, "Role must be principal or teacher");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const createdUser = await createUser({
    name,
    email,
    passwordHash,
    role
  });

  return createdUser;
}

/**
 * Generates authentication token payload for a user.
 * @param {{id: number, role: string, name: string}} user
 * @returns {string}
 */
function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

/**
 * Logs in an existing user account.
 * @param {{email: string, password: string}} payload
 * @returns {Promise<object>}
 */
export async function loginUser(payload) {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}