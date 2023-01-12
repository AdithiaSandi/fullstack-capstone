import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { userCreateRest, userGetByIDRest, userDelete, userUpdate } from "./users.controller.js";

const router = Router()

router.post( "/user", userCreateRest)
router.get( "/user", verifyToken, userGetByIDRest)
router.delete( "/user", verifyToken, userDelete)
router.patch( "/user", verifyToken, userUpdate)

export default router

