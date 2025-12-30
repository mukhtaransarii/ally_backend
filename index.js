import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import findNearestCompanionRoutes from "./routes/findNearestCompanionRoutes.js"
import partnerGoOnlineRoutes from "./routes/partnerGoOnlineRoutes.js"
import tripRoutes from "./routes/tripRoutes.js";
import { initSocket } from "./socket.js";
import Trip from "./models/Trip.js"

const app = express();
const server = http.createServer(app);
initSocket(server);

connectDB();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.get('/', async (req, res) => {
  const allTrip = await Trip.find()
  if(!allTrip.length) return res.json({message: 'Aur bhai, kya haal hai?'})
  
  res.json(allTrip)
})

// routes
app.use("/api/user", userRoutes);
app.use("/companion", findNearestCompanionRoutes);
app.use("/partner", partnerGoOnlineRoutes);
app.use("/api/trip", tripRoutes);


server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port", process.env.PORT);
});


