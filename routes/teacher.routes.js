import express from "express";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controllers/teacher.controller.js";
const teacherRouter = express.Router();

teacherRouter.post('/', createTeacher);
teacherRouter.get('/', getAllTeachers);
teacherRouter.get('/:id', getTeacherById);
teacherRouter.put('/:id', updateTeacher);
teacherRouter.delete('/:id', deleteTeacher);

export default teacherRouter;