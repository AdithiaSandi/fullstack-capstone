import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { addressAdd, addressDelete, addressGet, addressUpdate } from "./address.controller.js";

const router = Router();

router.post("/user/address", verifyToken, addressAdd);
router.get( "/user/address", verifyToken, addressGet)
router.delete( "/user/address/:id", verifyToken, addressDelete)
router.patch( "/user/address/:id", verifyToken, addressUpdate)

export default router;
