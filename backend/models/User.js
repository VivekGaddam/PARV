import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, 
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  dietaryPreferences: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
}, { timestamps: true });

export default mongoose.model("User", UserSchema); // Use export default