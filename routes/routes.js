import express from "express";
import userRouter from "./user.routes.js";

const routers = express.Router();
// User Routes ' 
routers.use("/user", userRouter);

export default routers;