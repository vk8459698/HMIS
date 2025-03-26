import express from "express";
import { createTest, getTests } from "../controllers/testController.js";

const router = express.Router();

router.post("/create", createTest);
router.get("/all", getTests);

export default router;
