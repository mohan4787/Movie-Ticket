import * as Yup from "yup";
import { Status } from "../../config/constants";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spin } from "antd";
import upcomingmovieService from "../../services/upcomingmovie.service";
import UpComingMovieForm, { type IUpcomingMovieData } from "../../components/upcomingmovie/UpComingMovieForm";

const UpcomingMovieEditDTO = Yup.object({
  title: Yup.string().min(2).max(100).required(),
  description: Yup.string().nullable(),
  genre: Yup.string().required(),
  duration: Yup.number().nullable(),
  expectedReleaseDate: Yup.string().required(),
  language: Yup.string().required(),
  poster: Yup.mixed().nullable().optional(),
  teaserUrl: Yup.string().nullable().optional(),
  preBookingAvailable: Yup.boolean().required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
});

const UpcomingMovieEditPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [movieDetail, setMovieDetail] = useState<IUpcomingMovieData>();
  const formMethods = useForm<IUpcomingMovieData>();

  // Submit form
  const submitForm = async (data: IUpcomingMovieData) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        // @ts-ignore
        const value = data[key];
        if (value !== undefined && value !== null) {
          if (key === "genre") {
            formData.append(key, JSON.stringify([data.genre]));
          } else if (key === "preBookingAvailable") {
            formData.append(key, value ? "true" : "false");
          } else if (key === "poster" && value instanceof File) {
            formData.append("poster", value);
          } else if (key === "expectedReleaseDate") {
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, value);
          }
        }
      });

      await upcomingmovieService.putRequest(
        `/upcomingmovie/${params.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Upcoming Movie updated successfully");
      navigate("/admin/upcomingmovie"); // consistent route with create page
    } catch (exception: any) {
      if (exception?.error) {
        Object.keys(exception.error).forEach((field) => {
          formMethods.setError(field as keyof IUpcomingMovieData, {
            message: exception.error[field],
          });
        });
      }
      toast.error(
        "Cannot update upcoming movie at this moment",
        { description: "There are some issues while submitting the form. Please try again." }
      );
    }
  };

  // Fetch existing movie detail
  const getMovieDetail = async () => {
    try {
      const response = await upcomingmovieService.getRequest(
        `/upcomingmovie/${params.id}`
      );
      setMovieDetail(response.data);
    } catch {
      toast.error("Error while fetching upcoming movie data");
      navigate("/admin/upcomingmovie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getMovieDetail();
  }, [params.id]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">
          Upcoming Movie Edit
        </h1>
      </div>

      <div className="flex">
        {loading ? (
          <div className="flex h-96 w-full justify-center items-center">
            <Spin />
          </div>
        ) : (
          <UpComingMovieForm
            submitForm={submitForm}
            DTO={UpcomingMovieEditDTO}
            movieDetail={movieDetail}
          />
        )}
      </div>
    </div>
  );
};

export default UpcomingMovieEditPage;