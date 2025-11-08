import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as ServerIOSocket, Socket } from "socket.io";
import { registerUserEvents } from "./userEvents";
dotenv.config({ path: ".env.local" });

export const initializeSocket = (server: any): ServerIOSocket => {
  // upgrade http server to socket server
  const io = new ServerIOSocket(server, {
    cors: {
      origin: "*",
    },
  });

  // auth middleware ("use" is for middleware)

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error("Authentication error: Token not provided");
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        throw new Error("Authentication error: Invalid token");
      }
      const userData = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.avatar,
      };

        // attach user data to socket object
        socket.data = userData;
        socket.data.userId = userData.id;
        next();
      }
    );
  });

  // when socket connects, register events

  io.on("connection", async (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}, username: ${socket.data.name}`);


      //register events

    registerUserEvents(io, socket);

      socket.on("disconnect", () => {
        //user logs out
        console.log(`User disconnected: ${socket.data.userId}, username: ${socket.data.name}`);
      })
  });


    


  return io;
};
