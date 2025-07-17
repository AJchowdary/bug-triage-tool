import express from "express";
import { handleBugTriage } from "../controllers/bugController";

const router = express.Router();

router.post("/triage", handleBugTriage);

export default router;

 
