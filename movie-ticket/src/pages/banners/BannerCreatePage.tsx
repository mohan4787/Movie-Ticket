import { Status } from "../../config/constants";
import * as Yup from "yup";

import { toast } from "sonner";
import bannerService from "../../services/banner.service";
import { useNavigate } from "react-router";
import BannerForm from "../../components/banner/BannerForm";

export interface IBannerCreateData {
  title: string;
  status: typeof Status[keyof typeof Status];
  link: string;
  image: any;
}

const BannerCreateDTO = Yup.object({
  title: Yup.string().min(3).max(100).required(),
  status: Yup.string()
    .matches(/^(active|inactive)$/)
    .default(Status.INACTIVE),
  link: Yup.string().nullable().required(),
  image: Yup.mixed().required(),
});

const BannerCreatePage = () => {
  const navigate = useNavigate();
  const submitForm = async (data: IBannerCreateData) => {
    try {
      await bannerService.postRequest("banner", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Congratulation", {
        description: "Banner Created Successfully",
      });
      navigate("/admin/banner");
    } catch (exception: any) {}
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between border-b border-b-gray-400 pb-3">
          <h1 className="text-4xl font-semibold text-teal-900">
            Banner Create
          </h1>
        </div>
        <div className="flex">
          <BannerForm submitForm={submitForm} DTO={BannerCreateDTO} />
        </div>
      </div>
    </>
  );
};

export default BannerCreatePage;
