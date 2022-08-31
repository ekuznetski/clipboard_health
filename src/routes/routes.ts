import { NextFunction, Request, Response, Router } from "express";
import protectedRoutes from "./protected";
import publicRoutes from "./public";

const router = Router();
function errorHandler(
  err: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  //in real app error should be an object with status code and message, but for test task i simplified
  console.error(err);
  res.status(500).send(err);
}

export const baseRoute = "/api/v1/";
router.use(baseRoute, protectedRoutes);
router.use(baseRoute, publicRoutes);

router.use(errorHandler);

export default router;
