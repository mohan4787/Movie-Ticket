import { useForm } from "react-hook-form";
import type { IMovieCreateData } from "../../pages/movies/MovieCreatePage";
import { SelectOptionsField, SingleFiledUpload, TextInput } from "../form/FormInput";
import { InputType, Status } from "../../config/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { CancleButton, SubmitButton } from "../button/FormButton";
import { useEffect, useState } from "react";

export interface IMovieFormProps {
  DTO: any;
  movieDetail?: IMovieCreateData | null;
  submitForm: (data: IMovieCreateData) => void;
}

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];
const MovieForm = ({submitForm,DTO,movieDetail}:Readonly<IMovieFormProps>) => {
    const [posterUrl, setPosterUrl] = useState<string>("https://placehold.com/120x180")
    
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IMovieCreateData>({
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      duration: 0,
      releaseDate: "",
      language: "",
      poster: null,
      rating: 0,
      status: Status.INACTIVE,
    },
    resolver: yupResolver(DTO) as any,
  });

 useEffect(() => {
  if (!movieDetail) return;

  setValue("title", movieDetail.title || "");
  setValue("description", movieDetail.description || "");
  setValue("genre", (movieDetail as any).genre || "");
  setValue("duration", movieDetail.duration || 0);
  setValue("releaseDate", movieDetail.releaseDate || "");
  setValue("language", movieDetail.language || "");
  setValue("rating", movieDetail.rating || 0);
  setValue("status", movieDetail.status || Status.INACTIVE);

  if ((movieDetail as any)?.poster?.optimizedUrl) {
    setPosterUrl((movieDetail as any).poster.optimizedUrl);
  }
}, [movieDetail, setValue]);
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="w-full flex flex-col gap-5">
        <div className="flex w-full">
          <label className="w-1/3">Title:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="title"
              errMsg={errors?.title?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label className="w-1/3">Description:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="description"
              type={InputType.TEXT}
              errMsg={errors?.description?.message}
            />
          </div>
        </div>
         <div className="flex w-full">
        <label className="w-1/3">Genre:{""}</label>
        <div className="w-2/3">
          <SelectOptionsField
            control={control}
            name="genre"
            options={genreOptions.map((g) => ({
              label: g,
              value: g,
            }))}
            errMsg={errors?.genre?.message}
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="w-1/3">Duration (min):{""}</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="duration"
            type={InputType.NUMBER}
            errMsg={errors?.duration?.message}
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="w-1/3">Release Date:{""}</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="releaseDate"
            type={InputType.DATE}
            errMsg={errors?.releaseDate?.message}
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="w-1/3">Language:{""}</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="language"
            errMsg={errors?.language?.message}
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="w-1/3">Rating:{""}</label>
        <div className="w-2/3">
          <TextInput
            control={control}
            name="rating"
            type={InputType.NUMBER}
            errMsg={errors?.rating?.message}
          />
        </div>
      </div>
      <div className="flex w-full">
        <label className="w-1/3">Status:{""}</label>
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
        <label className="w-1/3">Poster:{""}</label>
        <div className="flex w-2/3 gap-4">
          <div className="w-3/4">
            <SingleFiledUpload
              control={control}
              name="poster"
              setThumbUrl={setPosterUrl}
              errMsg={errors?.poster?.message as string}
            />
          </div>
          <div className="w-1/4">
            <img
              src={posterUrl}
              alt="Poster Preview"
              className="max-w-full h-auto rounded"
            />
          </div>
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
export default MovieForm;
