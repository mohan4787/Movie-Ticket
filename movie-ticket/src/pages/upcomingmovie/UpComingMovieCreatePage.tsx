import * as Yup from "yup";
import { Status } from "../../config/constants";
import { useNavigate } from "react-router";
import type { IUpComingMovieData } from "./UpComingMovieListPage";
import { toast } from "sonner";
import upcomingmovieService from "../../services/upcomingmovie.service";
import UpComingMovieForm from "../../components/upcomingmovie/UpComingMovieForm";

// Yup DTO aligned with backend
export const UpcomingMovieCreateDTO = Yup.object({
  title: Yup.string().min(2).max(100).required(),
  description: Yup.string().nullable(),
  genre: Yup.string().required(),
  duration: Yup.number().nullable(),
  expectedReleaseDate: Yup.string().required(),
  language: Yup.string().required(),
  poster: Yup.mixed().nullable().notRequired(),
  teaserUrl: Yup.string()
    .nullable()
    .notRequired()
    .url("Please enter a valid URL"),
  preBookingAvailable: Yup.boolean().required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
});

const UpComingMovieCreatePage = () => {
  const navigate = useNavigate();

  const submitForm = async (data: IUpComingMovieData) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        // @ts-ignore
        const value = data[key];
        if (value !== undefined && value !== null) {
          if (key === "genre") {
            // backend expects array
            formData.append(key, JSON.stringify([data.genre]));
          } else if (key === "preBookingAvailable") {
            // boolean must be string "true"/"false"
            formData.append(key, value ? "true" : "false");
          } else if (key === "poster" && value instanceof File) {
            formData.append("poster", value);
          } else if (key === "expectedReleaseDate") {
            // ensure ISO date string
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, value);
          }
        }
      });

      await upcomingmovieService.postRequest("/upcomingmovie", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Upcoming Movie Created Successfully", {
        description: "Upcoming movie has been added to the database",
      });

      navigate("/admin/upcomingmovie");
    } catch (exception: any) {
      toast.error(
        exception?.response?.data?.message || exception?.message || "Failed to create upcoming movie"
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">
          Upcoming Movie Create
        </h1>
      </div>

      <div className="flex">
        <UpComingMovieForm submitForm={submitForm} DTO={UpcomingMovieCreateDTO} />
      </div>
    </div>
  );
};

export default UpComingMovieCreatePage;