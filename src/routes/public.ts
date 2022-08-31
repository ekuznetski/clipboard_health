import { Router } from "express";
import authController from "../controllers/auth.controller";
import employeeController from "../controllers/employee.controller";

const router = Router();

router.post("/login", ...authController.login);
router.get("/salaryStat", ...employeeController.getSalaryStat);

export default router;
