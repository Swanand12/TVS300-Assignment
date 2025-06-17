import express from "express";
import { getDNSInfoController } from "../controllers/dnsController.js";

const router = express.Router();

// METHOD: GET || FETCHING DNS DATA
router.get("/get", getDNSInfoController);

export default router;
