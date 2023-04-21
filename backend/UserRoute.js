import express from "express"
import { createTask, deleteTask, getTasks, login, signup, updateTask } from "./UserController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/create", createTask);
router.post("/getTasks", getTasks);
router.post("/updateTask", updateTask);
router.post("/deleteTask", deleteTask);


export default router;