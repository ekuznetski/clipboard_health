import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // i simplified but in real project it should be special error service
  if (
    errors.array()[0].param === "accessToken" &&
    errors.array()[0].location === "cookies"
  ) {
    return res.status(401).send("unauthorised");
  }

  const extractedErrors: {
    [x: ValidationError["param"]]: ValidationError["msg"];
  }[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
}
export default validate;
