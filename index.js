import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import findNearestCompanionRoutes from "./routes/findNearestCompanionRoutes.js"
import partnerGoOnlineRoutes from "./routes/partnerGoOnlineRoutes.js"

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


// routes
app.use("/api/user", userRoutes);
app.use("/companion", findNearestCompanionRoutes);
app.use("/partner", partnerGoOnlineRoutes);

// run server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

