import { NextFunction, Request, Response } from "express";
import { body, query } from "express-validator";
import { EFilter } from "../domain/enums/filterby.enum";
import { EGroup } from "../domain/enums/groupby.enum";
import employeesService from "../services/employeesService";
import validate from "../utils/validate.util";

const getSalaryStat = [
  query("filterby").optional().isIn(Object.keys(EFilter)),
  query("groupby").optional().isIn(Object.keys(EGroup)),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    const salaryStatParams = {
      filterby: EFilter[req.query.filterby as keyof typeof EFilter],
      groupby: EGroup[req.query.groupby as keyof typeof EGroup],
    };

    try {
      employeesService
        .getSalaryStat(salaryStatParams)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {}
  },
];

const addEmployee = [
  body("name").isString(),
  body("salary").isInt(),
  body("currency").isString(),
  body("department").isString(),
  body("on_contract").isBoolean().optional(),
  body("sub_department").isString(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    employeesService
      .addEmployee(req.body)
      .then((e) => {
        res.status(200).send("added successfully");
      })
      .catch((err) => {
        next(err);
      });
  },
];

const deleteEmployee = [
  body("name").isString(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    employeesService
      .deleteEmployee(req.body.name)
      .then((e) => {
        res.status(200).send("deleted successfully");
      })
      .catch((err) => {
        next(err);
      });
  },
];

const employeeController = {
  getSalaryStat,
  addEmployee,
  deleteEmployee,
};
export default employeeController;
