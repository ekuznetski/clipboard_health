export interface IEmployee {
  name: string;
  salary: number;
  currency: string;
  on_contract?: boolean;
  department: string;
  sub_department: string;
}

export type IEmployees = IEmployee[];
