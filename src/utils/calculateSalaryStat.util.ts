import { IEmployees } from "../domain/interfaces/employees.interface";
import { ISalaryStat } from "../domain/interfaces/salaryStat.interface";

function calculateSalaryStat(salariesArr: IEmployees): ISalaryStat {
  let total = 0;
  const result = {
    mean: 0,
    min: Infinity,
    max: 0,
  };
  const salariesLength = salariesArr.length;
  for (let i = 0; i < salariesLength; i++) {
    total += salariesArr[i].salary;
    result.max = Math.max(result.max, salariesArr[i].salary);
    result.min = Math.min(result.min, salariesArr[i].salary);
  }
  result.mean = total / salariesLength;

  return result;
}
export default calculateSalaryStat;
