import { useEffect } from "react";
import type { IShowTimeCreateData } from "../../pages/showtime/ShowTimeCreatePage";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputType } from "../../config/constants";
import { TextInput } from "../form/FormInput";
import { useForm } from "react-hook-form";
import { CancleButton, SubmitButton } from "../button/FormButton";

export interface IShowTimeFormProps {
  DTO: any;
  id: string | undefined;
  showTimeDetail?: IShowTimeCreateData | null;
  submitForm: (data: IShowTimeCreateData) => void;
}

const ShowTimeForm = ({
  submitForm,
  DTO,
  id,
  showTimeDetail,
}: Readonly<IShowTimeFormProps>) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IShowTimeCreateData>({
    defaultValues: {
      movieId: "",
      screen: "",
      date: "",
      startTime: "",
      endTime: "",
    },
    resolver: yupResolver(DTO) as any,
  });

  useEffect(() => {
    if (id) {
      setValue("movieId", id);
    }
  }, [id, setValue]);

  useEffect(() => {
    if (!showTimeDetail) return;

    setValue("movieId", showTimeDetail.movieId || "");
    setValue("screen", showTimeDetail.screen || "");
    setValue("date", showTimeDetail.date || "");
    setValue("startTime", showTimeDetail.startTime || "");
    setValue("endTime", showTimeDetail.endTime || "");
  }, [showTimeDetail, setValue]);

  return (
    <form
      onSubmit={handleSubmit(
        (data) => {
          console.log("FORM SUBMITTED:", data); 
          submitForm(data);
        },
        (errors) => {
          console.log("FORM ERRORS:", errors); 
        }
      )}
      className="w-full flex flex-col gap-5"
    >
      <div className="flex w-full">
        <label className="w-1/3">Screen:</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="screen"
            errMsg={errors?.screen?.message}
          />
        </div>
      </div>

    
      <div className="flex w-full">
        <label className="w-1/3">Date:</label>
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
        <label className="w-1/3">Start Time:</label>
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
        <label className="w-1/3">End Time:</label>
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
        <div className="w-1/3"></div>
        <div className="flex gap-2 w-2/3">
          <CancleButton btnText="Cancel" isSubmitting={isSubmitting} />
          <SubmitButton btnText="Submit" isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default ShowTimeForm;