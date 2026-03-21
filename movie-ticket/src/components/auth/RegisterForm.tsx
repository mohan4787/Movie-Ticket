import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { EmailInput, PasswordInput, RadioButtonField, SelectOptionsField, SingleFiledUpload, TextInput } from "../form/FormInput";
import { RegisterDefault, RegisterDTO, type IRegisterUser } from "./contract";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";


const RegisterForm = () => {
  const navigate = useNavigate();
  const {control, handleSubmit, formState: {errors,isSubmitting}, setError}= useForm({
    defaultValues: RegisterDefault as IRegisterUser,
    resolver: yupResolver(RegisterDTO) as any
  });
  const submitRegisterData = async (data: IRegisterUser) => {
    try {
      console.log(data)
     const response = await authSvc.registerUser(data)
      toast.success(response.message)
      navigate("/")
    } catch (exception: any) {
      if(exception.error) {
        Object.keys(exception.error).map((field) => {
          setError(field as keyof IRegisterUser, {message:exception.error[field]})
        })
      }
      toast.error("Sorry! cannot register at this moment",{
          description: "Seems there are some issues while submitting form. Please try again."
        })
    }
  }
  return (
    <>
      <div className="flex w-full flex-col border-b border-white/30 pb-3 mb-4">
        <h1 className="text-3xl font-semibold text-white text-center">
          Register 
        </h1>
        <p className="text-sm text-gray-300 text-center">
          Join and book your favorite movies instantly
        </p>
      </div>

      <form onSubmit={handleSubmit(submitRegisterData)} className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-gray-200">
            Fullname
          </label>
          <TextInput
            name="name"
            control={control}
            errMsg={errors?.name?.message}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-200">Email</label>
          <EmailInput
             name="email"
              control={control}
              errMsg={errors?.email?.message}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-200">Password</label>
          <PasswordInput
             name="password"
              control={control}
              errMsg={errors?.password?.message}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ConfirmPassword" className="text-sm text-gray-200">Re-Password</label>
          <PasswordInput
             name="confirmPassword"
              control={control}
              errMsg={errors?.confirmPassword?.message}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm text-gray-200">Role</label>
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
         <div className="flex flex-col gap-1">
          <label htmlFor="gender" className="text-sm text-white">Gender</label>
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
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm text-gray-200">Phone</label>
          <TextInput
              name="phone"
              control={control}
              errMsg={errors?.phone?.message}
          />
        </div>
         <div className="flex flex-col gap-1">
          <label htmlFor="image" className="text-sm text-gray-200">Image</label>
          <SingleFiledUpload
             name="image"
              control={control}
              errMsg={errors?.image?.message as string}
          />
        </div>
        <button disabled={isSubmitting}  className="bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg transition hover:scale-95 hover:cursor-pointer disabled:bg-red-800/20 disabled:cursor-not-allowed ">
          Submit
        </button>

        <button disabled={isSubmitting} className="bg-teal-800 hover:bg-teal-900 text-white py-2 rounded-lg transition hover:scale-95 hover:cursor-pointer disabled:bg-teal-800/20 disabled:cursor-not-allowed">
          Cancel
        </button>
      </form>

      <div className="flex items-center my-4">
        <span className="h-px flex-1 bg-gray-500"></span>
        <span className="px-3 text-gray-300 text-sm">OR</span>
        <span className="h-px flex-1 bg-gray-500"></span>
      </div>

      <p className="text-center text-sm text-gray-300">
        Already register?{" "}
        <NavLink
          to="/"
          className="text-red-400 hover:text-red-500 hover:underline"
        >
          Login now
        </NavLink>
      </p>
    </>
  );
};

export default RegisterForm;
