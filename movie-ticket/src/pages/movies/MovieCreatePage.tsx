import { toast } from "sonner";
import { Status } from "../../config/constants";
import * as Yup from "yup";
import movieService from "../../services/movie.service";
import { useNavigate } from "react-router";
import MovieForm from "../../components/movies/MovieForm";
export interface IMovieCreateData {
  title: string;
  description?: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  poster: any;
  rating: number;
  status: (typeof Status)[keyof typeof Status];
}
const MovieCreateDTO = Yup.object({
  title: Yup.string().min(3).max(150).required(),
  description: Yup.string().required(),
  genre: Yup.string().required(),
  duration: Yup.number().nullable(),
  releaseDate: Yup.string().required(),
  language: Yup.string().required(),
  poster: Yup.mixed().required(),
  rating: Yup.number().required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
});

const MovieCreatePage = () => {
    const navigate = useNavigate();
  const submitForm = async (data: IMovieCreateData) => {
    try {
      await movieService.postRequest("movie", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Movie Created Successfully", {
        description: "Movie has been added to the database",
      });
      navigate("/admin/movie");
    } catch (exception: any) {
      toast.error(exception?.message || "Failed to create movie");
    }
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between border-b border-b-gray-400 pb-3">
          <h1 className="text-4xl font-semibold text-teal-900">Movie Create</h1>
        </div>
        <div className="flex ">
          <MovieForm submitForm={submitForm} DTO={MovieCreateDTO} />
        </div>
      </div>
    </>
  );
};

export default MovieCreatePage;
