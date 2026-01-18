import { Server } from "socket.io";
import Trip from "./models/Trip.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: "*" }});
  
  // join personal room
  io.on("connection", (socket) => {
    socket.on("join_user", (userId) => {
      socket.join(userId);
      console.log('ROOM ID:', userId)
      socket.userRoom = userId;
    });
    
    
    socket.on("live_location", async ({ tripId, lat, lng }) => {
      const trip = await Trip.findById(tripId);
      if (!trip) return;

      // security: only companion can send
      if (socket.userId !== trip.companion.toString()) return;

      // send directly to user room
      io.to(trip.user.toString()).emit("live_location", { lat, lng})
    });
    
    socket.on("disconnect", (reason) => {
      console.log("DISCONNECTED:", socket.id, reason);
    });
  });
  
  return io;
};

export const getIo = () => io;