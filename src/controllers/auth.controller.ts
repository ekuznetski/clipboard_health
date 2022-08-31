import { NextFunction, Request, Response } from "express";
import { body, cookie } from "express-validator";
import authService from "../services/auth.service";
import validate from "../utils/validate.util";

const login = [
  body("username").isString(),
  body("password").isString(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    authService
      .getAccessToken(req.body)
      .then((accessToken) => {
        res
          .status(200)
          .cookie("accessToken", accessToken, { httpOnly: true })
          .send("login successful");
      })
      .catch((err) => {
        next(err);
      });
  },
];

const authMiddleware = [
  cookie("accessToken").isString(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    const oldToken = req.cookies.accessToken;
    authService
      .getRefreshToken(oldToken)
      .then((refreshToken) => {
        res.cookie("accessToken", refreshToken, { httpOnly: true });
        next();
      })
      .catch((err) => next(err));
  },
];

const authController = {
  login,
  authMiddleware,
};
export default authController;
