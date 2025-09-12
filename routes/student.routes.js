import express from 'express'
import { createStudent, deleteStudent, getAllStudents, getStudentByClass, getStudentById, updateStudent } from '../controllers/student.controller.js';

const studentRouter = express.Router();

studentRouter.get('/', getAllStudents);
studentRouter.get('/:id', getStudentById);
studentRouter.get('/all/:id', getStudentByClass)
studentRouter.post('/', createStudent);
studentRouter.put("/:id", updateStudent);
studentRouter.delete("/:id", deleteStudent);

export default studentRouter;