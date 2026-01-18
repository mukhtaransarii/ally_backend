import Trip from "../models/Trip.js";
import User from "../models/User.js";
import crypto from "crypto";
import { getIo } from "../socket.js"

export const confirmTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companionId, pickup, distance, duration } = req.body;

    if (!companionId || !pickup) return res.status(400).json({ success: false, message: "Missing data" });
    
    // 🔒 ATOMIC LOCK
    const companion = await User.findOneAndUpdate(
      { _id: companionId, status: "available", active: true },
      { status: "on_trip"},
      { new: true }
    );

    if (!companion) {
      return res.status(409).json({
        success: false,
        message: "Companion already booked"
      });
    }
    
    const otp = crypto.randomInt(1000, 9999).toString();

    let trip = await Trip.create({
      user: userId,
      companion: companionId,
      pickup,
      distance,
      duration,
      otp
    })
    
    trip = await trip.populate([
        { path: "user", select: "name avatar gender" },
        { path: "companion", select: "avatar name gender username bio phone skills dob lat lng" }
      ]); 
      
    // ✅ EMIT AFTER SUCCESS
    const io = getIo();
    io.to(companionId).emit("trip_notification", {trip});
    
    res.status(201).json({ success: true, message: "Trip created successfully", trip });
  } catch (e) {
    console.error("CONFIRM TRIP ERROR:", e);
    res.status(500).json({ message: "Trip creation failed" });
  }
};


export const cancelTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: tripId },
      { status: "cancelled" },
      { new: true }
    );

    if (!trip)
      return res.status(404).json({ success: false, message: "Trip not found or already ended" });
    
    await User.findByIdAndUpdate(trip.companion, { status: "available" });
    
    const io = getIo();
    // 🔔 notify BOTH user & partner
    io.to(trip.user.toString()).emit("trip_cancelled", { tripId });
    io.to(trip.companion.toString()).emit("trip_cancelled", { tripId });
    
    res.json({ success: true, message: "Trip cancelled", trip });
  } catch (e) {
    console.error("CANCEL TRIP ERROR:", e);
    res.status(500).json({ message: "Cancel failed" });
  }
};


export const acceptTrip = async (req, res) => {
  try {
    const partnerId = req.user.id;
    const { tripId } = req.body;

    let trip = await Trip.findOneAndUpdate(
      { _id: tripId, companion: partnerId, status: "pending"},
      { status: "accepted" },
      { new: true }
    )
    
    trip = await trip.populate([
        { path: "user", select: "name avatar gender" },
        { path: "companion", select: "avatar name gender username bio phone skills dob lat lng" }
      ]); 

    if (!trip)
      return res.status(400).json({
        success: false,
        message: "Trip not found or not assigned to you"
      });
    
    const io = getIo();
    io.to(trip.user._id.toString()).emit("trip_accepted", {trip});

    res.json({ success: true, message: "Trip accepted", trip });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelTripAfterAccepted = async (req, res) => {
  try {
    const actorId = req.user.id;
    const { tripId, reason } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip)
      return res.status(404).json({ success: false, message: "Trip not found" });

    // 🚫 already ended
    if (["cancelled", "completed"].includes(trip.status))
      return res.status(400).json({ success: false, message: "Trip already ended" });

    // 🔐 authorization
    const isUser = trip.user.toString() === actorId;
    const isCompanion = trip.companion.toString() === actorId;

    if (!isUser && !isCompanion)
      return res.status(403).json({ success: false, message: "Not allowed" });

    // 🧠 business rules
    if (trip.status === "accepted") {
      // after accept → both can cancel
      trip.cancelledBy = isUser ? "user" : "companion";
      trip.cancelReason = reason || null;
    }

    trip.status = "cancelled";
    await trip.save();

    // 🔓 release companion
    await User.findByIdAndUpdate(trip.companion, { status: "available" });

    const io = getIo();
    io.to(trip.user.toString()).emit("trip_cancelled", {
      tripId,
      cancelledBy: trip.cancelledBy
    });
    io.to(trip.companion.toString()).emit("trip_cancelled", {
      tripId,
      cancelledBy: trip.cancelledBy
    });

    res.json({ success: true, message: "Trip cancelled" });
  } catch (e) {
    console.error("CANCEL TRIP ERROR:", e);
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};