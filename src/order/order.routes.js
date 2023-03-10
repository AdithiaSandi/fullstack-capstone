import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  ordersAdd,
  ordersDelete,
  ordersDistance,
  ordersGet,
  ordersGetAll,
  ordersUpdate,
} from "./order.controller.js";

const router = Router();

router.post("/user/orders", verifyToken, ordersAdd);
router.get("/user/orders", verifyToken, ordersGetAll);
router.get("/user/orders/detail", verifyToken, ordersGet);
router.patch("/user/orders", verifyToken, ordersUpdate);
router.delete("/user/orders", verifyToken, ordersDelete);
router.get("/users/orders/distance", verifyToken, ordersDistance);

export default router;
