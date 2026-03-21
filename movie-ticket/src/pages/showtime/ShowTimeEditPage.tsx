import * as Yup from "yup";
import { Status } from "../../config/constants";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spin } from "antd";
import showtimeService from "../../services/showtime.service";
import ShowTimeForm from "../../components/ShowTimeForm";


// ShowTime DTO Type
export interface IShowTimeCreateData {
  movie: string;
  screen: string;
  date: string;
  startTime: string;
  endTime: string;
  language: string;
  status: (typeof Status)[keyof typeof Status];
}

const ShowTimeEditDTO = Yup.object({
  movie: Yup.string().required("Movie is required"),
  screen: Yup.string().min(1).max(50).required("Screen is required"),
  date: Yup.date().required("Date is required"),
  startTime: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:mm format")
    .required("Start time is required"),
  endTime: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:mm format")
    .required("End time is required")
    .test(
      "end-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = value.split(":").map(Number);
        return eh > sh || (eh === sh && em > sm);
      }
    ),
  language: Yup.string().default("English").required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.ACTIVE),
});

const ShowTimeEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [showTimeDetail, setShowTimeDetail] = useState<IShowTimeCreateData>();
  const { setError } = useForm<IShowTimeCreateData>();

  const submitForm = async (data: IShowTimeCreateData) => {
    try {
      await showtimeService.putRequest(`/showtime/${params.id}`, data, {
        headers: { "Content-Type": "multipaet/formdata" },
      });
      toast.success("Congratulations", {
        description: "ShowTime updated successfully",
      });
      navigate("/admin/showtime");
    } catch (exception: any) {
      if (exception.error) {
        Object.keys(exception.error).forEach((field) => {
          setError(field as keyof IShowTimeCreateData, {
            message: exception.error[field],
          });
        });
      }
      toast.error("Sorry! Cannot update ShowTime at this moment", {
        description: "Seems there are some issues while submitting form. Please try again.",
      });
    }
  };

  const getShowTimeDetail = async () => {
    try {
      const response = await showtimeService.getRequest(`/showtime/${params.id}`);
      setShowTimeDetail(response.data);
    } catch {
      toast.error("Error!", { description: "Error while fetching showtime data..." });
      navigate("/admin/showtime");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getShowTimeDetail();
  }, [params.id]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">ShowTime Edit</h1>
      </div>
      <div className="flex">
        {loading ? (
          <div className="flex h-96 w-full justify-center items-center">
            <Spin />
          </div>
        ) : (
          <ShowTimeForm
            submitForm={submitForm}
            DTO={ShowTimeEditDTO}
            showTimeDetail={showTimeDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ShowTimeEditPage;