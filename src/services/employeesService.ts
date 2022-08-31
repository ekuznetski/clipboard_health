import { EFilter } from "../domain/enums/filterby.enum";
import { EGroup } from "../domain/enums/groupby.enum";
import { IEmployee, IEmployees, } from "../domain/interfaces/employees.interface";
import { IGetSalaryStatParams, } from "../domain/interfaces/salaryStat.interface";
import mockData from "../mockSalaries.json";
import calculateSalaryStat from "../utils/calculateSalaryStat.util";

let data = mockData;

async function addEmployee(newEmployee: IEmployee): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      data.push(newEmployee);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function deleteEmployee(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // for test task assume that name is uniq, in real app ofc it should be uniq ID, and we have to check that employee exists
    try {
      data = data.filter((e) => e.name !== name);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function getEmployees(
  filterby?: EFilter,
  groupby?: EGroup
): Promise<IEmployees> {

  // try to simulate DB behavior
  // in real app I assume grouping should be done on DB side, eg: 'aggregate' in mongo, or 'group by' in postgres

  return new Promise((resolve, reject) => {
    let result;
    try {
      if (filterby === EFilter.onContract) {
        result = data.filter((employee) => employee.on_contract);
      } else {
        result = data;
      }
      if (groupby) {
        result = result.reduce((acc: any, employee) => {
          const { department, sub_department: subdepartment } = employee;
          if (!acc[department]) {
            acc[department] = groupby === EGroup.subdepartment ? {} : [];
          }
          if (groupby === EGroup.subdepartment) {
            acc[department][subdepartment] = [
              employee,
              ...(acc[department][subdepartment] ?? []),
            ];
          } else {
            acc[department] = [employee, ...acc[department]];
          }
          return acc;
        }, {});
      }

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function getGroupedSalaryStats(employees: any): any {
  // i used any because the employee's object could be various, probably here would help function overloading
  const bySubDepartment = !Array.isArray(Object.values(employees)[0]);
  // if employees is object of arrays, this is mean groupby=department, and we don't need recursive call
  return Object.keys(employees).reduce((departmentAcc, key) => {
    return {
      ...departmentAcc,
      [key]: bySubDepartment
        ? getGroupedSalaryStats(employees[key])
        : calculateSalaryStat(employees[key]),
    };
  }, {});
}

function getSalaryStat({
  filterby,
  groupby,
}: IGetSalaryStatParams): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const employees = await getEmployees(filterby, groupby);
      if (groupby) {
        resolve(getGroupedSalaryStats(employees));
      } else {
        resolve(calculateSalaryStat(employees));
      }
    } catch (err) {
      reject(err);
    }
  });
}

const employeesService = {
  addEmployee,
  deleteEmployee,
  getSalaryStat,
};
export default employeesService;
