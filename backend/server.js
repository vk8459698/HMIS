import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

app.get("/", (req, res) => {
    res.send("Backend is running with ES Modules");
});

app.get("/test",(req, res) => {
    res.send("Frontend Connected to Backend");
})

app.use("/api/tests", testRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
