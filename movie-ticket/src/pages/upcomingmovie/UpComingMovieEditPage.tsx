import * as Yup from "yup";
import { Status } from "../../config/constants";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Spin } from "antd";
import upcomingmovieService from "../../services/upcomingmovie.service";
import type { IUpComingMovieData } from "./UpComingMovieListPage";
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
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [movieDetail, setMovieDetail] = useState<IUpcomingMovieData>();
  const { setError } = useForm();

  // Submit form
  const submitForm = async (data: IUpComingMovieData) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        // @ts-ignore
        if (data[key] !== undefined && data[key] !== null) {
          // Special case for genre: convert string → array
          if (key === "genre") {
            formData.append(key, JSON.stringify([data.genre]));
          } else {
            // @ts-ignore
            formData.append(key, data[key]);
          }
        }
      });

      await upcomingmovieService.putRequest(
        `/upcoming-movie/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Congratulations", {
        description: "Upcoming Movie updated successfully",
      });
      navigate("/admin/upcoming-movies");
    } catch (exception: any) {
      if (exception.error) {
        Object.keys(exception.error).forEach((field) => {
          setError(field as keyof IUpComingMovieData, {
            message: exception.error[field],
          });
        });
      }
      toast.error("Sorry! Cannot update upcoming movie at this moment", {
        description:
          "There are some issues while submitting the form. Please try again.",
      });
    }
  };

  // Fetch existing movie detail
  const getMovieDetail = async () => {
    try {
      const response = await upcomingmovieService.getRequest(
        `/upcoming-movie/${params.id}`
      );
      setMovieDetail(response.data);
    } catch {
      toast.error("Error!", {
        description: "Error while fetching upcoming movie data...",
      });
      navigate("/admin/upcoming-movies");
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