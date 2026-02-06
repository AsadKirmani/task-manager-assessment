import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTask, getTasks, toggleTask, deleteTask } from "../controllers/task.controller";
import { validate } from "../middleware/validate";
import { taskCreateSchema } from "../validators/task.validator";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/create", validate(taskCreateSchema), createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;