"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailInput, PasswordInput } from "../FormInput/forminput";
import { CredentialsDTO } from "../contract/contract";
import { useAuth } from "../../context/auth.context";
import authSvc from "../../services/auth.service";
import { toast } from "sonner";

export interface ICredentials {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(CredentialsDTO),
  });

  const { setLoggedInUserProfile } = useAuth();

  const submitForm = async (credentials: ICredentials) => {
    try {
      await authSvc.loginUser(credentials);
      const userProfileResponse = await authSvc.getLoggedInUserProfile();
      toast.success(
        "Welcome to " + userProfileResponse.data.role + " Panel!"
      );
      setLoggedInUserProfile(userProfileResponse.data);
      router.push("/");
    } catch (exception: unknown) {
      toast.error("Login failed");
    }
  };

  return (
    <>
      <div className="flex w-full flex-col border-b border-white/30 pb-3 mb-4">
        <h1 className="text-3xl font-semibold text-white text-center">
          Login
        </h1>
        <p className="text-sm text-gray-300 text-center">
          Login to book your favorite movies instantly
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col w-full gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-200">
            Email
          </label>
          <EmailInput
            control={control}
            name="email"
            errMsg={errors?.email?.message as string}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-200">
            Password
          </label>
          <PasswordInput
            control={control}
            name="password"
            errMsg={errors?.password?.message as string}
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/forget-password"
            className="text-xs text-gray-300 hover:text-white hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg transition hover:scale-95 hover:cursor-pointer"
        >
          Submit
        </button>

        <button
          type="reset"
          className="bg-teal-800 hover:bg-teal-900 text-white py-2 rounded-lg transition hover:scale-95 hover:cursor-pointer"
        >
          Cancel
        </button>
      </form>

      <div className="flex items-center my-4">
        <span className="h-px flex-1 bg-gray-500"></span>
        <span className="px-3 text-gray-300 text-sm">OR</span>
        <span className="h-px flex-1 bg-gray-500"></span>
      </div>

      <p className="text-center text-sm text-gray-300">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-red-400 hover:text-red-500 hover:underline"
        >
          Register now
        </Link>
      </p>
      <p className="text-center text-sm text-gray-300">
        Login as {" "}
        <Link
          href="http://localhost:5173/"
          className="text-red-400 hover:text-red-500 hover:underline"
        >
          Admin
        </Link>
      </p>
    </>
  );
};

export default LoginForm;