import express from "express";
import userRouter from "./user.routes.js";
import teacherRouter from "./teacher.routes.js";
import verifyToken from "../middlewares/auth.js";

const routers = express.Router();
// User Routes ' 
routers.use("/user", userRouter);
// Teacher Routes
routers.use("/teacher", verifyToken, teacherRouter);

export default routers;