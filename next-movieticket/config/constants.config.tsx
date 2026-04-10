export const UserRoles = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles];

export type Gender = "male" | "female" | "other";

export const Status = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type Status = (typeof Status)[keyof typeof Status]; 

export const InputType = {
  TEXT: "text",
  URL: "url",
  NUMBER: "number",
  DATE: "date",
  Time:"time"
} as const;

export type InputType = (typeof InputType)[keyof typeof InputType];

export const PaginationDefault = {
  page: 1,
  limit: 4,
  total: 0,
};

export interface IPaginationType {
  current: number;
  pageSize: number;
  total: number;
}

export interface IPaginationWithSearchType {
  page?: number;
  limit?: number;
  search?: null | string;
}

export interface IImageType {
  optimizedUrl: string;
  publicId: string;
  secureUrl: string;
}

export const IInputType = {
  Text:"text",
  URL:"url",
  Number:"number"
}
