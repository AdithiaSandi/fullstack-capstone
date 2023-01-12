import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { ordersAdd, ordersDelete, ordersGet, ordersUpdate } from "./order.controller.js";

const router = Router();

router.post("/user/orders", verifyToken, ordersAdd);
router.get("/user/orders", verifyToken, ordersGet);
router.patch( "/user/orders", verifyToken, ordersUpdate)
router.delete("/user/orders", verifyToken, ordersDelete);

export default router;
