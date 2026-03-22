import * as Yup from "yup";
import { Status } from "../../config/constants";
import {  useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { IMovieData } from "./MovieListPage";
import { useForm } from "react-hook-form";
import type { IMovieCreateData } from "./MovieCreatePage";
import { toast } from "sonner";
import movieService from "../../services/movie.service";
import { Spin } from "antd";
import MovieForm from "../../components/movies/MovieForm";

const MovieEditDTO = Yup.object({
  title: Yup.string().min(3).max(150).required(),
  description: Yup.string().nullable(),
  genre: Yup.string().required(),
  duration: Yup.number().required(),
  releaseDate: Yup.string().required(),
  language: Yup.string().required(),
  poster: Yup.mixed().nullable().optional(),
  rating: Yup.number().min(0).max(10).required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
});
const MovieEditPage = ()  => {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [movieDetail, setMovieDetail] = useState<IMovieData>();
    const {setError} = useForm();

    const submitForm = async (data: IMovieCreateData) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                // @ts-ignore
                if(data[key] !== undefined && data[key] !== null){
                    // @ts-ignore
                    formData.append(key, data[key]);
                }
            });
            await movieService.putRequest(`/movie/${params.id}`, formData, {
                 headers: {
                  "Content-Type": "multipart/form-data",
                },
            })
            
      toast.success("Congratulations", {
        description: "Movie updated successfully",
      });
      navigate("/admin/movie")
        } catch (exception: any) {
            if (exception.error) {
        Object.keys(exception.error).forEach((field) => {
          setError(field as keyof IMovieCreateData, {
            message: exception.error[field],
          });
        });
        }
         toast.error("Sorry! Cannot update movie at this moment", {
        description:
          "Seems there are some issues while submitting form. Please try again.",
      });
    }
    }
    const getMovieDetail = async () => {
        try {
            const response = await movieService.getRequest(`/movie/${params.id}`)
            setMovieDetail(response.data)
        } catch  {
            toast.error("Error!",{
                description: "Error while fetching movie data...",
            });
            navigate("/admin/movies")
        } finally {
            setLoading(false);
        }
    }
   useEffect(() => {
  if (params.id) getMovieDetail();
}, [params.id]);
    return(<> 
     <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">Movie Edit</h1>
      </div>
      <div className="flex">
        {loading ? (
          <div className="flex h-96 w-full justify-center items-center">
            <Spin />
          </div>
        ) : (
          <MovieForm
            submitForm={submitForm}
            DTO={MovieEditDTO}
            movieDetail={movieDetail}
          />
        )}
      </div>
    </div>
    </>)
}

export default MovieEditPage;