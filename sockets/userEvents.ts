import { Server as SocketIOServer, Socket } from "socket.io";

export const registerUserEvents = (io: SocketIOServer, socket: Socket) => {
  socket.on("testSocket", (data: any) => {
    socket.emit("testSocket", { msg: "Its working!" });
  });
};
