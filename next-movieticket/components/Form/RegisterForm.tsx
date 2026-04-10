'use client';

import React from "react";
import { 
  EmailInput, 
  PasswordInput, 
  RadioButtonField, 
  SelectOptionsField, 
  SingleFiledUpload, 
  TextInput 
} from "../FormInput/forminput";
import { RegisterDefault, RegisterDTO, type IRegisterUser } from "../contract/contract";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import { useForm } from "react-hook-form";

// --- NEXT.JS SPECIFIC IMPORTS ---
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 

const RegisterForm = () => {
  // --- NEXT.JS ROUTER HOOK ---
  const router = useRouter(); 
  
  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<IRegisterUser>({
    defaultValues: RegisterDefault as IRegisterUser,
    resolver: yupResolver(RegisterDTO) as any
  });

  const submitRegisterData = async (data: IRegisterUser) => {
    try {
      const response = await authSvc.registerUser(data);
      toast.success(response.message || "Registration Successful!");
      
      // Navigate to home/login using Next.js router
      router.push("/"); 
    } catch (exception: any) {
      if (exception.error) {
        Object.keys(exception.error).forEach((field) => {
          setError(field as keyof IRegisterUser, { 
            message: exception.error[field] 
          });
        });
      }
      toast.error(exception.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex w-full flex-col border-b border-white/30 pb-3 mb-4">
        <h1 className="text-3xl font-semibold text-white text-center">Register</h1>
        <p className="text-sm text-gray-300 text-center">
          Join and book your favorite movies instantly
        </p>
      </div>

      <form onSubmit={handleSubmit(submitRegisterData)} className="flex flex-col w-full gap-4">
        {/* Fullname */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Fullname</label>
          <TextInput name="name" control={control} errMsg={errors?.name?.message} />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Email</label>
          <EmailInput name="email" control={control} errMsg={errors?.email?.message} />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Password</label>
          <PasswordInput name="password" control={control} errMsg={errors?.password?.message} />
        </div>

        {/* Re-Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Re-Password</label>
          <PasswordInput name="confirmPassword" control={control} errMsg={errors?.confirmPassword?.message} />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Role</label>
          <SelectOptionsField
            name="role"
            control={control}
            errMsg={errors?.role?.message}
            options={[
              { label: "Customer", value: "customer" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white">Gender</label>
          <RadioButtonField
            name="gender"
            control={control}
            errMsg={errors?.gender?.message}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Phone</label>
          <TextInput name="phone" control={control} errMsg={errors?.phone?.message} />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-200">Profile Image</label>
          <SingleFiledUpload
            name="image"
            control={control}
            errMsg={errors?.image?.message as string}
          />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button 
            type="submit"
            disabled={isSubmitting} 
            className="bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg transition hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? "Registering..." : "Submit"}
          </button>

          <button 
            type="button" 
            onClick={() => router.push("/")}
            disabled={isSubmitting} 
            className="bg-teal-800 hover:bg-teal-900 text-white py-2 rounded-lg transition hover:scale-95 disabled:opacity-50 shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="flex items-center my-4">
        <span className="h-px flex-1 bg-gray-500"></span>
        <span className="px-3 text-gray-300 text-sm">OR</span>
        <span className="h-px flex-1 bg-gray-500"></span>
      </div>

      <p className="text-center text-sm text-gray-300">
        Already registered?{" "}
        <Link href="/" className="text-red-400 hover:text-red-500 hover:underline">
          Login now
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;