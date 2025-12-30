import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: "*" }});
  
  // join personal room
  io.on("connection", (socket) => {
    socket.on("join_user", (userId) => {
      socket.join(userId);
      console.log('ROOM ID:', userId)
    });
  
    socket.on("disconnect", (reason) => {
      console.log("DISCONNECTED:", socket.id, reason);
    });
  });
  
  return io;
};

export const getIo = () => io;