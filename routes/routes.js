import express from "express";
import userRouter from "./user.routes.js";
import teacherRouter from "./teacher.routes.js";
import verifyToken from "../middlewares/auth.js";
import classRouter from "./class.routes.js";
import studentRouter from "./student.routes.js";

const routers = express.Router();
routers.use("/user", userRouter);
routers.use("/teacher", verifyToken, teacherRouter);
routers.use('/class', verifyToken, classRouter)
routers.use('/student', verifyToken, studentRouter)


export default routers;