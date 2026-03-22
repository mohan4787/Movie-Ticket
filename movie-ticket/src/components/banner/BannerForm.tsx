import type { IBannerCreateData } from "../../pages/banners/BannerCreatePage";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputType, Status } from "../../config/constants";
import {
  SelectOptionsField,
  SingleFiledUpload,
  TextInput,
} from "../../components/form/FormInput";
import { CancleButton, SubmitButton } from "../../components/button/FormButton";
import { useEffect, useState } from "react";
import type { IBannerData } from "../../pages/banners/BannerListPage";

export interface IBannerFormProps {
  DTO: any;
  bannerDetail?: IBannerData | null;
  submitForm: (data: IBannerCreateData) => void;
}

const BannerForm = ({
  submitForm,
  DTO,
  bannerDetail,
}: Readonly<IBannerFormProps>) => {
  const [thumbUrl, setThumbUrl] = useState<string>(
    "https://placehold.com/300x100",
  );
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<IBannerCreateData>({
    defaultValues: {
      title: "",
      status: Status.INACTIVE,
      link: "",
      image: null,
    },
    resolver: yupResolver(DTO) as any,
  });
  useEffect(() => {
    if (bannerDetail) {
     setValue("title", bannerDetail.title);
     setValue("link", bannerDetail.link as string);
    // setValue("status",bannerDetail.status || null);
     setThumbUrl(bannerDetail.image?.optimizedUrl);
    }
  }, [bannerDetail, setValue]);
  return (
    <>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="w-full flex flex-col gap-5"
      >
        <div className="flex w-full">
          <label htmlFor="title" className="w-1/3">
            Title:{" "}
          </label>
          <div className="flex w-2/3 flex-col">
            <TextInput
              control={control}
              name="title"
              errMsg={errors?.title?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label htmlFor="link" className="w-1/3">
            Link:{" "}
          </label>
          <div className="flex w-2/3 flex-col">
            <TextInput
              control={control}
              name="link"
              type={InputType.URL}
              errMsg={errors?.link?.message}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label htmlFor="status" className="w-1/3">
            Status:{" "}
          </label>
          <div className="flex w-2/3 flex-col">
            <SelectOptionsField
              control={control}
              name="status"
              errMsg={errors?.status?.message}
              options={[
                { label: "Publish", value: "active" },
                { label: "Un-Publish", value: "inactive" },
              ]}
            />
          </div>
        </div>
        <div className="flex w-full">
          <label htmlFor="image" className="w-1/3">
            Image:{" "}
          </label>
          <div className="flex w-2/3">
            <div className="flex w-3/4 flex-col">
              <SingleFiledUpload
                control={control}
                name="image"
                setThumbUrl={setThumbUrl}
                errMsg={errors?.image?.message as string}
              />
            </div>
            <div className="flex w-1/4">
              <img src={thumbUrl} alt="" />
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-1/3"></div>
          <div className="flex w-2/3 gap-2">
            <CancleButton btnText="Cancel" isSubmitting={isSubmitting} />
            <SubmitButton btnText="Submit" isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </>
  );
};

export default BannerForm;
