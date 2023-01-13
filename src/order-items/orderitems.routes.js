import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  itemsAdd,
  itemsDelete,
  itemsGet,
  itemsUpdate,
} from "./orderitems.controller.js";

const router = Router();

router.post("/user/orders/items", verifyToken, itemsAdd);
router.get("/user/orders/items", verifyToken, itemsGet);
router.patch("/user/orders/items", verifyToken, itemsUpdate);
router.delete("/user/orders/items", verifyToken, itemsDelete);

export default router;
