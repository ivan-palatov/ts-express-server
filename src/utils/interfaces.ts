import { InstanceType } from "typegoose";

export interface IPaginateResult<T> {
  docs: [InstanceType<T>];
  total: number;
  limit: number;
  page?: number;
  pages?: number;
  offset?: number;
}

export interface IPaginateOptions {
  select?: object | string;
  sort?: object | string;
  populate?: object[] | string[] | object | string;
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
}