import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({

  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.model("Test", TestSchema);
export default Test;
