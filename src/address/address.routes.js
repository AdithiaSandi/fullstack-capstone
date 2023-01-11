import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { addressAdd } from "./address.controller.js";

const router = Router();

router.post("/users/address", verifyToken, addressAdd);

export default router;
