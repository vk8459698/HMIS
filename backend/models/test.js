import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "tests" } // Explicit collection name
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { collection: "users" } // Explicit collection name
);

const User = mongoose.model("User", UserSchema);
const Test = mongoose.model("Test", TestSchema);

export { Test, User };
