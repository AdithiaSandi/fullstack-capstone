import { Router } from "express";
import { authLogin } from "./auth.controller.js";

const router = Router()

router.post("/login", authLogin)

export default router

