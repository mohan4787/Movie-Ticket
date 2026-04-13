import { toast } from "sonner";
import * as Yup from "yup";
import showtimeService from "../../services/showtime.service";
import ShowTimeForm from "../../components/showtime/ShowTimeForm";
import {  useParams } from "react-router";

export interface IShowTimeCreateData {
  movieId: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
}

const ShowTimeCreateDTO = Yup.object({
  movieId: Yup.string().required("Movie ID is required"),
  screen: Yup.string().min(1).max(50).required("Screen is required"),
  date: Yup.string().required("Date is required"), 
  startTime: Yup.string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Invalid time format"
    )
    .required("Start time is required"),
  endTime: Yup.string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Invalid time format"
    )
    .required("End time is required"),
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
    toast.error("Failed to create showtime");
  }
};

const ShowTimeCreatePage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">
          ShowTime Create
        </h1>
      </div>

      <div className="flex">
        <ShowTimeForm
          submitForm={submitForm}
          DTO={ShowTimeCreateDTO}
          id={id}
        />
      </div>
    </div>
  );
};

export default ShowTimeCreatePage;