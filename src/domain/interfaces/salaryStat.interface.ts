import { EFilter } from "../enums/filterby.enum";
import { EGroup } from "../enums/groupby.enum";

export interface ISalaryStat {
  mean: number;
  min: number;
  max: number;
}

export interface IGetSalaryStatParams {
  filterby?: EFilter;
  groupby?: EGroup;
}

export interface ISalaryStatByDepartment {
  [k: string]: ISalaryStat;
}

export interface ISalaryStatBySubDepartment {
  [k: string]: ISalaryStatByDepartment;
}
