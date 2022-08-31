import { Router } from "express";
import authController from "../controllers/auth.controller";
import employeeController from "../controllers/employee.controller";

const router = Router();

router.post(
  "/employee",
  ...authController.authMiddleware,
  ...employeeController.addEmployee
);
router.delete(
  "/employee",
  ...authController.authMiddleware,
  ...employeeController.deleteEmployee
);

export default router;
