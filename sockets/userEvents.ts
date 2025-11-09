import { Server as SocketIOServer, Socket } from "socket.io";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const registerUserEvents = (io: SocketIOServer, socket: Socket) => {
  socket.on("testSocket", (data: any) => {
    socket.emit("testSocket", { msg: "Its working!" });
  });
  socket.on(
    "updateProfile",
    async (data: { name?: string; avatar?: string }) => {
      console.log("updateprofile event ", data);
      const userId = socket.data.userId;
      if (!userId) {
        console.log("Unauthorized update profile attempt");
        return socket.emit("updateProfile", {
          // sending response back to the same event
          msg: "Unauthorized",
          success: false,
        });
      }
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { name: data?.name, avatar: data?.avatar },
          { new: true } // will return the updated data
        );
        if (!updatedUser) {
          console.log("User not found for updating profile");
          return socket.emit("updateProfile", {
            msg: "User not found",
            success: false,
          });
        }
        // generate token with updated data
        console.log("Profile updated successfully for user:", updatedUser._id);
        const newToken = jwt.sign(
          {
            id: updatedUser._id,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        socket.emit("updatedProfile", {
          msg: "profile updated successfully",
          data: { token: newToken },
          success: true,
        });
      } catch (err: any) {
        console.log("Error updating profile:", err);
        socket.emit("updateProfile", {
          msg: "Error updating profile",
          success: false,
        });
      }
    }
  );
};
