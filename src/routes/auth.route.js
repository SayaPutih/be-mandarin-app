import {
  LoginUser,
  RegisterUser,
  UpdateUser,
  DeleteUser,
  Me,
} from "../controller/auth.controller.js";
import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import {validateSchema} from "../middleware/validateSchema.js";
import {
  registerSchema,
  updateSchema,
  loginSchema,
} from "../schema/auth/auth.schema.js";


const router = express.Router()

router.get("/Me", validateToken, Me);
router.post("/login", validateSchema(loginSchema), LoginUser);
router.post("/register", validateSchema(registerSchema), RegisterUser);
router.put("/update/:id", validateSchema(updateSchema),UpdateUser);
router.delete("/delete/:id", DeleteUser);

export default router;