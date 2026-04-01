import { yupResolver } from "@hookform/resolvers/yup";
import { InputType, Status } from "../../config/constants";
import {
  SelectOptionsField,
  SingleFiledUpload,
  TextInput,
} from "../form/FormInput";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CancleButton, SubmitButton } from "../button/FormButton";

export interface IUpcomingMovieData {
  title: string;
  description?: string;
  genre: string[];
  duration?: number;
  expectedReleaseDate: string;
  language: string;
  teaserUrl?: string;
  poster?: any;
  preBookingAvailable: boolean;
  status: string;
}
export interface IUpComingMovieProps {
  DTO: any;
  movieDetail?: any;
  submitForm: (data: any) => void;
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
const UpComingMovieForm = ({
  DTO,
  movieDetail,
  submitForm,
}: Readonly<IUpComingMovieProps>) => {
  const [posterUrl, setPosterUrl] = useState("https://placehold.co/120x180");
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUpcomingMovieData>({
    defaultValues: {
      title: "",
      description: "",
      genre: [],
      duration: 0,
      expectedReleaseDate: "",
      language: "",
      teaserUrl: "",
      poster: null,
      preBookingAvailable: false,
      status: Status.INACTIVE,
    },
    resolver: yupResolver(DTO) as any,
  });
  useEffect(() => {
    if (!movieDetail) return;

    setValue("title", movieDetail.title || "");
    setValue("description", movieDetail.description || "");
    setValue("genre", movieDetail.genre || []);
    setValue("duration", movieDetail.duration || 0);
    setValue(
      "expectedReleaseDate",
      movieDetail.expectedReleaseDate?.split("T")[0] || "",
    );
    setValue("language", movieDetail.language || "");
    setValue("teaserUrl", movieDetail.teaserUrl || "");
    setValue("preBookingAvailable", movieDetail.preBookingAvailable || false);
    setValue("status", movieDetail.status || Status.INACTIVE);
    if (movieDetail?.poster?.optimizedUrl) {
      setPosterUrl(movieDetail.poster.optimizedUrl);
    }
  }, [movieDetail, setValue]);

  const onSubmit = (data: IUpcomingMovieData) => {
    const payload = {
      ...data,
      genre: data.genre || [],

      preBookingAvailable: data.preBookingAvailable === true,
      duration: data.duration ? Number(data.duration) : null,
      expectedReleaseDate: data.expectedReleaseDate
        ? new Date(data.expectedReleaseDate)
        : null,
      description: data.description || null,
      teaserUrl: data.teaserUrl || null,
      poster: data.poster || null,
    };

    submitForm(payload);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5"
      >
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
              mode="multiple"
              options={genreOptions.map((g) => ({
                label: g,
                value: g,
              }))}
              errMsg={errors?.genre?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label className="w-1/3">Duration:{""}</label>
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
          <label className="w-1/3">Expected Release Date:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="expectedReleaseDate"
              type={InputType.DATE}
              errMsg={errors?.expectedReleaseDate?.message}
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
          <label className="w-1/3">Teaser URL:{""}</label>
          <div className="w-2/3">
            <TextInput
              control={control}
              name="teaserUrl"
              errMsg={errors?.teaserUrl?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label className="w-1/3">Pre Booking:{""}</label>
          <div className="w-2/3">
            <SelectOptionsField
              control={control}
              name="preBookingAvailable"
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              errMsg={errors?.preBookingAvailable?.message}
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
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt="Poster Preview"
                  className="w-full h-auto rounded border"
                />
              )}
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

export default UpComingMovieForm;
