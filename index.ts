import express from "express";
import cors from "cors";
import connectDb from "./config/db";
import dotenv from "dotenv";
import authRouter from "./routes/user_authentication";
import { createServer } from "http";
import { initializeSocket } from "./sockets/socket";

dotenv.config({ path: ".env.local", quiet: true });
const app = express();
const PORT = process.env.PORT || 8080;

const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/health", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/auth", authRouter);

connectDb().then(() => {
  console.log("MongoDB connected");
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
