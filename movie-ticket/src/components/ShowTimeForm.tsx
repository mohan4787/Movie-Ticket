import { useEffect } from "react";
import type { IShowTimeCreateData } from "../pages/showtime/ShowTimeCreatePage";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputType, Status } from "../config/constants";
import { SelectOptionsField, TextInput } from "./form/FormInput";
import { useForm } from "react-hook-form";
import { CancleButton, SubmitButton } from "./button/FormButton";

export interface IShowTimeFormProps {
  DTO: any;
  showTimeDetail?: IShowTimeCreateData | null;
  submitForm: (data: IShowTimeCreateData) => void;
}

const languageOptions = [
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "Nepali", value: "Nepali" },
];

const ShowTimeForm = ({
  submitForm,
  DTO,
  showTimeDetail,
}: Readonly<IShowTimeFormProps>) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IShowTimeCreateData>({
    defaultValues: {
     // movie: "",
      screen: "",
      date: "",
      startTime: "",
      endTime: "",
      language: "English",
      status: Status.ACTIVE,
    },
    resolver: yupResolver(DTO) as any,
  });
   useEffect(() => {
    if (!showTimeDetail) return;

    //setValue("movie", showTimeDetail.movie || "");
    setValue("screen", showTimeDetail.screen || "");
    setValue("date", showTimeDetail.date || "");
    setValue("startTime", showTimeDetail.startTime || "");
    setValue("endTime", showTimeDetail.endTime || "");
    setValue("language", showTimeDetail.language || "English");
    setValue("status", showTimeDetail.status || Status.ACTIVE);
  }, [showTimeDetail, setValue]);

  return (
    <>
      <form 
      onSubmit={handleSubmit(submitForm)}
       className="w-full flex flex-col gap-5">
        <div className="flex w-full">
          <label className="w-1/3">Movie:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="movie"
              errMsg={errors?.movie?.message}
            />
          </div>
        </div>
         <div className="flex w-full">
          <label className="w-1/3">Screen:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="screen"
              errMsg={errors?.screen?.message}
            />
          </div>
        </div>
         <div className="flex w-full">
        <label className="w-1/3">Date:{""}</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="date"
            type={InputType.DATE}
            errMsg={errors?.date?.message}
          />
        </div>
      </div>
         <div className="flex w-full">
          <label className="w-1/3">Start Time:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="startTime"
              type={InputType.Time}
              errMsg={errors?.startTime?.message}
            />
          </div>
        </div>
         <div className="flex w-full">
          <label className="w-1/3">End Time:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="endTime"
              type={InputType.Time}
              errMsg={errors?.endTime?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
        <label className="w-1/3">Language:</label>
        <div className="w-2/3">
          <SelectOptionsField
            control={control}
            name="language"
            options={languageOptions}
            errMsg={errors?.language?.message}
          />
        </div>
      </div>
         <div className="flex w-full">
        <label className="w-1/3">Status:</label>
        <div className="w-2/3">
          <SelectOptionsField
            control={control}
            name="status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            errMsg={errors?.status?.message}
          />
        </div>
      </div>
       <div className="flex w-full">
        <div className="w-1/3"></div>
        <div className="flex gap-2 w-2/3">
          <CancleButton btnText="Cancel" isSubmitting={isSubmitting} />
          <SubmitButton btnText="Submit" isSubmitting={isSubmitting} />
        </div>
      </div>
      </form>
    </>
  );
};

export default ShowTimeForm;
