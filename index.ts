import express from "express";
import cors from "cors";
import connectDb from "./config/db";
import dotenv from "dotenv";
import authRouter from "./routes/user_authentication";
dotenv.config({ path: ".env.local", quiet: true });
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/health", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/user", authRouter);

connectDb().then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
