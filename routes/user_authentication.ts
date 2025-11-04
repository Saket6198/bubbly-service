import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  // Handle user login
  res.status(200).json({ message: "User logged in" });
});

export default authRouter;
