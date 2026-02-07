import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createTask, getTasks, toggleTask, deleteTask } from "../controllers/task.controller.js";
import { validate } from "../middleware/validate.js";
import { taskCreateSchema } from "../validators/task.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/create", validate(taskCreateSchema), createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;