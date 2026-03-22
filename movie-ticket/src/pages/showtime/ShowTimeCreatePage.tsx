import { toast } from "sonner";
import { Status } from "../../config/constants";
import * as Yup from "yup";
import showtimeService from "../../services/showtime.service";
import ShowTimeForm from "../../components/ShowTimeForm";

export interface IShowTimeCreateData {
  movie: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
  language: string;
  status: (typeof Status)[keyof typeof Status];
}
const ShowTimeCreateDTO = Yup.object({
  movie: Yup.string().required(),
  screen: Yup.string().min(1).max(50).required(),
  date: Yup.date().required(),
  startTime: Yup.string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "startTime must be in HH:mm format",
    )
    .required(),
  endTime: Yup.string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "endTime must be in HH:mm format",
    )
    .required(),
  language: Yup.string().default("English"),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
});

const submitForm = async (data: IShowTimeCreateData) => {
  try {
    await showtimeService.postRequest("showtime", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("ShowTime Created Successfully", {
      description: "ShowTime has been added to the database",
    });
  } catch (exception: any) {
    toast.error(exception?.message || "Failed to create showtime");
  }
};

const ShowTimeCreatePage = () => {
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between border-b border-b-gray-400 pb-3">
          <h1 className="text-4xl font-semibold text-teal-900">
            ShowTime Create
          </h1>
        </div>
        <div className="flex">
          <ShowTimeForm submitForm={submitForm} DTO={ShowTimeCreateDTO} />
        </div>
      </div>
    </>
  );
};

export default ShowTimeCreatePage;
