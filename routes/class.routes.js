import express from "express";
import { createClass, deleteClass, getAllClasses, updateClass } from "../controllers/class.controller.js";

const classRouter = express.Router()

classRouter.get('/', getAllClasses);
classRouter.post('/', createClass);
classRouter.put('/:id', updateClass);
classRouter.delete('/:id', deleteClass);


export default classRouter