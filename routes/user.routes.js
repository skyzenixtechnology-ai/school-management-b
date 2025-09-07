import express from "express";
import { changePassword, getUserById, login, registerUser } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.js";

const userRouter = express.Router();
userRouter.get("/:id", verifyToken, getUserById);
userRouter.post("/signup", registerUser);
userRouter.post("/login", login);
userRouter.post('/change-password', verifyToken, changePassword);
export default userRouter;
