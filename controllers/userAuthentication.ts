import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const { email, password } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user._id, email: user.email, avatar: user.avatar, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res
      .status(201)
      .json({ token: token, message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await argon2.verify(user?.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, avatar: user.avatar, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};
