import * as Yup from "yup";
import type { Gender, UserRoles } from "../../config/constants.config";

import { UserRoles as UserRolesValue } from "../../config/constants.config";

export interface ICredentials {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRoles;
  gender: Gender | null;
  phone: string | null;
  address?: {
    billingAddress: string;
    shippingAddress: string;
  };
  dob?: Date;
  image: any;
}

export const CredentialsDTO = Yup.object({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;

export const RegisterDTO = Yup.object({
  name: Yup.string().min(2).max(50).required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords and confirmpassword must match"
  ),
  role: Yup.string()
    .matches(/^(customer|admin)$/)
    .default("customer"),
  gender: Yup.string()
    .matches(/^(male|female|other)$/)
    .nullable(),
  phone: Yup.string().matches(/^(?:\+977[- ]?)?(?:\d{1,3}[- ]?)?\d{6,10}$/).nullable(),
  dob: Yup.date().nullable(),
  image: Yup.mixed().nullable(),
});

//matches(/^(?:\\+977[-]?)?(?:\\d{1,3}[-]?)?\\d{6,10}$/, "phone number must be a valid nepali number ")

export const RegisterDefault = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: UserRolesValue.CUSTOMER,
  gender: null,
  phone: "",
  image: null,
};
