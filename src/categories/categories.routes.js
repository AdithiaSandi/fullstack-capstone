import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  categoriesAdd,
  categoriesDelete,
  categoriesGet,
  categoriesUpdate,
} from "./categories.controller.js";

const router = Router();

router.post("/categories", verifyToken, categoriesAdd);
router.get("/categories", verifyToken, categoriesGet);
router.patch("/categories", verifyToken, categoriesUpdate);
router.delete("/categories", verifyToken, categoriesDelete);

export default router;
