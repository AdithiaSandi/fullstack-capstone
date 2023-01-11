import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { userCreateRest, userGetByIDRest } from "./users.controller.js";

const router = Router()

router.post( "/users", userCreateRest)
router.get( "/users", verifyToken, userGetByIDRest)

export default router

